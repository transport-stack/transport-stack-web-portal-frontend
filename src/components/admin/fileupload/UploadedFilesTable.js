import React, { useState } from 'react'
import "./FileUpload.scss";
import Delete from '../../../assets/images/delete-icon.png';
import { downloadFileAPI } from "../../../services/apiservices";

const UploadedFilesTable = ({ uploadedFiles = [], isViewOnly = true, handleDeleteFile }) => {
    const [apiErrors, setApiErrors] = useState("");
    const handleFileDownload = (e, fileKey,fileurl) => {
        e.preventDefault();
        const downloadFile = async () => {
            return downloadFileAPI(fileurl, "admin",false);
        };
        downloadFile()
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                // the filename you want
                a.download = fileKey;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.parentNode.removeChild(a);
            }).catch((error) => {
                if (error?.response?.data?.message) {
                    setApiErrors(error?.response?.data.message)
                } else {
                    setApiErrors(error?.message)
                }
            });
    }
    return (
        <div>
            {uploadedFiles.length > 0 && <table className="FilesTable">
                <thead>
                    <tr>
                        <th>Document Title</th>
                        <th>Filename</th>
                        {!isViewOnly && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {uploadedFiles.map((files, index) => (
                        <tr key={files.fileID}>
                            <td>{files.documentTitle}</td>
                            <td>{files.url ? (
                                <span className='text-decoration-underline cursor-pointer' onClick={(e) => handleFileDownload(e, files.name,files.url)}>{files?.name?.split('_').slice(1).join('_')}</span>)
                                : files.name} </td>
                            {!isViewOnly && <td>
                                <button
                                    onClick={(e) => handleDeleteFile(e, files.fileID)}
                                    className="fileDeleteButtonDetails"
                                >
                                    <img src={Delete} alt="Delete" />
                                </button></td>}
                        </tr>
                    ))}
                </tbody>
            </table>}
        </div >
    )
}

export default UploadedFilesTable
