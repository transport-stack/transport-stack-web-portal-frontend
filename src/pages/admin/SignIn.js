import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resetAdminError } from "../../redux/slices/auth/authSlice";
import ButtonComponent from "../../components/common/ui/button/ButtonComponent";
import "../../assets/styles/formcomponent.scss";
import "../../assets/styles/forgotPassword.scss";
import "../../assets/styles/style.scss";
// import logo from "../../assets/images/logo.png";
import transportStackLogo from "../../assets/images/ts-logo-updated.png";
import eyeIconShow from "../../assets/images/eye_password_show.png";
import eyeIconHide from "../../assets/images/eye_password_hide.png";
import NCT_seal from "../../assets/images/delhi_logo.svg";

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, role, error } = useSelector((state) => state.auth.admin);
    const [showPassword, setShowPassword] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        dispatch(resetAdminError())
        return () => {
            dispatch(resetAdminError())
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            if (role.includes('ROLE_SUPER_ADMIN')) {
                navigate("/admin/adminmanagement", { replace: true })
            } else if (role.includes('ROLE_DATA_PROVIDER')) {
                navigate("/admin/dataservicemanagement/datasetlisting", { replace: true });
            } else if (role.includes('ROLE_ADMIN')) {
                navigate("/admin/usermanagement", { replace: true });
            } else {
                navigate("/admin/signin", { replace: true });
            }
        }
    }, [isAuthenticated, role, navigate])

    const handleSignin = (data) => {
        dispatch({ type: 'auth/adminLoginRequest', payload: { ...data, userCategory: "admin" } });
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
                {/* <img src={logo} className="logo cursor-pointer" alt="header logo" onClick={handleLogoClick}/> */}

                <div>
                    <h1>Sign in</h1>
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
                                            required
                                            maxLength={320}
                                            className={
                                                errors.username
                                                    ? "is-invalid-border-only"
                                                    : ""
                                            }
                                            {...register("username", {
                                                required: "Email ID is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Email ID is not valid'
                                                }
                                            })}
                                        />
                                        {errors.username && <span className="is-invalid-border-only">{errors.username.message}</span>}
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
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            placeholder="Password"
                                            required
                                            className={
                                                errors.password
                                                    ? "is-invalid-border-only"
                                                    : ""
                                            }
                                            {...register("password", {
                                                required: "Password is required"
                                            })}
                                        />
                                        <div className="eye_icon" onClick={() => { setShowPassword(!showPassword) }}>
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
                                        {errors.password && (<span className="is-invalid-border-only">{errors.password.message}</span>)}
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                </div>
                <div className="submit-btn">
                    <ButtonComponent type='primaryBlue' form="signinForm" onClick={handleSubmit(handleSignin)}>
                        Sign in</ButtonComponent>
                </div>
                <p className="is-invalid-border-only mt-2">{error}</p>
                <div className="rowspace">
                    <NavLink to={'../forgotpassword'} className='link'>Forgot password</NavLink>

                </div>
                <div className="rowspace">
                    <span>By signing in, you agree to our </span> <NavLink to={'/admin/privacypolicy'} className='link'>Privacy policy</NavLink>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
