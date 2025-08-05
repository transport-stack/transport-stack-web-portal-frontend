import React, { useEffect, useState } from "react";
import {  useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {  Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import {
  viewDatasetAPI,
  viewServicesetAPI,
} from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import {useSelector} from "react-redux";

const DataSetsOrServiceForm = ({
  label,
  formField,
  showActions,
  handleDataSetSubmit,
  handleServiceSubmit,
  paymentAction,
  disableReject,
  handleRejectModal,
  showButtons,
  isRejected,
  successMessage,
  errorMessage
}) => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [generateLink, setGenerateLink] = useState(false);
  const [disableAcceptButton, setDisableAcceptButton] = useState(false);
  const inputRef = React.useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { profile, role } = useSelector((state) => state.auth.admin)

  useEffect(() => {
    const isDataProvider = role.includes("ROLE_DATA_PROVIDER");
    const isDesignatedApprover = data?.designatedApprovers?.some(
      approver => approver.email === profile?.username
    );

    // Check all conditions and set the button state
    setDisableAcceptButton(profile && role.length && data && !(!isDataProvider || isDesignatedApprover));
  }, [profile, role, data]);
  
  useEffect(() => {
    if (isRejected) {
      inputRef.current.click();
    }
  }, [isRejected]);

  useEffect(() => {
    let data = {
      id: id,
    };
    if (formField === "Data") {
      const viewDataset = async () => {
        return viewDatasetAPI(data);
      };
      viewDataset()
        .then((response) => {
          setLoader(false);
          if (response) {
            setData(response);
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
    }
    if (formField === "Service") {
      const viewServiceset = async () => {
        return viewServicesetAPI(data);
      };
      viewServiceset()
        .then((response) => {
          setLoader(false);
          if (response) {
            setData(response);
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
    }
    window.scrollTo(0, 0);
  }, [id, formField]);


  const handleDatasetRequest = (formData) => {
    setApiErrors("");
    if (formField === "Data") {
      handleDataSetSubmit(formData, data);
    }
    if (formField === "Service") {
      handleServiceSubmit(formData, data);
    }
  };

  const handleModify = () => {
    setGenerateLink(true);
  };

  return (
    <div className="container mb-5">
      <Row className="mb-4">
        <Col md={6}>
          {" "}
          <h2 className="form-title">{label} Request</h2>
        </Col>
      </Row>
      <div className="formComponent">
        <Form>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="Request no." className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Request no."
                  name="id"
                  disabled
                  value={data.sequenceId}
                  maxLength={10}
                  {...register("id")}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="User name" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="User name"
                  name="userName"
                  disabled
                  value={data.userName}
                  maxLength={30}
                  {...register("userName")}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel
                label={formField === "Data" ? "Dataset ID" : "Service ID"}
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder={
                    formField === "Data" ? "Dataset ID" : "Service ID"
                  }
                  maxLength={10}
                  name={formField === "Data" ? "dataSetId" : "serviceSetId"}
                  value={
                    formField === "Data" ? data.dataSetId : data.serviceSetId
                  }
                  {...register(
                    formField === "Data" ? "dataSetId" : "serviceSetId"
                  )}
                  disabled
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel
                label={
                  formField === "Data" ? "Dataset title" : "Serviceset title"
                }
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder={
                    formField === "Data" ? "Dataset title" : "Serviceset title"
                  }
                  disabled
                  maxLength={60}
                  name={formField === "Data" ? "dataSetName" : "serviceSetName"}
                  value={
                    formField === "Data"
                      ? data.dataSetName
                      : data.serviceSetName
                  }
                  {...register(
                    formField === "Data" ? "dataSetName" : "serviceSetName"
                  )}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="Fee Type" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Fee Type"
                  name="feeType"
                  disabled
                  value={data.feeType}
                  {...register("feeType")}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="Fee Amount" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Fee Amount"
                  name="feeAmount"
                  disabled
                  value={data.feeAmount}
                  {...register("feeAmount")}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="Request Date" className="mb-3">
                <Form.Control
                  type="text"
                  maxLength={6}
                  placeholder="Request Date"
                  name="requestDate"
                  disabled
                  value={data.requestDate}
                  {...register("requestDate")}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel
                label={`Purpose of the ${formField} request`}
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder={`Purpose of the ${formField} request`}
                  name="requestPurpose"
                  maxLength={320}
                  disabled
                  value={data.requestPurpose}
                  {...register("requestPurpose")}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="Nodal Person" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Nodal Person"
                  name="nodalPersonName"
                  maxLength={320}
                  disabled
                  value={data.nodalPersonName}
                  {...register("nodalPersonName")}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="Nodal Person Contract No." className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Nodal Person Contract No."
                  name="nodalPersonMobileNo"
                  maxLength={320}
                  disabled
                  value={data.nodalPersonMobileNo}
                  {...register("nodalPersonMobileNo")}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Remarks"
                className="mb-3 floating_textarea_label"
              >
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Remarks"
                  maxLength={200}
                  name="adminRemarks"
                  value={data.adminRemarks}
                  {...register("adminRemarks")}
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Form>
      </div>

      {!paymentAction && (
        <div className="submit-btn" style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
          {data.status === "REQUEST_PENDING" && (
            <>
              {(data.feeType === "UNPAID" || data.feeType === "FREE") ? (
                <ButtonComponent type="primaryBlue" disabled={disableAcceptButton} onClick={handleSubmit(handleDatasetRequest)}>
                  Accept
                </ButtonComponent>
              ) : (
                <ButtonComponent type="primaryBlue" disabled={disableAcceptButton} onClick={() => showButtons()}>
                  Accept
                </ButtonComponent>
              )}
              <ButtonComponent
                type="primaryBlue"
                onClick={() => handleRejectModal()}
                disabled={showActions || generateLink || disableReject}
              >
                Reject
              </ButtonComponent>
            </>
          )}
          <ButtonComponent type="primaryWhite" onClick={() => navigate(-1)}>
            Back
          </ButtonComponent>
        </div>
      )}

      {(successMessage.length > 0 || errorMessage.length > 0)
        ? null
        : <p className="is-invalid-border-only mt-2"> {apiErrors} </p>
      }

      {showActions && (
        <>
          <div>
            <h5>Do you want to modify the fee?</h5>
          </div>
          <div className="submit-btn mt-3">
            <ButtonComponent type="primaryBlue" onClick={() => handleModify()}>
              Yes
            </ButtonComponent>
            <ButtonComponent type="primaryBlue" onClick={handleSubmit(handleDatasetRequest)}>
              No
            </ButtonComponent>
          </div>
        </>
      )}

      {generateLink && (
        <>
          <div className="formComponent">
            <Form autoComplete="off">
              <Row>
                <Col md={12} lg={{ span: 4 }}>
                  <FloatingLabel
                    label="Modify Fee Amount (INR)"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Modify Fee Amount (INR)"
                      name="modifiedFeeAmount"
                      // maxLength={10}
                      required
                      value={data.modifiedFeeAmount}
                      className={
                        errors.modifiedFeeAmount ? "is-invalid-border-only" : ""
                      }
                      {...register("modifiedFeeAmount", {
                        // required: "Modified Amount is required",
                        pattern: {
                          value: /^\d+$/,

                          message: "Please enter only numerics",
                        },
                      })}
                    />
                    {errors.modifiedFeeAmount && (
                      <span className="is-invalid-border-only">
                        {errors.modifiedFeeAmount.message}999
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 4 }}>
                  <FloatingLabel
                    controlId="floatingTextarea"
                    label="Reason for Fee Change"
                    className="mb-3 floating_textarea_label"
                  >
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={data.reasonForFeeChange}
                      placeholder="Reason for Fee Change"
                      name="reasonForFeeChange"
                      maxLength={200}
                      required
                      className={
                        errors.reasonForFeeChange
                          ? "is-invalid-border-only"
                          : ""
                      }
                      {...register("reasonForFeeChange", {
                        required: "Reason for Fee Change is required",
                      })}
                    />
                    {errors.reasonForFeeChange && (
                      <span className="is-invalid-border-only">
                        {errors.reasonForFeeChange.message}
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
              onClick={handleSubmit(handleDatasetRequest)}
            >
              {loader && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              Generate Payment Link
            </ButtonComponent>
          </div>
        </>
      )}
      {paymentAction && (
        <div className="submit-btn">
          <ButtonComponent
            type="primaryBlue"
            onClick={handleSubmit(handleDatasetRequest)}
          >
            {loader && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            Generate Payment Link
          </ButtonComponent>
        </div>
      )}
      <button
        ref={inputRef}
        className="d-none" // Hide the button
        onClick={handleSubmit(handleDatasetRequest)}
      >
        Reject
      </button>
      <p className="success-message mt-2">{successMessage}</p>
      <p className="is-invalid-border-only mt-2">{errorMessage}</p>
    </div>
  );
};

// PropTypes validation
DataSetsOrServiceForm.propTypes = {
  label: PropTypes.string.isRequired,
  formField: PropTypes.string.isRequired,
  showActions: PropTypes.bool.isRequired,
  handleDataSetSubmit: PropTypes.func.isRequired,
  handleServiceSubmit: PropTypes.func.isRequired,
  paymentAction: PropTypes.bool.isRequired,
  disableReject: PropTypes.bool.isRequired,
  handleRejectModal: PropTypes.func.isRequired,
  showButtons: PropTypes.func.isRequired,
  isRejected: PropTypes.bool.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
};

// Default Prop Values (Optional)
DataSetsOrServiceForm.defaultProps = {
  successMessage: "",
  errorMessage: "",
};

export default DataSetsOrServiceForm;
