import React, {useState} from "react";

const PhotoUpload = (props) => {
    const [photo, setPhoto] = useState();

    const handleChange = (e) => {
        console.log("upload photo....")
        setPhoto(URL.createObjectURL(e.target.files[0]))
        props.uploadStatus(true)
    }

    return(
        <div className="upload">
            <div className="photo-container">
                {photo && <img className="uploadedImage centered" src={photo} alt="uploadedImage"/>}
            </div>

            {!props.photoUploaded && <div className="up-btn-cont">
                <button className="uploadButton centered" onClick={() => document.getElementById('fileInput').click()}>
                    Upload Image
                </button>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                />
            </div>}
            
        </div>
    )
}

export default PhotoUpload;