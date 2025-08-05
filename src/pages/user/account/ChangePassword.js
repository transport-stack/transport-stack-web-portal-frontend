import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Col, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import Footer from "../../../components/user/Footer";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import {
  changePasswordAPI,
  resetPasswordAdminAPI,
} from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import "../../../assets/styles/forgotPassword.scss";
import transportStackLogo from "../../../assets/images/ts-logo-updated.png";
import eyeIconShow from "../../../assets/images/eye_password_show.png";
import eyeIconHide from "../../../assets/images/eye_password_hide.png";
import NCT_seal from "../../../assets/images/delhi_logo.svg";

const ChangePassword = () => {
  const { accessToken } = useSelector((state) => state.auth.user);
  let navigate = useNavigate();
  const [loader, setLoader] = useState();
  const [apierrors, setApierrors] = useState("");
  const url = new URL(window.location.href);
  const urlSearchParams = new URLSearchParams(url.search);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showReEnteredPassword, setShowReEnteredPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleRegister = (data) => {
    setLoader(true);
    setApierrors("");
    if (url.searchParams.has("userId")) passwordWithoutToken(data);
    else passwordWithToken(data);
  };

  const passwordWithToken = (data) => {
    let params = {
      accessToken: accessToken,
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
      userCategory: 'user',
    };

    const changePassword = async () => {
      return changePasswordAPI(params, accessToken);
    };

    changePassword()
      .then((response) => {
        setLoader(false);
        navigate(-1);
      })
      .catch((error) => {
        if (error?.message === "Request failed with status code 500" ||
          error?.message === "Request failed with status code 405"
        )
          setApierrors(
            "Failed to update user password. Passwords do not match"
          );
        setLoader(false);
      });
  };

  const passwordWithoutToken = (data) => {
    const userId = urlSearchParams.get("userId");
    const userCategory = urlSearchParams.get("userCategory");

    let params = {
      userId: userId,
      userCategory: userCategory,
      tempPassword: data.currentPassword,
      password: data.newPassword,
    };

    const changePassword = async () => {
      return resetPasswordAdminAPI(params);
    };

    changePassword()
      .then((response) => {
        setLoader(false);
        if (response?.message === "User password updated successfully") {
          if (userCategory === "admin") {
            navigate("../admin/signin");
          } else {
            navigate("../signin");
          }
        }
        else setApierrors(response?.message);
      })
      .catch((error) => {
        if (error?.message === "Request failed with status code 500" ||
          error?.message === "Request failed with status code 405"
        )
          setApierrors(
            "Failed to update user password. Passwords do not match"
          );
        setLoader(false);
      });
  };

  const handleLogoClick = () => {
    navigate("/", { replace: true });
  }

  const newPassword = watch("newPassword")
  const confirmPassword = watch("confirmPassword")
  const currentPassword = watch("currentPassword")

  useEffect(() => {
    if (confirmPassword) {
      trigger("confirmPassword")
    }
  }, [newPassword, confirmPassword, trigger])
  useEffect(() => {
    if (newPassword) {
      trigger("newPassword")
    }
  }, [newPassword, trigger, currentPassword])

  return (
    <div className="forgotPassword">
      <div className="content">
        <div className="d-flex mb-4">
          <img src={NCT_seal} className="NCT_seal me-4" alt="NCT seal logo" />
          <img src={transportStackLogo} className="transportStackLogo cursor-pointer" alt="header logo" onClick={handleLogoClick} />
        </div>
        <div>
          <h1>Change Password</h1>
          <p>Set a new password for your account.</p>
          <div className="formComponent">
            <Form autoComplete="off" id="changePasswordForm">
              <Row>
                <Col md={6} lg={4}>
                  {url.searchParams.has("userId") ? (
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Enter current password"
                      className="mb-3"
                    >
                      <Form.Control
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        disabled={loader}
                        placeholder="Enter current password"
                        {...register("currentPassword", {
                          required: "Current password is required",
                        })}
                      />
                      <div
                        className="eye_icon"
                        onClick={() => {
                          setShowCurrentPassword(!showCurrentPassword);
                        }}
                      >
                        {showCurrentPassword ? (
                          <img
                            className="show_password_icon"
                            src={eyeIconShow}
                            alt="current password icon show"
                          />
                        ) : (
                          <img src={eyeIconHide} alt="current password icon hide" />
                        )}
                      </div>
                      <span className="is-invalid-border-only">
                        {errors.currentPassword && (
                          <span className="is-invalid-border-only">
                            {errors.currentPassword.message}
                          </span>
                        )}
                      </span>
                    </FloatingLabel>
                  ) : (
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Enter current password"
                      className="mb-3"
                    >
                      <Form.Control
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        disabled={loader}
                        placeholder="Enter current password"
                        {...register("currentPassword", {
                          required: "Current password is required",
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8})/,
                            message: "Please enter valid password",
                          },
                        })}
                      />
                      <div
                        className="eye_icon"
                        onClick={() => {
                          setShowCurrentPassword(!showCurrentPassword);
                        }}
                      >
                        {showCurrentPassword ? (
                          <img
                            className="show_password_icon"
                            src={eyeIconShow}
                            alt="current password icon show"
                          />
                        ) : (
                          <img src={eyeIconHide} alt="current password icon hide" />
                        )}
                      </div>
                      <span className="is-invalid-border-only">
                        {errors.currentPassword && (
                          <span className="is-invalid-border-only">
                            {errors.currentPassword.message}
                          </span>
                        )}
                      </span>
                    </FloatingLabel>
                  )}
                </Col>
              </Row>
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
                          const currentPassword = watch("currentPassword")
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

                          if (currentPassword && val === currentPassword) {
                            return "Your new password cannot be same as current password";
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
                      type={showReEnteredPassword ? "text" : "password"}
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
                        setShowReEnteredPassword(!showReEnteredPassword);
                      }}
                    >
                      {showReEnteredPassword ? (
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
        <div className="submit-btn mt-5">
          <ButtonComponent
            type="primaryBlue"
            form="changePasswordForm"
            onClick={handleSubmit(handleRegister)}
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
            Change
          </ButtonComponent>
          <ButtonComponent type="primaryWhite" onClick={() => navigate(-1)}>
            Back
          </ButtonComponent>
        </div>
        <p className="is-invalid-border-only mt-2">{apierrors}</p>
        <ul id="conditions">
          <div>
            <li>Use at least 8 characters</li>
            <li>Use one uppercase, one numeric and one lowercase and one special character</li>
          </div>
        </ul>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ChangePassword;
