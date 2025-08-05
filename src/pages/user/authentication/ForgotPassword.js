import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import AddSeo from "../../../utils/AddSeo";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Footer from "../../../components/user/Footer";
import { forgotPasswordAPI } from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import "../../../assets/styles/forgotPassword.scss";
import transportStackLogo from "../../../assets/images/ts-logo-updated.png";
import NCT_seal from "../../../assets/images/delhi_logo.svg";
// import logo from "../../../assets/images/logo.png";

const ForgotPassword = () => {
  const dispatch = useDispatch();   
  const location = useLocation();
  const [adminUser] = useState(location.pathname.includes("admin"));
  let navigate = useNavigate();
  const [loader, setLoader] = useState();
  const [apiErrors, setApiErrors] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      otpName: "email",
    },
  });
  
  const handlePassword = (data) => {
    setLoader(true);
    setApiErrors("");
    let checkOtpName = data.otpName !== "email";
    let params = {
      username: data.email,
      toMobile: checkOtpName,
    }
    const forgotPassword = async () => {
      return forgotPasswordAPI(params);
    };
    forgotPassword()
      .then((response) => {
        setLoader(false);
        if (response?.message === "OTP sent successfully.") {
          data.otpName === "email"
            ? navigate("../forgot-password-email-verification")
            : navigate("../forgot-password-mobile-verification");
          let obj = {
            mobileNo: response?.mobile ? response.mobile : null,
            email: data?.email,
            userId: response?.userId,
            register:false
          };
          dispatch({ type: 'verifyUserOtpDetails', payload: obj })
        } else setApiErrors(response?.message);
      })
      .catch((error) => {
        setLoader(false);
        setApiErrors(error?.message);
      });
  };
  
  const handleLogoClick = () => {
    navigate("/", { replace: true });
  }

  return (
    <div className="forgotPassword">
      <AddSeo title="Delhi Transport Stack" description="Recover your account password."/>
      <div className="content">
        <div className="d-flex mb-4">
          <img src={NCT_seal} className="NCT_seal me-4" alt="NCT seal logo" />
          <img src={transportStackLogo} className="transportStackLogo cursor-pointer" alt="header logo" onClick={handleLogoClick} />
        </div>
        <div>
          <h1>Forgot Password</h1>
          <p className="mt-2">Please enter the email address associated with your account</p>
          <div className="formComponent">
            <Form>
              <Row>
                <Col md={6} lg={4}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Enter your registered Email ID"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Enter your registered Email ID"
                      name="email"
                      required
                      disabled={loader}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email ID is not valid",
                        },
                      })}
                    />
                    <span className="is-invalid-border-only">
                      {errors.email && (
                        <span className="is-invalid-border-only">
                          {errors.email.message}
                        </span>
                      )}
                    </span>
                  </FloatingLabel>
                </Col>
              </Row>
              <div className="mt-4">
                <p className="mb-2">
                  Please select from below options (Email /Mobile) to receive
                  the OTP for validation
                </p>
                <div key={`inline-radio`} className="mb-3 mt-2">
                  <Controller
                    name="otpName"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Form.Check
                          inline
                          label="Email"
                          name="otpName"
                          type="radio"
                          value="email"
                          {...field}
                          checked={field.value === "email"}
                          id={`inline-radio-email`}
                          onChange={() => field.onChange("email")}
                        />
                        <Form.Check
                          inline
                          label="Mobile"
                          name="otpName"
                          type="radio"
                          value="Mobile"
                          {...field}
                          checked={field.value === "mobile"}
                          id={`inline-radio-mobile`}
                          onChange={() => field.onChange("mobile")}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
        <div className="submit-btn">
          <ButtonComponent
            type="primaryBlue"
            onClick={handleSubmit(handlePassword)}
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
            Continue
          </ButtonComponent>
          <ButtonComponent
            type="primaryWhite"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </ButtonComponent>
        </div>
        <p className="is-invalid-border-only mt-2">{apiErrors}</p>
      </div>
      {adminUser ? null : <Footer></Footer>}
    </div>
  );
};

export default ForgotPassword;
