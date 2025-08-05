import React, { useEffect, useRef, useState } from "react";
import "./ImageUpload.scss";
import Attachment from "../../../assets/images/attachment.png";
import { uploadFileAPI, deleteFileAPI } from "../../../services/apiservices";
import SpinnerComponent from "../../common/ui/spinner/SpinnerComponent";
import UploadedImageGallery from "./UploadedImageGallery.js";
import { validateImage } from "../../../utils/ValidateImage.js";

const ImageUpload = React.memo(({ id, onUploadSuccess, onDeleteSuccess, category, allowMultiple = "true", defaultImages = [] }) => {
  const [imageTitle, setImageTitle] = useState("");
  const [uploadedImages, setUploadedImages] = useState(defaultImages);
  const [loader, setLoader] = useState(false);
  const [apiErrors, setApiErrors] = useState(false);
  const [apiSuccess, setApiSuccess] = useState("");
  const imageInputRef = useRef(null);

  const handleDeleteImage = (e, fileID) => {
    e.preventDefault();
    const payload = { id: fileID };
    const deleteImage = async () => deleteFileAPI(payload, category);

    deleteImage()
      .then((response) => {
        setLoader(false);
        if (response) {
          const updatedImages = uploadedImages.filter((item) => item.id !== fileID);
          setUploadedImages(updatedImages);
          setApiSuccess("Image deleted successfully");
          onDeleteSuccess(fileID, id);
          resetImageInput();
          setTimeout(() => setApiSuccess(""), 5000);
        } else {
          setApiErrors(response?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        const errMsg = error?.response?.data?.message || error?.message;
        setApiErrors(errMsg);
      });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setImageTitle(newTitle);
    if (newTitle) setApiErrors("");
  };

  const handleImageAttach = (event) => {
    if (!imageTitle) {
      setApiErrors("Please enter Image Title");
      return;
    }

    const file = event.target.files[0];
    if (!file) {
      setApiErrors("Please select an image");
      return;
    }

    const { isValid, error } = validateImage(file);
    if (!isValid) {
    setApiErrors(error);
    resetImageInput();
    return;
  }
    setApiErrors(""); 
    if (!allowMultiple && uploadedImages.length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", imageTitle);
    formData.append("fileUploadType", id);

    const uploadImage = async () => uploadFileAPI(formData, category);

    uploadImage()
      .then((response) => {
        setLoader(false);
        if (response) {
            const imageDetails = {
                fileKey: file.name,
                title: imageTitle,
                id: response
              };
          setUploadedImages((prev) => [...prev, imageDetails]);
          onUploadSuccess(imageDetails, id);
          setImageTitle("");
          setApiSuccess("Image uploaded successfully");
          setTimeout(() => setApiSuccess(""), 5000);
        } else {
          setApiErrors(response?.message);
          resetImageInput();
        }
      })
      .catch((error) => {
        setLoader(false);
        resetImageInput();
        const errMsg = error?.response?.data?.message || error?.message;
        setApiErrors(errMsg);
      });
  };

  const resetImageInput = () => {
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  useEffect(() => {
    if (defaultImages.length > 0) {
      setUploadedImages(defaultImages);
    }
  }, [defaultImages]);

  return (
    <div className="ImageUpload">
      <div className="imageUploadRow">
        <div className="imageUploadControls">
          <input
            type="text"
            value={imageTitle}
            id={`imageTitle${id}`}
            onChange={handleTitleChange}
            placeholder="Enter image title"
            className="imageUploadTitle"
            disabled={loader}
          />
          <input
            type="file"
            onChange={handleImageAttach}
            className="imageUploadAttach"
            id={`imageUploadInput${id}`}
            ref={imageInputRef}
            accept="image/*"
            disabled={
              loader || (!allowMultiple && uploadedImages.length > 0) || !imageTitle
            }
          />
          <label
            htmlFor={`imageUploadInput${id}`}
            className="imageUploadIcon"
            title={
              !allowMultiple && uploadedImages.length > 0
                ? "Multiple image upload not enabled"
                : !imageTitle
                ? "Please enter Image Title"
                : ""
            }
          >
            <img src={Attachment} alt="Attachment" />
          </label>
        </div>
        {apiSuccess && <p className="mt-2">{apiSuccess}</p>}
        {apiErrors && <p className="is-invalid-border-only mt-2">{apiErrors}</p>}
        {loader && (
          <div className="d-flex align-items-center mt-2">
            <SpinnerComponent /> <p>Uploading...</p>
          </div>
        )}
        <UploadedImageGallery
          uploadedImages={uploadedImages}
          isViewOnly={false}
          handleDeleteImage={handleDeleteImage}
        />
      </div>
    </div>
  );
});

export default ImageUpload;