import { Spinner, Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useMasterData from "../../../hooks/useMasterData";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import { postRequestFormAPI } from "../../../services/apiservices";
import "../../../assets/styles/header.scss";
import "../../../assets/styles/formcomponent.scss";

const DownloadRequestForm = ({ label, id, title, setShowForm, setRefreshDataset, requestData }) => {
  let navigate = useNavigate();
  const { firstName, lastName, mobileNumber, organizationName, id: userId, username } = useSelector((state) => state.auth.user.profile);
  const [apiErrors, setApiErrors] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [loader, setLoader] = useState();
  const [show, setShow] = useState(true);
  const { data: subscriptionTypeMaster } = useMasterData('subscription-type', 'user');
  const { data: typeOfUsageMaster } = useMasterData('type-of-usage', 'user');
  const { pathname } = useLocation();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    setValue("dataSetRequestTitle", title || "");
    const [year, month, day] = new Date()
      .toISOString()
      .split("T")[0]
      .split("-");
    setValue("requestDate", `${day}-${month}-${year}`);
    setValue("email", username);
    setValue("userMobileNo", mobileNumber);
    setValue("organizationName", organizationName);
    setValue("userName", firstName + " " + lastName);
  }, [title])

  const handleRequestSubmit = (data) => {
    if (label === 'Data') {
      data.dataSetId = id;
      data.dataSetRequestTitle = title;
    } else {
      data.serviceSetId = id;
      data.serviceSetRequestTitle = title;
    }
    if((requestData?.chargingModelName === "Free") && (requestData?.dataAccessTypeName === "Subscribe" || requestData?.isApiAvailable === true || label === "Service")) {
      data.subscriptionTypeId = 2;
    }
    data.userId = userId;
    data.userName = firstName + " " + lastName;
    data.organizationName = organizationName;

    setLoader(true);
    setApiErrors('');
    const postRequestForm = async () => {
      return postRequestFormAPI(data, label);
    };

    postRequestForm().then((response) => {
      setLoader(false);
      setApiMessage(response?.message);
      setTimeout(() => {
        setShowForm(false);
        setRefreshDataset(true);
        navigate(pathname)
      }, 3000);

    }).catch((error) => {
      setLoader(false);
      if (error?.response?.data?.message) {
        setApiErrors(error?.response?.data.message)
      } else {
        setApiErrors(error?.message)
      }
    });
  };

  const closeModal = () => {
    setShow(false)
    setShowForm(false);
  }

  return (
    <Modal
      dialogClassName="serviceForm"
      show={show}
      size="xl"
      className="rounded-0"
      style={{ paddingLeft: '0rem' }}
      onHide={() => closeModal()}
      backdrop="static"
    >
      <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>
      <Modal.Header
        style={{ border: "none", display: "flex", justifyContent: "center" }}
      >
        <div>
          <p>Please fill up the below fields to continue</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="formComponent">
            <Form autoComplete="off">
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel
                    label="Name of Organization"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Name of Organization"
                      name="organizationName"
                      disabled
                      maxLength={30}
                      {...register("organizationName")}
                    />

                  </FloatingLabel>
                </Col>
                <Col md={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel
                    label="Name of Authorized Person Requesting Data"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"

                      placeholder="Name of Authorized Person Requesting Data"
                      name="userName"
                      disabled
                      maxLength={30}

                      {...register("userName")}
                    />

                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel label="Phone Number" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Phone Number"
                      name="userMobileNo"
                      disabled
                      maxLength={30}
                      {...register("userMobileNo")}
                    />

                  </FloatingLabel>
                </Col>
                <Col md={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel label="Email" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Email"
                      name="email"
                      disabled
                      maxLength={30}
                      {...register("email")}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel
                    label="Name of nodal person"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Name of nodal person"
                      name="nodalPersonName"
                      // required
                      disabled={loader}
                      maxLength={30}
                      className={
                        errors.nodalPersonName ? "is-invalid-border-only" : ""
                      }
                      title=" The designated point of contact from the Organization for follow-ups regarding the downloaded data."
                      {...register("nodalPersonName", {
                      })}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel label="Phone Number" className="mb-3">
                    <Form.Control
                      type="text"
                      // required
                      placeholder="Phone Number"
                      name="nodalPersonMobileNo"
                      disabled={loader}
                      maxLength={30}
                      className={
                        errors.nodalPersonMobileNo ? "is-invalid-border-only" : ""
                      }
                      {...register("nodalPersonMobileNo", {
                        // required: "Phone Number Nodal is required",
                        pattern: {
                          value: /^[6-9]{1}[0-9]{9}$/,
                          message: "Phone Number Nodal is not valid",
                        },
                      })}
                    />
                    {errors.nodalPersonMobileNo && (
                      <span className="is-invalid-border-only">
                        {errors.nodalPersonMobileNo.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel
                    label={`Date of ${label} Request`}
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder={`Date of ${label} Request`}
                      name="requestDate"
                      disabled
                      maxLength={30}
                      {...register("requestDate")}
                    />

                  </FloatingLabel>
                </Col>
                <Col md={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel label={`${label} Request Title`} className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder={`${label} Request Title`}
                      name="dataSetRequestTitle"
                      disabled
                      maxLength={30}
                      {...register("dataSetRequestTitle",
                      )}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={12}>
                  <FloatingLabel
                    label={`Purpose of ${label} Request`}
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder={`Purpose of ${label} Request`}
                      name="requestPurpose"
                      required
                      disabled={loader}
                      maxLength={30}
                      className={
                        errors.requestPurpose
                          ? "is-invalid-border-only"
                          : ""
                      }
                      {...register("requestPurpose", {
                        required: "Purpose of Data Request is required",
                      })}
                    />
                    {errors.requestPurpose && (
                      <span className="is-invalid-border-only">
                        {errors.requestPurpose.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
              {(requestData?.chargingModelName !== "Free") && (requestData?.dataAccessTypeName === "Subscribe" || requestData?.isApiAvailable === true || label === "Service") ?
                <Row>
                  <Col md={12} lg={{ span: 3 }}>
                    <FloatingLabel
                      controlId="floatingSelect"
                      label="Subscription Type"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Floating label Subscription Type"
                        name="subscriptionTypeId"
                        disabled={loader}
                        className={
                          errors.subscriptionTypeId
                            ? "is-invalid-border-only"
                            : ""
                        }
                        required
                        {...register("subscriptionTypeId", {
                          required: 'Subscription Type is required',
                        })}
                      >
                        <option value=''>Select</option>
                        {subscriptionTypeMaster.length > 0 &&
                          subscriptionTypeMaster.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </Form.Select>
                      {errors.subscriptionTypeId && (
                        <span className="is-invalid-border-only">
                          {errors.subscriptionTypeId.message}
                        </span>
                      )}
                    </FloatingLabel>
                  </Col>
                </Row> :
                null
              }

              <Row>
                <Col md={12} lg={{ span: 3 }}>
                  <FloatingLabel
                    controlId="floatingSelect"
                    label="Type of Use"
                    className="mb-3"
                  >
                    <Form.Select
                      aria-label="Floating label Type of Use"
                      name="typeOfUsageId"
                      disabled={loader}
                      required
                      className={
                        errors.typeOfUsageId
                          ? "is-invalid-border-only"
                          : ""
                      }
                      {...register("typeOfUsageId", {
                        required: "Type of use is required",
                      })}
                    >
                      <option value=''>Select</option>
                      {typeOfUsageMaster.length > 0 &&
                        typeOfUsageMaster.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </Form.Select>
                    {errors.typeOfUsageId && (
                      <span className="is-invalid-border-only">
                        {errors.typeOfUsageId.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel
                    label="Others(please specify)"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Others(please specify)"
                      name="others"
                      disabled={loader}
                      maxLength={30}
                      {...register("others")}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div key="checkbox" className="mb-3">
                    <Controller
                      name="termsCheck"
                      control={control}
                      rules={{ required: 'Please accept Terms and Conditions' }}
                      render={({ field }) => (
                        <Form.Check
                          type="checkbox"
                          name="termsCheck"
                        >
                          <Form.Check.Input
                            type="checkbox"
                            name="termsCheck"
                            id={`check-api-${"checkbox"}`}
                            {...field}
                          />
                          <Form.Check.Label>
                            {
                              <div className="rowspace">
                                <span>I accept all </span>{" "}
                                <NavLink
                                  onClick={() => {
                                    window.open("/termsofuse", "_blank");
                                  }}
                                  className="registerTerms"
                                >
                                  terms of use
                                </NavLink>
                              </div>
                            }
                          </Form.Check.Label>
                        </Form.Check>
                      )}
                    />
                    {errors.termsCheck && (
                      <span className="is-invalid-border-only">
                        {errors.termsCheck.message}
                      </span>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ButtonComponent
                    type="primaryBlue"
                    disabled={apiMessage.length > 0}
                    onClick={handleSubmit(handleRequestSubmit)}
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
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        {apiMessage && <p className="success-message mt-2">{apiMessage}</p>}
        {apiErrors && <p className="is-invalid-border-only mt-2">{apiErrors}</p>}
      </Modal.Body>
    </Modal>
  );
};

DownloadRequestForm.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  setShowForm: PropTypes.func.isRequired,
  setRefreshDataset: PropTypes.func.isRequired,
  requestData: PropTypes.object,
};

export default DownloadRequestForm;
