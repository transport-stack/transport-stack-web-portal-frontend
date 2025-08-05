import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Footer from "../../../components/user/Footer";
import {
  getMobileOtpAPI,
  forgotPasswordAPI,
  sendMobileOtpAPI,
  getAdminApprovalModeAPI,
  getAdminApprovalEmailTriggerAPI
} from "../../../services/apiservices";
import "../../../assets/styles/forgotPassword.scss";
import "../../../assets/styles/style.scss";
import "../../../assets/styles/formcomponent.scss";
import success from "../../../assets/images/check_circle_fill.png";
import transportStackLogo from "../../../assets/images/ts-logo-updated.png";
import NCT_seal from "../../../assets/images/delhi_logo.svg";

const MobileVerification = ({ onClose }) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.verify);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mobileVerified] = useState(userData.verifiedScreen.mobile);
  const [timer, setTimer] = useState(120); // 120 seconds for the timer
  const [message, setMessage] = useState("");
  const [apiErrors, setApiErrors] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [changedMobileNumberDetails] = useState(userData.userMobileNumberDetails)
  const [resetOtpClicks, setResetOtpClicks] = useState(
    userData.resendOtpClicks.mobile
  );
  const [userDetails] = useState(userData.userOtpDetails);
  const [forgotPasswordVerification] = useState(
    location.pathname.includes("forgot-password-mobile-verification") // checking whether forgot password
  );
  const [validateMobileNumber] = useState(
    location.pathname.includes("account/myprofile") // checking whether forgot password
  );
  const [adminUser] = useState(location.pathname.includes("admin")); //checking is it from admin side

  // Initially setting the mobile number
  useEffect(() => {
    if (validateMobileNumber) {
      let num = changedMobileNumberDetails?.mobileNo.toString()
      setMobileNumber(num.substring(num.length - 4, num.length));
    } else {
      let num = userDetails?.mobileNo
        ? userDetails.mobileNo.toString()
        : "xxxx0000";
      setMobileNumber(num.substring(num.length - 4, num.length));
    }

    if (mobileVerified) {
      // setMobileVerified(localStorage.getItem("mobileVerified"));
      setOtp([0, 0, 0, 0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setOtp(["", "", "", ""]);
    }
  }, [timer]);

  const resendOTP = () => {
    if (resetOtpClicks > 2) {
      setApiErrors(
        "Maximum Resend attempts exceeded ! Please try again after some time"
      );
      if (validateMobileNumber) {
        dispatch({ type: "setResendOtpClicks", payload: { mobile: 0 } });
        onClose();
      } else {
        dispatch({ type: "setResendOtpClicks", payload: { mobile: 0 } });
        dispatch({
          type: "setVerifiedScreen",
          payload: { email: false, mobile: false },
        });
        setTimeout(() => navigate("/signin"), 3000);
      }
    } else {
      setApiErrors("");
      if (validateMobileNumber) {
        sendOtpForValidation();
      } else {
        forgotPasswordVerification
          ? sendOtpForForgetPassword()
          : sendOtpForRegistration();
      }
    }
  };

  const sendOtpForValidation = () => {
    let data = {
      userId: changedMobileNumberDetails.userId,
      tentativeMobileNumber: changedMobileNumberDetails.mobileNo,
      tentativeDialCode: changedMobileNumberDetails.dialCode,
    };
    const sendMobileOtp = async () => {
      return sendMobileOtpAPI(data);
    };
    sendMobileOtp()
      .then((response) => {
        if (response?.message === "OTP sent successfully.") {
          setOtp(["", "", "", ""]);
          setTimer(120); // Reset timer to 120 seconds
          dispatch({
            type: "setResendOtpClicks",
            payload: { mobile: resetOtpClicks + 1 },
          });
          setResetOtpClicks(resetOtpClicks + 1);
          setApiErrors("");
        } else setApiErrors(response?.message);
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
  };

  const sendOtpForForgetPassword = () => {
    let params = {
      username: userDetails.email,
      toMobile: true,
    };
    const sendOtp = async () => {
      return forgotPasswordAPI(params);
    };
    sendOtp()
      .then((response) => {
        if (response?.message === "OTP sent successfully.") {
          setOtp(["", "", "", ""]);
          setTimer(120); // Reset timer to 120 seconds
          dispatch({
            type: "setResendOtpClicks",
            payload: { mobile: resetOtpClicks + 1 },
          });
          setResetOtpClicks(resetOtpClicks + 1);
        } else {
          setApiErrors(response?.message);
        }
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
  };

  // resending otp to mobile number
  const sendOtpForRegistration = () => {
    let Payload = {
      userId: userDetails.userId ? userDetails.userId : "",
      flow: "signUp",
    };
    const sendMobileOtp = async () => {
      return getMobileOtpAPI("send-mobile-otp", Payload);
    };
    sendMobileOtp()
      .then((response) => {
        if (response?.message === "OTP sent successfully.") {
          setOtp(["", "", "", ""]);
          setTimer(120); // Reset timer to 120 seconds
          dispatch({
            type: "setResendOtpClicks",
            payload: { mobile: resetOtpClicks + 1 },
          });
          setResetOtpClicks(resetOtpClicks + 1);
        } else {
          setApiErrors(response?.message);
        }
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
  };

  const handleChange = (event, index) => {
    const { value } = event.target;
    if (value === "" || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setApiErrors("");
      setMessage("");
      // Move focus to the next input field
      if (value !== "" && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input field if the current field is empty
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  //verifying mobile otp
  const nextSubmit = () => {
    setApiErrors("");
    setMessage("");
    if (validateMobileNumber) {
      let Payload = {
        userId: changedMobileNumberDetails.userId,
        flow: "mobileNumberRevision",
        otpByUser: otp ? otp.join("") : "",
      };
      const verifyMobileOtp = async () => {
        return getMobileOtpAPI("verify-mobile-otp", Payload);
      };
      verifyMobileOtp()
        .then((response) => {
          if (response?.message === "OTP verification successful.") {
            setMessage(
              "Mobile Number validation is Successful!"
            );
            dispatch({ type: "verifyMobileOtpFromProfile", payload: { isValidated: true } });
            dispatch({ type: "setResendOtpClicks", payload: { mobile: 0 } });
          } else if (response?.message !== "OTP verification failed.") {
            setOtp(["", "", "", ""]);
            setApiErrors(response?.message);
          } else {
            setApiErrors(response?.message);
          }
        })
        .catch((error) => {
          setApiErrors(error?.message);
        });
    } else {
      let Payload = {
        userId: userDetails.userId ? userDetails.userId : "",
        flow: forgotPasswordVerification ? "forgetPassword" : "signUp",
        otpByUser: otp ? otp.join("") : "",
      };
      const verifyMobileOtp = async () => {
        return getMobileOtpAPI("verify-mobile-otp", Payload);
      };
      verifyMobileOtp()
        .then((response) => {
          if (response?.message === "OTP verification successful.") {
            if (forgotPasswordVerification) {
              if (adminUser) navigate("../resetpassword");
              else navigate("/resetpassword");
              dispatch({
                type: "setVerifiedScreen",
                payload: { mobile: true },
              });
            } else checkAdminApproveStatus()
            dispatch({ type: "setResendOtpClicks", payload: { mobile: 0 } });
          } else {
            setOtp(["", "", "", ""]);
            setApiErrors(response?.message);
          }
        })
        .catch((error) => {
          setApiErrors(error?.message);
        });
    }
  };

  const callBackBtn = () => {
    dispatch({ type: "setResendOtpClicks", payload: { mobile: 0 } });
    dispatch({
      type: "setVerifiedScreen",
      payload: { email: false, mobile: false },
    });
    navigate(-1);
  };

  const handleLogoClick = () => {
    navigate("/", { replace: true });
  }

  const checkAdminApproveStatus = () => {
    const checkAdminApproveStatusApi = async () => {
      return getAdminApprovalModeAPI();
    };
    checkAdminApproveStatusApi()
      .then((response) => {
        if (response.toggleState) {
          localStorage.setItem(
            "registrationMessage",
            "Please wait for the successful registration email for sign-in"
          );
          setMessage(
            "Thank you for submitting your Registration Request. You will be receiving a successful Registration email shortly!"
          );
          setTimeout(() => navigate("/signin"), 10000);
        }
        else {
          callAdminApprovalEmailTrigger()
        }
        dispatch({ type: "RemoveVerifiedUserOtpDetails", payload: {} });
        dispatch({
          type: "setVerifiedScreen",
          payload: { email: false, mobile: false },
        });
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
  }

  const callAdminApprovalEmailTrigger = () => {
    let payload = {
      userId: userDetails.userId ? userDetails.userId : ""
    }
    const AdminApprovalEmailTrigger = async () => {
      return getAdminApprovalEmailTriggerAPI(payload);
    };
    AdminApprovalEmailTrigger()
      .then((response) => {
        localStorage.setItem("registrationMessage", response.message);
        setMessage(
          "Thank you for submitting your Registration Request. You will be receiving a successful Registration email shortly!"
        );
        setTimeout(() => navigate("/signin"), 10000);
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
  }

  return (
    <div className="forgotPassword">
      <div className="content">
        {validateMobileNumber ? (
          ""
        ) : (
          <div className="d-flex mb-4">
            <img src={NCT_seal} className="NCT_seal me-4" alt="NCT seal logo" />
            <img src={transportStackLogo} className="transportStackLogo cursor-pointer" alt="header logo" onClick={handleLogoClick} />
          </div>
        )}
        <div>
          <div className="responsive-header">
            <h2 className="registerLabel">Enter Mobile Verification Code</h2>
            {validateMobileNumber ? (
              ""
            ) : (
              <ButtonComponent
                className="backpositioning"
                type="primaryWhite"
                disabled={mobileVerified}
                onClick={() => {
                  callBackBtn();
                }}
              >
                Back
              </ButtonComponent>
            )}
          </div>
          <p>Code was sent via SMS to xxxxxx{mobileNumber}</p>
          {!forgotPasswordVerification ? (
            <p style={{ color: "green" }}> {message}</p>
          ) : null}

          {mobileVerified ? null : (
            <>
              {timer > 0 ? (
                <p className="resendotp">
                  Please enter OTP in{" "}
                  <span className="emailTimer">{formatTime(timer)}</span>
                </p>
              ) : (
                <p className="resendotp">
                  Click on Resend OTP button to get new OTP
                </p>
              )}
            </>
          )}

          <div className="formComponent">
            <Form>
              <div className="code-div d-flex">
                {otp.map((digit, index) => (
                  <Form.Control
                    id={`otp-${index}`}
                    type="password"
                    maxLength="1"
                    value={digit}
                    key={`otp-${index + ''}`}
                    disabled={mobileVerified}
                    className="form-control"
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    style={{ textAlign: "center", fontSize: "18px" }}
                  />
                ))}
                {message.length > 0 || mobileVerified ? (
                  <img
                    src={success}
                    style={{
                      justifyContent: "center",
                      height: "42px",
                      width: "42px",
                    }}
                    alt="header logo"
                  />
                ) : null}
              </div>
            </Form>
          </div>
        </div>
        <div className="submit-btn">
          {mobileVerified ? (
            <ButtonComponent
              type="primaryBlue"
              onClick={() => {
                navigate(1);
              }}
            >
              Next
            </ButtonComponent>
          ) : (
            <ButtonComponent
              type="primaryBlue"
              disabled={otp.includes("") || message.length > 0}
              onClick={() => nextSubmit()}
            >
              {forgotPasswordVerification || validateMobileNumber
                ? "Submit"
                : "Next"}
            </ButtonComponent>
          )}

          <ButtonComponent
            type="primaryBlue"
            onClick={resendOTP}
            disabled={timer > 0 || !otp.includes("") || mobileVerified}
          >
            Resend OTP
          </ButtonComponent>
          {validateMobileNumber &&
            <ButtonComponent
              type="primaryBlue"
              onClick={() => onClose()}
            >
              Close
            </ButtonComponent>}
        </div>
        <p className="is-invalid-border-only mt-2">{apiErrors}</p>
        <p style={{ color: "green" }}>
          {mobileVerified ? "OTP verification successful." : ""}
        </p>
      </div>
      {adminUser || validateMobileNumber ? null : <Footer></Footer>}
    </div>
  );
};

export default MobileVerification;
