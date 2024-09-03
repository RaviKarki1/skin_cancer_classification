import React, {useState, useEffect} from "react"
import './App.css';
import SkinCancerClassifier from "./Pages/Classifier"
import PhotoUpload from './Components/PhotoUpload';

function App() {
  const [photo, setPhoto] = useState();
  const [photoUploaded, setPhotoUploaded] = useState();
  const [predicted, setPredicted] = useState();
  //api test
  // const [time, setTime] = useState();
  
  // useEffect(() => {
  //   fetch('/time')
  //               .then(response => response.json())
  //               .then(data => {
  //                 console.log(data)
  //                 setTime(data.time)
  //               })
  //               .catch(error => console.error(error))
  // }, []);

  const handlePredicted = (newState) => {
    setPredicted(newState);
  }

  const uploadStatus = (uploadStatus, img) => {
    setPhotoUploaded(uploadStatus)
    setPhoto(img);
    console.log("img in app: "+img.name)
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
              curImg = {photo}
            />
          }
        </div>
      </div>
          {/* <p>The current time is {time}</p> */}
    </div>
  );
}

export default App;
