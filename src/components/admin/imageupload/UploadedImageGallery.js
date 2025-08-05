import React from 'react';
import './ImageUpload.scss'; // add styles here
import Delete from '../../../assets/images/delete-icon.png';
import { downloadFileAPI } from "../../../services/apiservices";

const handlePreviewImage = async (fileUrl) => {
    try {
      const response = await downloadFileAPI(fileUrl, "admin", false); // must return Blob!
  
      const blob = new Blob([response.data], { type: 'image/png' }); // use correct MIME type
      const blobUrl = URL.createObjectURL(blob);
  
      window.open(blobUrl, "_blank", "noopener,noreferrer");
  
      // Optional: clean up after a short time
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
      console.error("Preview failed:", error);
    }
  };
const UploadedImageGallery = ({ uploadedImages = [], isViewOnly = true, handleDeleteImage }) => (
    <div>
    {uploadedImages.length > 0 && <table className="FilesTable">
        <thead>
            <tr>
                <th>Image Title</th>
                <th>Filename</th>
                {!isViewOnly && <th></th>}
            </tr>
        </thead>
        <tbody>
            {uploadedImages.map((images, index) => (
                <tr key={images.id}>
                    <td>{images.title}</td>
                    <td>{images.url ? (
                        <span className='text-decoration-underline cursor-pointer' onClick={(e) => handlePreviewImage(images.url)}>{images?.fileKey?.split('_').slice(1).join('_')}</span>)
                        : images.fileKey} </td>
                    {!isViewOnly && <td>
                        <button
                            onClick={(e) => handleDeleteImage(e, images.id)}
                            className="fileDeleteButtonDetails"
                        >
                            <img src={Delete} alt="Delete" />
                        </button></td>}
                </tr>
            ))}
        </tbody>
    </table>}
</div >
);

export default UploadedImageGallery;