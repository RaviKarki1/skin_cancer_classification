import React, {useState} from "react"
import './App.css';
import SkinCancerClassifier from "./Pages/Classifier"
import PhotoUpload from './Components/PhotoUpload';

function App() {
  const [photoUploaded, setPhotoUploaded] = useState();
  const [predicted, setPredicted] = useState();

  const handlePredicted = (newState) => {
    setPredicted(newState);
  }

  const uploadStatus = (newState) => {
    setPhotoUploaded(newState)
  }


  return (
    <div className="App">
      <h1>Skin Cancer Classifier</h1>
      <div className="predictions">
        <div className="upload-container">
          <PhotoUpload 
            uploadStatus={uploadStatus}
          />
        </div>
        <div className="pred-container">
          {photoUploaded && 
            <SkinCancerClassifier 
              predictionStatus={handlePredicted}
            />
          }
        </div>
      </div>

    </div>
  );
}

export default App;
