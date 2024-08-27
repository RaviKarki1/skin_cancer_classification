import time
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3000"])

@app.route('/upload', methods=['POST'])
def upload_file():
    print("photo upload initialised")
    if 'file' not in request.files:
        return jsonify({"error":"No file found"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error" : "No selected file"}), 400
    
    if file:
        return jsonify({
            "message":"flask prediction"
        })
        

if __name__ == "__main__":
    app.run(debug=True)