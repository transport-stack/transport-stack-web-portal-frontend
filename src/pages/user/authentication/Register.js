import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useMasterData from '../../../hooks/useMasterData';
import AddSeo from "../../../utils/AddSeo";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Footer from "../../../components/user/Footer";
import { registerAPI, sendEmailOtpAPI } from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import "../../../assets/styles/forgotPassword.scss";
import "../../../assets/styles/style.scss";
import transportStackLogo from "../../../assets/images/ts-logo-updated.png";
import eyeIconShow from "../../../assets/images/eye_password_show.png";
import eyeIconHide from "../../../assets/images/eye_password_hide.png";
import NCT_seal from "../../../assets/images/delhi_logo.svg";
import CustomSelect from "../../../components/common/ui/select/CustomSelect";

const Register = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [countryCodeValue, setCountryCodeValue] = useState('');
  const { data: organizationTypeMaster } = useMasterData('organization-type', 'admin', false);
  const { data: countriesMaster } = useMasterData('countries', '', false, true);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const country = watch("country")

  useEffect(() => {
    dispatch({ type: 'setVerifiedScreen', payload: { email: false, mobile: false } })
  }, []);

  useEffect(() => {
    setValue("country", "India");
    reset({
      country: "India",
    })
  }, [countriesMaster])

  const handleRegister = (data) => {
    setLoader(true);
    setApiErrors("");
    data.dialCode = countryCodeValue;
    const postRegister = async () => {
      return registerAPI(data);
    };

    postRegister()
      .then((response) => {
        let obj = {
          mobileNo: data.mobileNumber,
          email: data.email,
          userId: response?.userId,
          register: true
        };
        dispatch({ type: 'verifyUserOtpDetails', payload: obj })
        let emailData = {
          userId: response?.userId,
          flow: "signUp",
        };

        if (
          response?.message === "User registered successfully" ||
          response?.message === "Thank you for submitting your Registration Request. You will be receiving a successful Registration email shortly!" ||
          response?.message === "Thank you for submitting your registration request. An account with the admin role already exists. Please contact the admin for your credentials!" ||
          response?.message === "User registered successfully. An account with the admin role already exists. Please contact the admin for your credentials!"
        ) {
          const sendEmailOtp = async () => {
            return sendEmailOtpAPI(emailData);
          };
          sendEmailOtp()
            .then((res) => {
              if (res?.message === "OTP sent successfully.") {
                setLoader(false);
                navigate("/emailverification");
              }
            })
            .catch((error) => {
              setApiErrors(error.message);
            });
        } else {
          setApiErrors(response?.message);
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        if (error?.response?.data?.message) {
          setApiErrors(error.response.data.message);
        } else {
          setApiErrors(error?.message);
        }
      });
  };

  const cancel = () => {
    reset();
  };

  const handleLogoClick = () => {
    navigate("/", { replace: true });
  }

  return (
    <div className="forgotPassword">
      <AddSeo title="Delhi Transport Stack" description="Create a new account." />
      <div className="content">
        <div className="d-flex mb-4">
          <img src={NCT_seal} className="NCT_seal me-4" alt="NCT seal logo" />
          <img src={transportStackLogo} className="transportStackLogo cursor-pointer" alt="header logo" onClick={handleLogoClick} />
        </div>
        <div>
          <h2 className="registerLabel">Register now</h2>
          <Row style={{ display: "flex", justifyContent: "space-between" }}>
            <Col xs="auto">
              <span>Already Registered? </span>
              <NavLink
                onClick={() => {
                  navigate("../signin");
                }}
                className="registerTerms"
              >
                Sign In
              </NavLink>
            </Col>
            <Col xs="auto">
              <span className="star">* </span>
              <span className="mandatoryNotification">Mandatory fields</span>
            </Col>
          </Row>

          <div className="formComponent">
            <Form autoComplete="off" id="registerForm">
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel label="First name" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="First name"
                      name="firstName"
                      required
                      disabled={loader}
                      maxLength={30}
                      className={
                        errors.firstName ? "is-invalid-border-only" : ""
                      }
                      {...register("firstName", {
                        required: "First name is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/i,
                          message: "First name must contain only alphabets",
                        },
                      })}
                    />
                    {errors.firstName && (
                      <span className="is-invalid-border-only">
                        {errors.firstName.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
                <Col md={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel label="Last name" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Last name"
                      name="lastName"
                      disabled={loader}
                      maxLength={30}
                      {...register("lastName", {
                        pattern: {
                          value: /^[A-Za-z\s]+$/i,
                          message: "Last name must contain only alphabets",
                        },
                      })
                      }
                    />
                    {errors.lastName && (
                      <span className="is-invalid-border-only">
                        {errors.lastName.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col xs={3} sm={2} lg={{ span: 1 }}>
                  <CustomSelect
                    options={countriesMaster}
                    placeholder="Code"
                    onSelectChange={setCountryCodeValue}></CustomSelect>
                </Col>
                <Col xs={9} sm={10} lg={{ span: 4 }}>
                  <FloatingLabel label="Mobile Number" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Mobile number"
                      maxLength={countryCodeValue === '+91' ? 10 : 15}
                      name="mobileNumber"
                      required
                      className={
                        errors.mobileNumber ? "is-invalid-border-only" : ""
                      }
                      disabled={loader}
                      {...register("mobileNumber", {
                        required: "Mobile number is required",
                        ...(countryCodeValue === '+91' && {
                          pattern: {
                            value: /^[6-9]{1}[0-9]{9}$/,
                            message: "Mobile number is not valid",
                          },
                        }),
                        ...(countryCodeValue !== '+91' && {
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Mobile number is not valid",
                          },
                        }),
                      })}
                    />
                    {errors.mobileNumber && (
                      <span className="is-invalid-border-only">
                        {errors.mobileNumber.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
                <Col xs={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel label="Organization Name" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Organization name"
                      name="organizationName"
                      disabled={loader}
                      maxLength={60}
                      className={
                        errors.organizationName ? "is-invalid-border-only" : ""
                      }
                      required
                      {...register("organizationName", {
                        required: "Organization name is required",
                        pattern: {
                          value: /^(?=.*[A-Za-z])[A-Za-z0-9\s\-.,'&]+$/,
                          message: "Organization name must contain atleast one letter and can include letters,numbers,spaces and special characters(-&')",
                        },
                      })}
                    />
                    {errors.organizationName && (
                      <span className="is-invalid-border-only">
                        {errors.organizationName.message}
                      </span>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel
                    controlId="organizationTypeId"
                    label="Type of organization"
                    className="mb-3"
                  >
                    <Form.Select
                      aria-label="Type of organization"
                      name="organizationTypeId"
                      disabled={loader}
                      className={
                        errors.organizationTypeId
                          ? "is-invalid-border-only"
                          : ""
                      }
                      required
                      {...register("organizationTypeId", {
                        required: "Organization type is required",
                      })}
                    >
                      <option value=''>Select</option>
                      {organizationTypeMaster.length > 0 && organizationTypeMaster.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                    <span className="is-invalid-border-only">
                      {errors.organizationTypeId &&
                        <span className="is-invalid-border-only">{errors.organizationTypeId.message}</span>}
                    </span>
                  </FloatingLabel>
                </Col>
                <Col md={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel label="Address" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Address"
                      name="address"
                      disabled={loader}
                      {...register("address")}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel
                    controlId="country"
                    label="Country"
                    className="mb-3"
                  >
                    <Form.Select
                      aria-label="Floating label select country"
                      name="country"
                      disabled={loader}
                      required
                      {...register("country", {
                        required: "Country is required",
                      })}
                    >
                      <option value=''>Select</option>
                      {countriesMaster.length > 0 && countriesMaster.map((option) => (
                        <option key={option.value} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                    <span className="is-invalid-border-only">
                      {errors.country &&
                        <span className="is-invalid-border-only">{errors.country.message}</span>}
                    </span>
                  </FloatingLabel>
                </Col>
                <Col md={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel label="Pincode" className="mb-3">
                    <Form.Control
                      type="text"
                      maxLength={country === 'India' ? 6 : 10}
                      placeholder="Pincode"
                      name="pinCode"
                      autoComplete="off"
                      disabled={loader}
                      {...register("pinCode", {
                        ...(country === 'India' && {
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: "Pincode is not valid",
                          },
                        }),
                        ...(country !== 'India' && {
                          pattern: {
                            value: /^[a-zA-Z0-9\s\-]{3,10}$/,
                            message: "Pincode is not valid",
                          },
                        }),
                      })}
                    />
                    <span className="is-invalid-border-only">
                      {errors.pinCode && (
                        <span className="is-invalid-border-only">
                          {errors.pinCode.message}
                        </span>
                      )}
                    </span>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel
                    controlId="state"
                    label="State"
                    className="mb-3"
                  >
                    <Form.Select
                      aria-label="Floating label select State"
                      name="state"
                      disabled={loader}
                      {...register("state")}
                    >

                      <option value=''>Select</option>
                      {country === 'India' && (
                        <>
                          <option value="AndhraPradesh">Andhra Pradesh</option>
                          <option value="AndamanandNicobarIslands">
                            Andaman and Nicobar Islands
                          </option>
                          <option value="ArunachalPradesh">
                            Arunachal Pradesh
                          </option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="DadarandNagarHaveli">
                            Dadar and Nagar Haveli
                          </option>
                          <option value="DamanandDiu">Daman and Diu</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Lakshadweep">Lakshadweep</option>
                          <option value="Puducherry">Puducherry</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="HimachalPradesh">Himachal Pradesh</option>
                          <option value="JammuandKashmir">Jammu and Kashmir</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="MadhyaPradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="TamilNadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="UttarPradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="WestBengal">West Bengal</option>
                        </>
                      )}
                      {country !== 'India' && (
                        <option value="Others">Others</option>
                      )}
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col md={12} lg={{ span: 5, offset: 2 }}>
                  <FloatingLabel label="Password" className="mb-3">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      name="password"
                      required
                      disabled={loader}
                      autoComplete="new-password"
                      className={
                        errors.password ? "is-invalid-border-only" : ""
                      }
                      {...register("password", {
                        required: "Password is required",
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

                          return message.length === 0 || `Password must contain:\n${message.join("\n")}`

                        },
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
                    <span className="is-invalid-border-only">
                      {errors.password && (
                        <span className="is-invalid-border-only">
                          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                            {errors.password?.message.split("\n").map((line, i) => (
                              <span key={i}>
                                <li>{line}</li>
                              </span>
                            ))}
                          </ul>
                        </span>
                      )}
                    </span>
                    <Form.Text>
                      <ul style={{ paddingLeft: "16px", paddingTop: "4px" }}>
                        <li>Use at least 8 characters</li>
                        <li>
                          Use one uppercase, one numeric and one lowercase and
                          one special character
                        </li>
                      </ul>
                    </Form.Text>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={{ span: 5 }}>
                  <FloatingLabel label="Email" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Email"
                      name="email"
                      autoComplete="username"
                      maxLength={320}
                      disabled={loader}
                      required
                      className={errors.email ? "is-invalid-border-only" : ""}
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

              <Row>
                <Col md={12}>
                  <FloatingLabel
                    controlId="floatingTextarea"
                    label="Profile description"
                    className="mb-3 floating_textarea_label"
                  >
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Profile description"
                      disabled={loader}
                      maxLength={200}
                      className={
                        errors.profileDescription
                          ? "is-invalid-border-only"
                          : ""
                      }
                      {...register("profileDescription")}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="submit-btn">
          <ButtonComponent
            type="primaryBlue"
            form="registerForm"
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
          <ButtonComponent type="primaryWhite" onClick={() => cancel()}>
            Cancel
          </ButtonComponent>
        </div>
        <p className="is-invalid-border-only mt-2">{apiErrors}</p>
        <div className="rowspace">
          <span>By submitting, you agree to our </span>{" "}
          <NavLink
            onClick={() => {
              navigate("/termsofuse");
            }}
            className="registerTerms"
          >
            Terms of Use
          </NavLink>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Register;
