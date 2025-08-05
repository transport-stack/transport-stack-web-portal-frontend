import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import { downloadDocumentAPI, getDocumentDetailsByIdAPI } from "../../../services/apiservices";
import "../../../assets/styles/viewdataset.scss";

const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState([]);
  const [dateModification, setDateModification] = useState([]);
  const [apiErrors, setApiErrors] = useState("");
  
  useEffect(() => {
    const fetchDataCardDetails = async () => {
      return getDocumentDetailsByIdAPI(id);
    };
    fetchDataCardDetails()
      .then((res) => {
        setDocumentData(res);
        setDateModification(res?.dateModified)
      })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
  }, [id]);

  const handleFileDownload = (e, fileKey) => {
    e.preventDefault();
    const downloadFile = async () => {
      return downloadDocumentAPI(fileKey);
    };
    downloadFile()
      .then(response => {
        setApiErrors('');
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/octet-stream' }));
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
    <div className="document mb-5">
      <h3 className="document_title">View Document</h3>
      <div className="formComponent w-50">
        <Form>
          <Form.Label>Document ID</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={documentData.sequenceId}
          />
          <Form.Label>Document Title</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={documentData.title}
          />
          <Form.Label>Document Category</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={documentData?.category?.name}
          />
          <Form.Label>Document Sub Category</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={documentData?.subCategory?.name}
          />
          <Form.Label>Date Modified</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={dateModification}
          />
          <Form.Label>Version</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={documentData.versions}
          />
          <Form.Label>Attachments</Form.Label>
          <p className="mb-4 mt-1 text-decoration-underline cursor-pointer"
            onClick={(e) => handleFileDownload(e, documentData.fileKey)}>{documentData.fileKey}</p>
          <p className="is-invalid-border-only mt-2 mb-3">{apiErrors}</p>
        </Form>
        <ButtonComponent
          type="primaryWhite"
          onClick={() => {
            navigate("../../documentmanagement");
          }}
        >
          Back
        </ButtonComponent>
      </div>
    </div>
  );
};

export default ViewDocument;
