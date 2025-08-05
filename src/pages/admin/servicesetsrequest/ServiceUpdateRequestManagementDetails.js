import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
  approveRejectDatasetUpdateRequestAPI, approveRejectServiceUpdateRequestAPI,
  getDatasetChangeRequestDetailAPI,
  getServiceChangeRequestDetailAPI
} from "../../../services/apiservices";
import Form from "react-bootstrap/Form";
import {useForm} from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import {Spinner} from "react-bootstrap";
import "../../../assets/styles/formcomponent.scss";

const ServiceUpdateRequestManagementDetails = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [loader, setLoader] = useState(false);
  const [dataSetDetail, setDataSetDetail] = useState({});
  const [dataSetRequestDetail, setDataSetRequestDetail] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const approveRejectChangeRequest = async (data, status) => {
    setLoader(true);
    if (dataSetDetail?.entityStatus === "REQUEST_RAISED") {
      const payload = {
        ...dataSetRequestDetail,
        changeRequestRemarks: data.remarks,
        changeRequestId: id,
        changeRequestStatus: status,
      };
      approveRejectServiceUpdateRequestAPI(payload)
        .then((response) => {
          setSuccessMessage(response.message);
          setLoader(false);
          setTimeout(() => navigate('/admin/requestmanagement/serviceupdaterequestmanagement'), 3000);
        })
        .catch((error) => {
          setErrorMessage("An unexpected error occurred. Please try again later.");
          setLoader(false);
        })
    } else {
      setErrorMessage("change request has invalid status");
      setLoader(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      return getServiceChangeRequestDetailAPI(id);
    }

    fetchData()
      .then((response) => {
        setDataSetDetail(response);
        setDataSetRequestDetail(JSON.parse(response?.requestJson));
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  return (
    <>
      <div className="container mb-5">
        <Row className="mb-4">
          <Col md={6}>
            <h2 className="form-title">View Service Update Request Detail</h2>
          </Col>
        </Row>

        <div className="formComponent">
          <Form autoComplete="off">
            <Row>
              <Col md={12} lg={{span: 5}}>
                <FloatingLabel label="Request ID" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Request ID"
                    name="requestId"
                    disabled
                    value={dataSetDetail.sequenceId}
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row>
              <Col md={12} lg={{span: 5}}>
                <FloatingLabel label="Dataset ID" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Dataset ID"
                    name="datasetId"
                    disabled
                    value={dataSetDetail.resourceSequenceId}
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row>
              <Col md={12} lg={{span: 5}}>
                <FloatingLabel label="Dataset Name" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Dataset Name"
                    name="datasetName"
                    disabled
                    value={dataSetRequestDetail.name}
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row>
              <Col md={12} lg={{span: 5}}>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Description"
                  className="mb-3 floating_textarea_label"
                >
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Description"
                    disabled
                    name="description"
                    value={dataSetRequestDetail.description}
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row>
              <Col md={12} lg={{span: 5}}>
                <FloatingLabel
                  controlId="remarks"
                  label="Remarks"
                  className="mb-3 floating_textarea_label"
                >
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Remarks"
                    required={dataSetDetail?.entityStatus === "REQUEST_RAISED"}
                    name="remarks"
                    value={dataSetDetail.remarks}
                    disabled={dataSetDetail?.entityStatus !== "REQUEST_RAISED"}
                    className={errors.remarks ? "is-invalid-border-only" : ""}
                    {...register("remarks", {required: "Remarks is required",})}
                  />
                  {errors.remarks && (
                    <span className="is-invalid-border-only">
                      {errors.remarks.message}
                    </span>
                  )}
                </FloatingLabel>
              </Col>
            </Row>
          </Form>
        </div>

        {dataSetDetail?.entityStatus === "REQUEST_RAISED" && (
          <div className="submit-btn">
            <ButtonComponent
              type="primaryBlue"
              onClick={handleSubmit(data => approveRejectChangeRequest(data, "REQUEST_APPROVED"))}
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
              Approve
            </ButtonComponent>
            <ButtonComponent
              type="primaryWhite"
              onClick={handleSubmit(data => approveRejectChangeRequest(data, "REQUEST_REJECTED"))}
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
              Reject
            </ButtonComponent>
          </div>
        )}
        <p className="is-invalid-border-only mt-2">{errorMessage}</p>
        <p className="success-message mt-2">{successMessage}</p>
      </div>
    </>
  );
};

export default ServiceUpdateRequestManagementDetails;
