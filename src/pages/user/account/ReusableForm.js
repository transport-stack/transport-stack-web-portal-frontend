import {  Spinner,Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";

const ReusableForm = ({ label }) => {
  let navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleRegister = (data) => {
    setLoader(true);
    setApiErrors("");
  };
  
  return (
    <div
      className="formComponent"
      style={{
        border: "1px solid #B4B4B4",
        marginTop: "1.5rem",
        paddingTop: "4rem",
        paddingBottom: "4rem",
        padding: "3rem",
      }}
    >
      <Form autoComplete="off">
        {label && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>Please fill up the below fields to continue</p>
          </div>
        )}
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel label="Name of Organization" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name of Organization"
                name="orgName"
                required
                disabled={loader}
                maxLength={30}
                className={errors.firstName ? "is-invalid-border-only" : ""}
                {...register("orgName", {
                  required: "Name of Organization is required",
                })}
              />
              {errors.orgName && (
                <span className="is-invalid-border-only">
                  {errors.orgName.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
          <Col md={12} lg={{ span: 5, offset: 2 }}>
            <FloatingLabel
              label="Name of Authorized Person Requesting Data"
              className="mb-3"
            >
              <Form.Control
                type="text"
                required
                placeholder="Name of Authorized Person Requesting Data"
                name="authorizedPerson"
                disabled={loader}
                maxLength={30}
                className={errors.firstName ? "is-invalid-border-only" : ""}
                {...register("authorizedPerson", {
                  required:
                    "Name of Authorized Person Requesting Data is required",
                })}
              />
              {errors.authorizedPerson && (
                <span className="is-invalid-border-only">
                  {errors.authorizedPerson.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel label="Phone Number" className="mb-3">
              <Form.Control
                type="text"
                required
                placeholder="Phone Number"
                name="phnNumber"
                disabled={loader}
                maxLength={30}
                className={errors.phnNumber ? "is-invalid-border-only" : ""}
                {...register("phnNumber", {
                  required: "Phone Number is required",
                  pattern: {
                    value: /^[6-9]{1}[0-9]{9}$/,
                    message: "Phone Number is not valid",
                  },
                })}
              />
              {errors.phnNumber && (
                <span className="is-invalid-border-only">
                  {errors.phnNumber.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
          <Col md={12} lg={{ span: 5, offset: 2 }}>
            <FloatingLabel label="Email" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Email"
                name="email"
                required
                disabled={loader}
                maxLength={30}
                className={errors.email ? "is-invalid-border-only" : ""}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email ID is not valid",
                  },
                })}
              />
              {errors.email && (
                <span className="is-invalid-border-only">
                  {errors.email.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel label="Name of nodal person" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name of nodal person"
                name="nodalPerson"
                required
                disabled={loader}
                maxLength={30}
                className={errors.nodalPerson ? "is-invalid-border-only" : ""}
                {...register("nodalPerson", {
                  required: "Email is required",
                })}
              />
              {errors.nodalPerson && (
                <span className="is-invalid-border-only">
                  {errors.nodalPerson.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
          <Col md={12} lg={{ span: 5, offset: 2 }}>
            <FloatingLabel label="Phone Number" className="mb-3">
              <Form.Control
                type="text"
                required
                placeholder="Phone Number"
                name="phnNumberNodal"
                disabled={loader}
                maxLength={30}
                className={
                  errors.phnNumberNodal ? "is-invalid-border-only" : ""
                }
                {...register("phnNumberNodal", {
                  required: "Phone Number Nodal is required",
                  pattern: {
                    value: /^[6-9]{1}[0-9]{9}$/,
                    message: "Phone Number Nodal is not valid",
                  },
                })}
              />
              {errors.phnNumberNodal && (
                <span className="is-invalid-border-only">
                  {errors.phnNumberNodal.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel label="Date of Data Request" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Date of Data Request"
                name="dateOfDataRequest"
                required
                disabled={loader}
                maxLength={30}
                className={
                  errors.dateOfDataRequest ? "is-invalid-border-only" : ""
                }
                {...register("dateOfDataRequest", {
                  required: "Date of Data Request  is required",
                })}
              />
              {errors.dateOfDataRequest && (
                <span className="is-invalid-border-only">
                  {errors.dateOfDataRequest.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
          <Col md={12} lg={{ span: 5, offset: 2 }}>
            <FloatingLabel label="Data Request Title" className="mb-3">
              <Form.Control
                type="text"
                required
                placeholder="Data Request Title"
                name="dataRequestTitle"
                disabled={loader}
                maxLength={30}
                className={
                  errors.dataRequestTitle ? "is-invalid-border-only" : ""
                }
                {...register("dataRequestTitle", {
                  required: "Data Request Title is required",
                })}
              />
              {errors.dataRequestTitle && (
                <span className="is-invalid-border-only">
                  {errors.dataRequestTitle.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12}>
            <FloatingLabel label="Purpose of Data Request" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Purpose of Data Request"
                name="purposeOfDataRequest"
                required
                disabled={loader}
                maxLength={30}
                className={
                  errors.purposeOfDataRequest ? "is-invalid-border-only" : ""
                }
                {...register("purposeOfDataRequest", {
                  required: "Purpose of Data Request is required",
                })}
              />
              {errors.purposeOfDataRequest && (
                <span className="is-invalid-border-only">
                  {errors.purposeOfDataRequest.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 3 }}>
            <FloatingLabel
              controlId="floatingSelect"
              label="Subscription Type"
              className="mb-3"
            >
              <Form.Select
                aria-label="Floating label Subscription Type"
                name="subscriptionType"
                disabled={loader}

                className={
                  errors.subscriptionType
                    ? "is-invalid-border-only"
                    : ""
                }
                required
                {...register("subscriptionType", {
                  required: 'Subscription Type is required',
                })}
              >
                <option value=''>Select</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </Form.Select>
              {errors.subscriptionType && (
                <span className="is-invalid-border-only">
                  {errors.subscriptionType.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 3 }}>
            <FloatingLabel
              controlId="floatingSelect"
              label="Type of Use"
              className="mb-3"
            >
              <Form.Select
                aria-label="Floating label Type of Use"
                name="typeOfUse"
                disabled={loader}
                required
                className={
                  errors.typeOfUse
                    ? "is-invalid-border-only"
                    : ""
                }
                {...register("typeOfUse", {
                  required: "Type of use is required",
                })}
              >
                <option value=''>Select</option>
                <option value="Commercial Use">Commercial Use</option>
                <option value="Non Commercial Use">Non Commercial Use</option>
                <option value="Research">Research</option>
                <option value="Others">Others</option>
              </Form.Select>
              {errors.typeOfUse && (
                <span className="is-invalid-border-only">
                  {errors.typeOfUse.message}
                </span>
              )}
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel label="Others(please specify)" className="mb-3">
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
          <Col
            style={{
              marginLeft: "1.4rem",
              marginBottom: "2rem",
              margonTop: "2rem",
            }}
          >
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
                                navigate("/termsofuse");
                              }}
                              className="registerTerms"
                            >
                              terms of Use
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
              onClick={handleSubmit(handleRegister)}
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
              Submit
            </ButtonComponent>
          </Col>
        </Row>
      </Form>
      <p className="is-invalid-border-only mt-2">{apiErrors}</p>
    </div>
  );
};
ReusableForm.propTypes = {
  label: PropTypes.string,
};
export default ReusableForm;
