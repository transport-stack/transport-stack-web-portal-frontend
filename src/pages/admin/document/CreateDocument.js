import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import useMasterData from "../../../hooks/useMasterData";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import {
  createDocumentApi,
  getDropdownAPI,
} from "../../../services/apiservices";
import "../../../components/admin/fileupload/FileUpload.scss";
import "../../../assets/styles/formcomponent.scss";
import Attachment from "../../../assets/images/attachment.png";

const CreateDocument = () => {
  let navigate = useNavigate();
  const [documentTitle, setDocumentTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState("");
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [docError, setDocError] = useState("");
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { data: categoryMaster } = useMasterData("document-category", "admin");
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleDocumentSubmit = (data) => {
    if (uploadedFiles?.name) {
      setDocError("");
      setApiErrors("");
      const formData = new FormData();
      formData.append("file", uploadedFiles);
      formData.append("title", documentTitle);
      formData.append("category", data.category);
      formData.append("versions", data.versions);
      formData.append("subCategory", data.subCategory);

      const postDocument = async () => {
        return createDocumentApi(formData);
      };
      postDocument()
        .then((response) => {
          setLoader(false);
          if (response?.message.includes("Document Created Successfully")) {
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
    } else setDocError("Upload document is required");
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

  const handleCategoryChange = (event) => {
    if (event.target.value === "") {
      setError("category", {
        type: "manual",
        message: "Document category is required",
      });
    } else clearErrors("category");
    categoryMaster.forEach((element) => {
      if (element.label === event.target.value) {
        const fetchSubCategoryData = async () => {
          return await getDropdownAPI(
            "document-sub-category/" + element.value,
            "admin", true
          );
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
      }
    });
  };

  return (
    <div>
      <h2 className="form-title mb-4">Add New Document</h2>
      <div className="formComponent">
        <Form autoComplete="off">
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
                // disabled={loader || (!allowMultiple && uploadedFiles.length > 0) || !documentTitle}
                />
                <label htmlFor={`fileUploadInput`} className="fileUploadIcon">
                  <img src={Attachment} alt="Attachment" />
                </label>
              </div>
              <p className="my-2">{uploadedFiles?.name}</p>
              {docError.length > 0 && !uploadedFiles?.name ? (
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
                    required: "Document category is required",
                  })}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select</option>
                  {categoryMaster?.length > 0 &&
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
                  {...register("subCategory", {})}
                  className={errors.subCategory ? "is-invalid-border-only" : ""}
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
          disabled={apiMessage?.length > 0}
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
        <ButtonComponent
          type="primaryWhite"
          onClick={() => navigate(-1)}
          disabled={apiMessage?.length > 0}
        >
          Cancel
        </ButtonComponent>
      </div>
      <p className="is-invalid-border-only mt-2 mb-3">{apiErrors}</p>
      <p className="success-message mt-2">{apiMessage}</p>
    </div>
  );
};

export default CreateDocument;
