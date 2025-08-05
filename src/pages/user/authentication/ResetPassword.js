import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../../components/user/Footer";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import { resetPasswordAPI } from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import "../../../assets/styles/forgotPassword.scss";
import transportStackLogo from "../../../assets/images/ts-logo-updated.png";
import eyeIconShow from "../../../assets/images/eye_password_show.png";
import eyeIconHide from "../../../assets/images/eye_password_hide.png";
import NCT_seal from "../../../assets/images/delhi_logo.svg";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [adminUser] = useState(location.pathname.includes("admin"));
  const registerUserData = useSelector((state) => state.verify.userOtpDetails);
  let navigate = useNavigate();
  const [loader, setLoader] = useState();
  const [apiErrors, setApiErrors] = useState("");
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [userDetails] = useState(registerUserData);
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleRegister = (data) => {
    setLoader(true);
    setApiErrors("");
    let params = {
      username: userDetails.email,
      newPassword: data.newPassword,
    };
    const resetPassword = async () => {
      return resetPasswordAPI(params);
    };
    resetPassword()
      .then((response) => {
        setLoader(false);
        if (response?.message === "Password reset successful") {
          setMessage(response.message);
          dispatch({ type: 'setVerifiedScreen', payload: { email: false, mobile: false } })
          dispatch({ type: 'RemoveVerifiedUserOtpDetails', payload: {} })
          setTimeout(() => {
            if (adminUser) navigate("/admin/signin")
            else navigate("/signin")
          }, 3000);
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

  const newPassword = watch("newPassword")
  const confirmPassword = watch("confirmPassword")

  useEffect(() => {
    if (confirmPassword) {
      trigger("confirmPassword")
    }
  }, [newPassword, confirmPassword, trigger])

  return (
    <div className="forgotPassword">
      <div className="content">
        <div className="d-flex mb-4">
          <img src={NCT_seal} className="NCT_seal me-4" alt="NCT seal logo" />
          <img src={transportStackLogo} className="transportStackLogo cursor-pointer" alt="header logo" onClick={handleLogoClick} />
        </div>
        <div>
          <h1>Reset Password</h1>
          <p>Set a new password for your account.</p>
          <div className="formComponent">
            <Form autoComplete="off" id="resetPassword">
              <Row>
                <Col md={6} lg={4}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Enter new password"
                    className="mb-3"
                  >
                    <Form.Control
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      required
                      disabled={loader}
                      {...register("newPassword", {
                        required: "New password is required",
                        validate: (val) => {
                          const message = []
                          if (val.length < 8) {
                            message.push("at least 8 characters")
                          }
                          if (!/[a-z]/.test(val)) {
                            message.push("at least one lowercase letter")
                          }
                          if (!/[A-Z]/.test(val)) {
                            message.push("at least one uppercase letter")
                          }
                          if (!/[0-9]/.test(val)) {
                            message.push("at least one number")
                          }
                          if (!/[!@#$%^&*]/.test(val)) {
                            message.push("at least one special character (!@#$%^&*)")
                          }

                          if (watch("currentpassword") === val) {
                            return "Your password do not same as old password";
                          }

                          return message.length === 0 || `Password must contain:\n${message.join("\n")}`

                        },
                      })}
                    />
                    <div
                      className="eye_icon"
                      onClick={() => {
                        setShowNewPassword(!showNewPassword);
                      }}
                    >
                      {showNewPassword ? (
                        <img
                          className="show_password_icon"
                          src={eyeIconShow}
                          alt="new password icon show"
                        />
                      ) : (
                        <img src={eyeIconHide} alt="new password icon hide" />
                      )}
                    </div>
                    <span className="is-invalid-border-only">
                      {errors.newPassword && (
                        <span className="is-invalid-border-only">
                          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                            {errors.newPassword?.message.split("\n").map((line, i) => (
                              <span key={i}>
                                <li>{line}</li>
                              </span>
                            ))}
                          </ul>
                        </span>
                      )}
                    </span>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={6} lg={4}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Re-enter new password"
                    className="mb-3"
                  >
                    <Form.Control
                      name="confirmPassword"
                      type={showReEnterPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      required
                      disabled={loader}
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (val) => {
                          if (watch("newPassword") !== val) {
                            return "Your passwords do no match";
                          }
                          return true
                        },
                        // pattern: {
                        //   value:
                        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8})/,
                        //   message: "Please enter valid password",
                        // },
                      })}
                    />
                    <div
                      className="eye_icon"
                      onClick={() => {
                        setShowReEnterPassword(!showReEnterPassword);
                      }}
                    >
                      {showReEnterPassword ? (
                        <img
                          className="show_password_icon"
                          src={eyeIconShow}
                          alt="re enter password icon show"
                        />
                      ) : (
                        <img src={eyeIconHide} alt="re enter password icon hide" />
                      )}
                    </div>
                    <span className="is-invalid-border-only">
                      {errors.confirmPassword && (
                        <span className="is-invalid-border-only">
                          {errors.confirmPassword.message}
                        </span>
                      )}
                    </span>
                  </FloatingLabel>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="submit-btn">
          <ButtonComponent
            type="primaryBlue"
            form="resetPassword"
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
            Reset
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
        <p style={{ color: "green" }}> {message}</p>
        <ul id="conditions">
          <div>
            <li>Use at least 8 characters</li>
            <li>
              Use one uppercase, one numeric and one lowecase and one special
              character
            </li>
          </div>
        </ul>
      </div>
      {/* <p className="is-invalid-border-only mt-2">{apiErrors}</p> */}
      {adminUser ? null : <Footer></Footer>}
    </div>
  );
};

export default ResetPassword;
