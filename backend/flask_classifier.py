from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

def double_conv(in_channels, out_channels):
    conv = nn.Sequential(
        nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
        nn.ReLU(inplace=True),
        nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1),
        nn.ReLU(inplace=True)
    )
    return conv

def crop_tensor(tensor, target_tensor):
    target_size = target_tensor.size()[2]
    tensor_size = tensor.size()[2]
    delta = tensor_size - target_size
    delta = delta // 2
    return tensor[
        :,
        :,
        delta:tensor_size-delta,
        delta:tensor_size-delta
    ]

class UNet(nn.Module):
    def __init__(self, in_channels=3, out_channels=1):
        super(UNet, self).__init__()
        self.max_pool_2x2 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.down_conv_1 = double_conv(3, 64)
        self.down_conv_2 = double_conv(64, 128)
        self.down_conv_3 = double_conv(128, 256)
        self.down_conv_4 = double_conv(256, 512)
        self.down_conv_5 = double_conv(512, 1024)
        self.up_trans_1 = nn.ConvTranspose2d(1024, 512, kernel_size=2, stride=2)
        self.up_conv_1 = double_conv(1024, 512)
        self.up_trans_2 = nn.ConvTranspose2d(512, 256, kernel_size=2, stride=2)
        self.up_conv_2 = double_conv(512, 256)
        self.up_trans_3 = nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2)
        self.up_conv_3 = double_conv(256, 128)
        self.up_trans_4 = nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2)
        self.up_conv_4 = double_conv(128, 64)
        self.out = nn.Conv2d(64, out_channels, kernel_size=1)

    def forward(self, image):
        x1 = self.down_conv_1(image)
        x2 = self.max_pool_2x2(x1)
        x3 = self.down_conv_2(x2)
        x4 = self.max_pool_2x2(x3)
        x5 = self.down_conv_3(x4)
        x6 = self.max_pool_2x2(x5)
        x7 = self.down_conv_4(x6)
        x8 = self.max_pool_2x2(x7)
        x9 = self.down_conv_5(x8)
        x = self.up_trans_1(x9)
        y = crop_tensor(x7, x)
        x = self.up_conv_1(torch.cat([x, y], axis=1))
        x = self.up_trans_2(x)
        y = crop_tensor(x5, x)
        x = self.up_conv_2(torch.cat([x, y], axis=1))
        x = self.up_trans_3(x)
        y = crop_tensor(x3, x)
        x = self.up_conv_3(torch.cat([x, y], axis=1))
        x = self.up_trans_4(x)
        y = crop_tensor(x1, x)
        x = self.up_conv_4(torch.cat([x, y], axis=1))
        out = self.out(x)
        
        return out

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3000"])

# segmentation model
try:
    segmentation_model = UNet()
    segmentation_model.load_state_dict(torch.load('segmentation_model_v2_state_dict.pth', map_location=device, weights_only=True))
    segmentation_model.to(device)
    segmentation_model.eval()
except Exception as e:
    print(f"Error loading segmentation model: {e}")

#classification model
try:
    model = torch.load('seg_classif_lrReg.pth', map_location=device, weights_only=False)
    model.to(device)
    model.eval()
except Exception as e:
    print(f"Error loading classification model: {e}")

#transformation for the input image
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def concatenate_images(original_images, segmentation_model):
    with torch.no_grad():
        segmented_images = segmentation_model(original_images)
    
    if segmented_images.shape[1] == 1:
        segmented_images = segmented_images.repeat(1, 3, 1, 1)
    
    concatenated_images = torch.cat((original_images, segmented_images), dim=1)
    return concatenated_images

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    print("File received.")
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    img = Image.open(io.BytesIO(file.read()))
    img = img.convert('RGB')

    img_tensor = transform(img).unsqueeze(0).to(device)
    
    concatenated_input = concatenate_images(img_tensor, segmentation_model)

    print("Concatenation done.")
    with torch.no_grad():
        output = model(concatenated_input)
    
    print("Model created.")
    _, predicted_class = torch.max(output, 1)
    message = 'malignant' if predicted_class.item() == 1 else 'benign'
    print(f"Result: {message}")
    return jsonify({'message': message})

if __name__ == '__main__':
    app.run(port=5001)
