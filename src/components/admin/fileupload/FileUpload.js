import React, { useEffect, useRef, useState } from "react";
import "./FileUpload.scss";
import Attachment from '../../../assets/images/attachment.png'

import { deleteFileAPI, uploadFileAPI } from "../../../services/apiservices";
import SpinnerComponent from "../../common/ui/spinner/SpinnerComponent";
import UploadedFilesTable from "./UploadedFilesTable";

const FileUpload = React.memo(({ id, onUploadSuccess, onDeleteSuccess, category, allowMultiple = 'true', defaultFiles = [] }) => {
  const [documentTitle, setDocumentTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState(defaultFiles);
  const [loader, setLoader] = useState(false);
  const [apiErrors, setApiErrors] = useState(false);
  const [apiSuccess, setApiSuccess] = useState('');
  const fileInputRef = useRef(null);
  const handleDeleteFile = (e, fileID) => {
    e.preventDefault();
    const deletedFileID = {
      'id': fileID,
    };
    const deleteFile = async () => {
      return deleteFileAPI(deletedFileID, category);
    };
    deleteFile().then((response) => {
      setLoader(false);
      if (response) {
        const updatedFiles = uploadedFiles.filter((item) => item.fileID !== fileID)
        setUploadedFiles(updatedFiles);
        setApiSuccess(response);
        setTimeout(() => setApiSuccess(''), 5000);
        onDeleteSuccess(fileID, id);
        resetFileInput();
      } else {
        setApiErrors(response?.message)
      }
    }).catch((error) => {
      setLoader(false);
      if (error?.response?.data?.message) {
        setApiErrors(error?.response?.data.message)
      } else {
        setApiErrors(error?.message)
      }
    });
  };

  const handleTitle = (e) => {
    const newTitle = e.target.value;
    setDocumentTitle(newTitle);
    if (newTitle) {
      setApiErrors("");
    }
  };


  const handleAttach = (event) => {
    if (!documentTitle) {
      setApiErrors("Please enter Document Title");
      return
    }
    // get the selected file from the input
    const file = event.target.files[0];
    if (!file) {
      setApiErrors("Please Select a file")
      return;
    }
    if (!allowMultiple && uploadedFiles.length > 0) {
      return
    }

    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("title", documentTitle);
    formData.append("fileUploadType", id);

    const uploadFile = async () => {
      return uploadFileAPI(formData, category);
    };
    uploadFile().then((response) => {
      setLoader(false);
      if (response) {
        setApiSuccess('Document uploaded successfully');
        const filedetails = { name: file.name, documentTitle: documentTitle, fileID: response };
        setUploadedFiles((prevfiles) => [...prevfiles, filedetails]);
        onUploadSuccess(filedetails, id);
        setDocumentTitle('');
        setTimeout(() => setApiSuccess(''), 5000);
      } else {
        setApiErrors(response?.message);
        resetFileInput();
      }
    }).catch((error) => {
      setLoader(false);
      resetFileInput();
      if (error?.response?.data?.message) {
        setApiErrors(error?.response?.data.message)
      } else {
        setApiErrors(error?.message)
      }
    });
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  useEffect(() => {
    if (defaultFiles.length > 0) {
      setUploadedFiles(defaultFiles);
    }
  }, [defaultFiles])
  return (
    <div className="FileUpload">
      <div className="FileUploadRow">
        <div className="fileUploadRowInputs">
          <input
            type="text"
            value={documentTitle}
            id={`documentTitle${id}`}
            onChange={handleTitle}
            placeholder="Enter title"
            className="fileUploadTitle"
            disabled={loader}
          />
          <input
            type="file"
            onChange={handleAttach}
            className="fileUploadAttach"
            id={`fileUploadInput${id}`}
            ref={fileInputRef}
            disabled={loader || (!allowMultiple && uploadedFiles.length > 0) || !documentTitle}
          />
          <label htmlFor={`fileUploadInput${id}`} className="fileUploadIcon">
            <img src={Attachment} alt="Attachment" title={(!allowMultiple && uploadedFiles.length > 0) ? 'Multiple document upload is not enabled for this section' : !documentTitle ? 'Please enter Document title' : ''} />
          </label>
        </div>
        {apiSuccess && <p className="mt-2">{apiSuccess}</p>}
        {apiErrors && <p className="is-invalid-border-only mt-2">{apiErrors}</p>}
        {loader && <div className="d-flex align-items-center mt-2"><SpinnerComponent /> <p>Uploading...</p></div>}
        <UploadedFilesTable isViewOnly={false} uploadedFiles={uploadedFiles} handleDeleteFile={handleDeleteFile} />
      </div>
    </div >
  );
});

export default FileUpload;
