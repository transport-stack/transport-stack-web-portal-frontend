import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Footer from "../../../components/user/Footer";
import {
  sendEmailOtpAPI,
  verifyEmailOtpAPI,
  getMobileOtpAPI,
} from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import "../../../assets/styles/forgotPassword.scss";
import "../../../assets/styles/style.scss";
import transportStackLogo from "../../../assets/images/ts-logo-updated.png";
import success from "../../../assets/images/check_circle_fill.png";
import NCT_seal from "../../../assets/images/delhi_logo.svg";

const EmailVerification = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = useSelector((state) => state.verify);
  const [adminUser] = useState(location.pathname.includes("admin"));
  const [forgotPasswordVerification] = useState(
    location.pathname.includes("forgot-password-email-verification")
  );
  const [loader, setLoader] = useState();
  const [apiErrors, setApiErrors] = useState("");
  const [resetOtpClicks, setResetOtpClicks] = useState(userData.resendOtpClicks.email);
  const [userDetails] = useState(userData.userOtpDetails);
  const [emailVerified] = useState(userData.verifiedScreen.email);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(120); // 120 seconds for the timer
  const [email, setEmail] = useState("ggxxx@gmail.com");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // console.log('user datails.....',userData);
    let mail = userDetails.email ? userDetails.email : "ggxxx@gmail.com";
    setEmail(mail.substring(0, 2) + "xxx@" + mail.split("@").pop());
    if (emailVerified) {
      // setEmailVerified(localStorage.getItem("emailVerified"));
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
      dispatch({ type: 'setResendOtpClicks', payload: { email: 0 } })
      setTimeout(() => navigate("/signin"), 3000);
    } else {
      setLoader(true);
      let emailData = {
        userId: userDetails.userId ? userDetails.userId : "",
        flow: "signUp",
      };
      const sendEmailOtp = async () => {
        return sendEmailOtpAPI(emailData);
      };
      sendEmailOtp()
        .then((response) => {
          if (response?.message === "OTP sent successfully.") {
            setApiErrors("");
            setLoader(false);
            setTimer(120); // Reset timer to 120 seconds
            dispatch({ type: 'setResendOtpClicks', payload: { email: resetOtpClicks + 1 } })
            setResetOtpClicks(resetOtpClicks + 1);
          } else setApiErrors(response?.message);
          setOtp(["", "", "", ""]);
        })
        .catch((error) => {
          setApiErrors(error?.message);
        });
    }
  };

  const handleChange = (event, index) => {
    const { value } = event.target;
    if (value === "" || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

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

  const nextSubmit = () => {
    setLoader(true);
    let verifyEmailData = {
      userId: userDetails.userId ? userDetails.userId : "",
      flow: forgotPasswordVerification ? "forgetPassword" : "signUp",
      otpByUser: otp ? otp.join("") : "",
    };
    const verifyEmailOtp = async () => {
      return verifyEmailOtpAPI(verifyEmailData);
    };
    verifyEmailOtp()
      .then((response) => {
        setLoader(false);
        if (response?.message === "OTP verification successful.") {
          setLoader(false);
          setApiErrors("");
          setMessage(response.message);
          forgotPasswordVerification
            ? setTimeout(() => {
              if (adminUser) navigate("../resetpassword");
              else navigate("/resetpassword");
              dispatch({ type: 'setResendOtpClicks', payload: { email: 0 } })
            }, 3000)
            : callMobileOTP();
          dispatch({ type: 'setVerifiedScreen', payload: { email: true } })
          // localStorage.setItem("emailVerified", true);
        } else {
          setApiErrors(response?.message);
          setOtp(["", "", "", ""]);
        }
      })
      .catch((error) => {
        setApiErrors(error?.message);
        setOtp(["", "", "", ""]);
        setLoader(false);
      });
  };

  // sending otp to mobile number
  const callMobileOTP = () => {
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
          navigate("/mobileverification");
          dispatch({ type: 'setResendOtpClicks', payload: { email: 0 } })
          setApiErrors("");
        } else {
          setApiErrors(response?.message);
        }
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
  };

  const callBackBtn = () => {
    // localStorage.removeItem("emailVerified");
    dispatch({ type: 'setVerifiedScreen', payload: { email: false } })
    dispatch({ type: 'setResendOtpClicks', payload: { email: 0 } })
    navigate(-1);
  };

  const handleLogoClick = () => {
    navigate("/", { replace: true });
  }

  return (
    <div className="forgotPassword">
      <div className="content">
        <div className="d-flex mb-4">
          <img src={NCT_seal} className="NCT_seal me-4" alt="NCT seal logo" />
          <img src={transportStackLogo} className="transportStackLogo cursor-pointer" alt="header logo" onClick={handleLogoClick} />
        </div>
        <div>
          <div className="responsive-header">
            <h2 className="registerLabel">Enter E mail verification code</h2>
            <ButtonComponent
              className="backpositioning"
              type="primaryWhite"
              disabled={emailVerified}
              onClick={() => {
                callBackBtn()
              }}
            >
              Back
            </ButtonComponent>
          </div>
          <p>Code was sent to {email}</p>
          {emailVerified ? null : (
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
                    key={`otp-${index + ""}`}
                    disabled={loader || emailVerified}
                    className="form-control"
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    style={{ textAlign: "center", fontSize: "18px" }}
                  />
                ))}
                {message.length > 0 || emailVerified ? (
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
          {emailVerified ? (
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
              {forgotPasswordVerification ? "Submit" : "Next"}
            </ButtonComponent>
          )}
          <ButtonComponent
            type="primaryBlue"
            onClick={resendOTP}
            disabled={timer > 0 || !otp.includes("") || emailVerified}
          >
            Resend OTP
          </ButtonComponent>
        </div>
        <p className="is-invalid-border-only mt-2">{apiErrors}</p>
        <p style={{ color: "green" }}>{emailVerified ? 'OTP verification successful.' : message}</p>
      </div>
      {adminUser ? null : <Footer></Footer>}
    </div>
  );
};

export default EmailVerification;
