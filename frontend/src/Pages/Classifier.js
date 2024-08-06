import React, { useState, useEffect } from 'react';
import * as ort from 'onnxruntime-web';

const SkinCancerClassifier = () => {
  const [model, setModel] = useState(null);
  const [inputData, setInputData] = useState(null); // Assume this will hold your input image data
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    // Load the ONNX model
    const loadModel = async () => {
      try {
        const session = await ort.InferenceSession.create('/skin_cancer_model.onnx');
        setModel(session);
      } catch (err) {
        console.error('Failed to load the model:', err);
      }
    };
    loadModel();
  }, []);

  const runModel = async () => {
    if (!model || !inputData) return;

    try {
      // Preprocess input data as required by your model
      const inputTensor = new ort.Tensor('float32', inputData, [1, 3, 28, 28]);

      // Run inference
      const feeds = { input: inputTensor };
      const results = await model.run(feeds);

      // Extract and use the output (assuming the model has a single output named 'output')
      const output = results.output.data;
      setPrediction(output);
    } catch (err) {
      console.error('Failed to run the model:', err);
    }
  };

  return (
    <div>
      <h1>Skin Cancer Classifier</h1>
      {/* Add UI elements to load input data and trigger the runModel function */}
      <button onClick={runModel}>Run Model</button>
      <p>The predicted class is: </p>
      {prediction && <div>Prediction: {prediction}</div>}
    </div>
  );
};

export default SkinCancerClassifier;
