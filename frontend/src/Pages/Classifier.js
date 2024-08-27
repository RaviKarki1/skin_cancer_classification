import React, { useState, useEffect } from 'react';
import * as ort from 'onnxruntime-web';

const SkinCancerClassifier = (props) => {
  const [prediction, setPrediction] = useState(null);

  const [pred, setPred] = useState();

  const runModel = async () => {
    //test
    setPred(true);
    props.predictionStatus(true)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', props.curImg)
    console.log(formData)

    try{
        const response = await fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
        })

        if(response.ok){
            const data = await response.json();
            console.log('File uploaded successfully', data)
            console.log("return message: "+data.message)
            //TODO: update it later to eb prediction
            setPrediction(data.message)
        }else{
            console.error('File upload failed:', response.statusText);
        }
    }catch(e){
        console.error('File upload error: ', e)
    }
}

  return (
    <form 
      className="pred-result"
      onSubmit={handleSubmit}>
      {/* Add UI elements to load input data and trigger the runModel function */}
      <button onClick={runModel}>Predict</button>
      {pred && <div className="prediction-container">
        <p>The predicted class is: </p>
        {prediction && <div>{prediction}</div>}
      </div>}
    </form>
  );
};

export default SkinCancerClassifier;
