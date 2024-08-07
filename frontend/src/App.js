import './App.css';
import SkinCancerClassifier from "./Pages/Classifier"
import PhotoUpload from './Components/PhotoUpload';

function App() {
  return (
    <div className="App">
      <SkinCancerClassifier/>
      <PhotoUpload/>
    </div>
  );
}

export default App;
