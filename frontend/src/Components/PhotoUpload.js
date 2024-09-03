import React, {useState} from "react";

const PhotoUpload = (props) => {
    const [photo, setPhoto] = useState();

    const handleChange = (e) => {
        console.log("upload photo....")
        // setPhoto(URL.createObjectURL(e.target.files[0]))
        let curImg = e.target.files[0]
        setPhoto(curImg)
        console.log("Photo in upload: ",curImg)
        props.uploadStatus(true, curImg)
    }

    return(
        <div className="upload">
            <div className="photo-container">
                {photo && <img className="uploadedImage centered"
                                src={URL.createObjectURL(photo)}
                                alt="uploadedImage"/>}
            </div>

            {!props.photoUploaded && 
                <div className="up-btn-cont" 
                    // onSubmit={handleSubmit}
                >
                    <button className="uploadButton centered"
                        onClick={() => document.getElementById('fileInput').click()}>
                        Select Image
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