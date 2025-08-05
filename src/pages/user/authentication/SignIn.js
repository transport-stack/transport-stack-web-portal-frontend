import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resetUserError } from "../../../redux/slices/auth/authSlice";
import AddSeo from "../../../utils/AddSeo";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Footer from "../../../components/user/Footer";
import "../../../assets/styles/formcomponent.scss";
import "../../../assets/styles/forgotPassword.scss";
import "../../../assets/styles/style.scss";
import eyeIconShow from "../../../assets/images/eye_password_show.png";
import eyeIconHide from "../../../assets/images/eye_password_hide.png";
import transportStackLogo from "../../../assets/images/ts-logo-updated.png";
import NCT_seal from "../../../assets/images/delhi_logo.svg";

const SignIn = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.auth.user);
  const { path, status } = useSelector((state) => state.verify.dataServiceLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(resetUserError())
    return () => {
      dispatch(resetUserError())
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem("registrationMessage") !== null) {
      setMessage(
        localStorage.getItem("registrationMessage")
      );
      setTimeout(() => localStorage.removeItem("registrationMessage"), 3000);
    }
    dispatch({ type: "RemoveVerifiedUserOtpDetails", payload: {} });
    dispatch({ type: 'setVerifiedScreen', payload: { email: false, mobile: false } })
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (status) {
        navigate(path, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSignin = (data) => {
    dispatch({ type: "auth/userLoginRequest", payload: { ...data, userCategory: "user" } });
  };

  const handleLogoClick = () => {
    navigate("/", { replace: true });
  }

  return (
    <div className="forgotPassword">
      <AddSeo title="Delhi Transport Stack" description="Access your account." />
      <div className="content">
        <div className="d-flex mb-4">
          <img src={NCT_seal} className="NCT_seal me-4" alt="NCT seal logo" />
          <img src={transportStackLogo} className="transportStackLogo cursor-pointer" alt="header logo" onClick={handleLogoClick} />
        </div>
        <div>
          <h1>Sign in</h1>
          <span>New user? </span>
          <NavLink to={"/register"} className="link">
            Register now
          </NavLink>
          <p style={{ color: "green" }} className="mt-2"> {message}</p>
          <div className="formComponent my-3">
            <Form autoComplete="off" id="signinForm">
              <Row>
                <Col md={6} lg={4}>
                  <FloatingLabel
                    controlId="username"
                    label="Enter your registered Email ID"
                    className="mb-3"
                  >
                    <Form.Control
                      placeholder="Enter your registered Email ID"
                      type="text"
                      name="username"
                      autoComplete="username"
                      required
                      maxLength={320}
                      className={
                        errors.username ? "is-invalid-border-only" : ""
                      }
                      {...register("username", {
                        required: "Email ID is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email ID is not valid",
                        },
                      })}
                    />
                    {errors.username && (
                      <span className="is-invalid-border-only">
                        {errors.username.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={6} lg={4}>
                  <FloatingLabel
                    controlId="password"
                    label="Enter password"
                    className="mb-3"
                  >
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      required
                      className={
                        errors.password ? "is-invalid-border-only" : ""
                      }
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <div
                      className="eye_icon"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <img
                          className="show_password_icon"
                          src={eyeIconShow}
                          alt="password icon show"
                        />
                      ) : (
                        <img src={eyeIconHide} alt="password icon hide" />
                      )}
                    </div>
                    {errors.password && (
                      <span className="is-invalid-border-only">
                        {errors.password.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="submit-btn">
          <ButtonComponent
            type="primaryBlue"
            form="signinForm"
            onClick={handleSubmit(handleSignin)}
          >
            Sign in
          </ButtonComponent>
        </div>
        <p className="is-invalid-border-only mt-2">{error}</p>
        <div className="rowspace">
          <NavLink to={"/forgotpassword"} className="link">
            Forgot password
          </NavLink>
        </div>
        <div className="rowspace">
          <span>By signing in, you agree to our </span>{" "}
          <NavLink to={"/termsofuse"} className="link">
            Terms of use
          </NavLink>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default SignIn;
