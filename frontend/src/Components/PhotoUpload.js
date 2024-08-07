const PhotoUpload = () => {
    const handleClick = () => {
        console.log("upload photo....")
    }

    return(
        <div className="upload">
            <button className="up-btn" onClick={handleClick}>Upload</button>
        </div>
    )
}

export default PhotoUpload;