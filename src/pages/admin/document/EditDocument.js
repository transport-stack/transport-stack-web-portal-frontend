import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import useMasterData from "../../../hooks/useMasterData";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import {
  updateDocumentApi,
  downloadDocumentAPI,
  getDocumentDetailsByIdAPI,
  getDropdownAPI,
} from "../../../services/apiservices";
import "../../../components/admin/fileupload/FileUpload.scss";
import "../../../assets/styles/formcomponent.scss";
import Attachment from "../../../assets/images/attachment.png";

const EditDocument = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [documentTitle, setDocumentTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState("");
  const [docError, setDocError] = useState("");
  const fileInputRef = useRef(null);
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { data: categoryMaster } = useMasterData("document-category", "admin");
  const [subCategoryData, setSubCategoryData] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      return getDocumentDetailsByIdAPI(id);
    };
    fetchDocumentDetails()
      .then((res) => {
        callSubCategoryApiFun(res?.category?.id);
        setTimeout(() => {
          setValue("id", res?.id || "");
          setValue("category", res?.category?.name || "");
          setValue("subCategory", res?.subCategory?.name || "");
          setValue("versions", res?.versions || "");
          setDocumentTitle(res?.title);
          const files = { name: res?.fileKey, url: res?.fileKey };
          setUploadedFiles(files);
        }, 100);
      })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
  }, [id]);

  const handleDocumentSubmit = (data) => {
    setApiErrors('')
    setDocError("");
    const formData = new FormData();
    if (uploadedFiles?.type) formData.append("file", uploadedFiles);
    else formData.append("file", null);
    formData.append("title", documentTitle);
    formData.append("category", data.category);
    formData.append("versions", data.versions);
    formData.append("subCategory", data.subCategory);
    const postDocument = async () => {
      return updateDocumentApi(formData);
    };

    postDocument()
      .then((response) => {
        setLoader(false);
        if (response?.message === "Document Updated" || response?.message === "Document updated successfully") {
          setApiMessage(response.message);
          setTimeout(() => navigate("/admin/documentmanagement"), 3000);
        } else {
          setApiErrors(response?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        if (error?.response?.data?.message) {
          setApiErrors(error.response.data.message);
        } else {
          setApiErrors(error?.message);
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
      setDocError("Please enter Document Title");
      return;
    } else if (event.target.files[0].type !== 'application/pdf') {
      setDocError("Please upload a valid PDF file");
      return
    } else setDocError("");
    setUploadedFiles(event.target.files[0]);
  };

  const handleFileDownload = (e, fileKey) => {
    e.preventDefault();
    const downloadFile = async () => {
      return downloadDocumentAPI(fileKey);
    };
    downloadFile()
      .then((response) => {
        setApiErrors("");
        const url = window.URL.createObjectURL(
          new Blob([response], { type: "application/octet-stream" })
        );
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = fileKey;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.parentNode.removeChild(a);
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setApiErrors(error?.response?.data.message);
        } else {
          setApiErrors(error?.message);
        }
      });
  };

  const handleCategoryChange = (event) => {
    if (event.target.value === "") {
      setError("category", {
        type: "manual",
        message: "Document category is required",
      });
    } else clearErrors("category");
    categoryMaster.forEach((element) => {
      if (element.label === event.target.value)
        callSubCategoryApiFun(element.value);
    });
  };

  const callSubCategoryApiFun = (id) => {
    const fetchSubCategoryData = async () => {
      return await getDropdownAPI("document-sub-category/" + id, "admin", true);
    };
    fetchSubCategoryData()
      .then((response) => {
        const options = response?.map((element) => {
          return { label: element.name, value: element.id };
        });
        setSubCategoryData(options);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h2 className="form-title mb-4">Edit Document</h2>
      <div className="formComponent">
        <Form autoComplete="off">
          <Row>
            <Col md={6}>
              <FloatingLabel label="Document ID" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Document ID"
                  name="id"
                  disabled="true"
                  maxLength={100}
                  className={errors.id ? "is-invalid-border-only" : ""}
                  {...register("id", {
                    required: "Document ID is required",
                  })}
                />
                {errors.id && (
                  <span className="is-invalid-border-only">
                    {errors.id.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <div className="FileUpload">
            <div className="FileUploadRow">
              <div className="fileUploadRowInputs">
                <input
                  type="text"
                  value={documentTitle}
                  id={`documentTitle`}
                  onChange={handleTitle}
                  placeholder="Enter Document Title"
                  className="fileUploadTitle"
                />
                <input
                  type="file"
                  onChange={handleAttach}
                  className="fileUploadAttach"
                  id={`fileUploadInput`}
                  ref={fileInputRef}
                // disabled={loader || (!allowMultiple && uploadedFiles.length > 0) || !documentTitle}
                />
                <label htmlFor={`fileUploadInput`} className="fileUploadIcon">
                  <img src={Attachment} alt="Attachment" />
                </label>
              </div>
              <p
                className="my-2"
                style={
                  uploadedFiles.url
                    ? { textDecoration: "underline", cursor: "pointer" }
                    : {}
                }
                onClick={(e) => handleFileDownload(e, uploadedFiles?.name)}
              >
                {uploadedFiles?.name}
              </p>
              {docError.length > 0 ? (
                <p className="is-invalid-border-only">{docError}</p>
              ) : null}
            </div>
          </div>
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="category"
                label="Document Category"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Document Category"
                  name="category"
                  disabled={loader}
                  className={errors.category ? "is-invalid-border-only" : ""}
                  required
                  {...register("category", {
                    required: "Document Category is required",
                  })}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select</option>
                  {categoryMaster.length > 0 &&
                    categoryMaster.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.category && (
                    <span className="is-invalid-border-only">
                      {errors.category.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="subCategory"
                label="Document Sub Category"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Document Sub Category"
                  name="subCategory"
                  disabled={loader}
                  className={errors.subCategory ? "is-invalid-border-only" : ""}
                  {...register("subCategory", {})}
                >
                  <option value="">Select</option>
                  {subCategoryData?.length > 0 &&
                    subCategoryData.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.subCategory && (
                    <span className="is-invalid-border-only">
                      {errors.subCategory.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel label="Version" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Version"
                  name="versions"
                  required
                  disabled={loader}
                  maxLength={5}
                  className={errors.versions ? "is-invalid-border-only" : ""}
                  {...register("versions", {
                    required: "Version is required",
                  })}
                />
                {errors.versions && (
                  <span className="is-invalid-border-only">
                    {errors.versions.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="submit-btn">
        <ButtonComponent
          type="primaryBlue"
          onClick={handleSubmit(handleDocumentSubmit)}
        >
          {loader && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="output"
              aria-hidden="true"
            />
          )}
          Submit
        </ButtonComponent>
        <ButtonComponent type="primaryWhite" onClick={() => navigate(-1)}>
          Cancel
        </ButtonComponent>
      </div>
      <p className="is-invalid-border-only mt-2 mb-3">{apiErrors}</p>
      <p className="success-message mt-2">{apiMessage}</p>
    </div>
  );
};

export default EditDocument;
