async function classifyImage() {
    const imageElement = document.getElementById('uploadedImage');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 224;
    canvas.height = 224;
    context.drawImage(imageElement, 0, 0, 224, 224);

    const imageData = context.getImageData(0, 0, 224, 224);
    const data = imageData.data;
    const input = new Float32Array(1 * 3 * 224 * 224);

    for (let i = 0; i < 224 * 224; i++) {
        input[i] = data[i * 4] / 255.0;       // R
        input[224 * 224 + i] = data[i * 4 + 1] / 255.0; // G
        input[2 * 224 * 224 + i] = data[i * 4 + 2] / 255.0; // B
    }

    const inputTensor = new onnx.Tensor(input, 'float32', [1, 3, 224, 224]);

    // const session = new onnx.InferenceSession();
    // await session.loadModel('http://localhost:8000/dog_cat_model.onnx');
    // const outputMap = await session.run([inputTensor]);
    // const outputTensor = outputMap.values().next().value;
    
    // const outputData = outputTensor.data;
    // const classIndex = outputData.indexOf(Math.max(...outputData));
    // const className = classIndex === 0 ? 'Dog' : 'Cat';

    // document.getElementById('result').innerText = `Classified as: ${className}`;
}

// var loadFile = function(event){

//     var img = document.getElementById("uploadedImage");
//     img.src = URL.createObjectURL(event.target.files[0]);
//     img.style.display = "block";
// }

document.getElementById('imageUpload').addEventListener('change', function(event) {
    console.log("upload image clikced")
    const reader = new FileReader();
    
    var img = document.getElementById("uploadedImage");
    img.src = URL.createObjectURL(event.target.files[0])
    img.style.display = "block";

    // document.getElementById("uploadedImage")
    // reader.onload = function() {
    //     const image = document.getElementById('uploadedImage');
    //     image.src = reader.result;
    //     image.onload = classifyImage;
    // };
    // reader.readAsDataURL(event.target.files[0]);
});