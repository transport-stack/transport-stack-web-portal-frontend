import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MyProfileMobileVerification from "./MyProfileMobileVerification";
import useMasterData from "../../../hooks/useMasterData";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import {
  sendMobileOtpAPI,
  updateUserDetailsAPI,
  viewUserAPI,
} from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import "../../../assets/styles/forgotPassword.scss";
import "../../../assets/styles/style.scss";
import ApproveIcon from "../../../assets/images/approved.png";
import CustomSelect from "../../../components/common/ui/select/CustomSelect";

const MyProfile = () => {
  const dispatch = useDispatch();
  const { isValidated } = useSelector((state) => state.verify.mobileNoverified);
  const [apiErrors, setApiErrors] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [loader, setLoader] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [mobileNoErrors, setMobileNoErrors] = useState("");
  const [existingCountryCode, setExistingCountryCode] = useState();
  const [countryCodeValue, setCountryCodeValue] = useState('');
  const { data: organizationTypeMaster } = useMasterData('organization-type', 'user', false);
  const [organizationTypeValue, setOrganizationTypeValue] = useState('');
  const { data: countriesMaster } = useMasterData('countries', '', false, true);
  const [countryValue, setCountryValue] = useState('');
  const [stateValue, setStateValue] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const country = watch("country")

  const {
    profile: { id,dialCode },
  } = useSelector((state) => state.auth.user);

  useEffect(() => {
    setValue("organizationTypeId", organizationTypeValue);
  }, [organizationTypeMaster, organizationTypeValue]);

  useEffect(() => {
    setValue("country", countryValue);
  }, [countriesMaster, countryValue]);

  useEffect(() => {
    setValue("state", stateValue);
  }, [stateValue]);

  useEffect(() => {
    if (id) {
      let data = {
        userId: id,
      };
      const viewUser = async () => {
        return viewUserAPI(data);
      };
      viewUser()
        .then((response) => {
          setLoader(false);
          if (response) {
            setMobileNo(response?.mobileNumber);
            setValue("firstName", response?.firstName || "");
            setValue("lastName", response?.lastName || "");
            setValue("profileDescription", response?.profileDescription || "");
            setExistingCountryCode(response?.dialCode);
            setCountryCodeValue(response?.dialCode);
            setValue("mobileNumber", response?.mobileNumber || "");
            setValue("email", response?.email || "");
            setValue("organizationName", response?.organizationName || "");
            setValue("organizationTypeId", response?.organizationTypeId || "");
            setOrganizationTypeValue(response?.organizationTypeId);
            setValue("address", response?.address || "");
            setValue("pinCode", response?.pinCode || "");
            setValue("country", response?.country || "");
            setCountryValue(response?.country);
            setValue("state", response?.state || "");
            setStateValue(response?.state);
            setValue("id", response?.id || "");
          } else {
            setApiErrors(response?.message);
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
    }
    window.scrollTo(0, 0);
  }, [id]);

  const showMobileVerification = (e) => {
    e.preventDefault();
    setMobileNoErrors("");
    let obj = {
      mobileNo: getValues("mobileNumber"),
      userId: getValues("id"),
      dialCode: countryCodeValue,
    };
    let emailData = {
      userId: getValues("id"),
      tentativeMobileNumber: getValues("mobileNumber"),
      tentativeDialCode: countryCodeValue
    };
    const sendMobileOtp = async () => {
      return sendMobileOtpAPI(emailData);
    };
    sendMobileOtp()
      .then((response) => {
        if (response?.message === "OTP sent successfully.") {
          setShowMobileDialog(true);
          setApiErrors("");
          setLoader(false);
        } else {
          // setMobileNoErrors(response?.message);
          if (
            response?.message ===
            "Failed to send OTP SMS. Tentative mobile number is already in use by another user."
          ) {
            setMobileNoErrors(response?.message);
          }
          setApiErrors(response?.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setMobileNoErrors(error.response.data.message);
        } else {
          setApiErrors(error?.message);
        }
      });

    dispatch({ type: "verifyUserMobileNumber", payload: obj });
  };

  const handleRegister = (data) => {
    const payload = {
      userId: id,
      mobileNumber: data.mobileNumber,
      organizationName: data.organizationName,
      organizationTypeId: data.organizationTypeId,
      profileDescription: data.profileDescription,
      lastName: data.lastName,
      address: data.address,
      country: data.country,
      pinCode: data.pinCode,
      state: data.state,
      dialCode: countryCodeValue
    };
    setLoader(true);
    setApiErrors("");
    if ((mobileNo !== getValues("mobileNumber") || existingCountryCode !== countryCodeValue) && isValidated === false) {
      setLoader(false);
      setApiErrors("Please validate mobile Number before submitting");
    } else {
      const updateUserDetails = async () => {
        return updateUserDetailsAPI(payload);
      };
      updateUserDetails()
        .then((response) => {
          setLoader(false);
          if (response?.message === "User details updated successfully") {
            setIsEditable(false);
            dispatch({
              type: "verifyMobileOtpFromProfile",
              payload: { isValidated: false },
            });
            dispatch({
              type: "verifyUserMobileNumber",
              payload: { mobileNo: null, userId: null },
            });
            setApiMessage(response.message);
          } else {
            setApiErrors(response?.message);
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
    }
  };

  const handleEditable = () => {
    setIsEditable(true);
    setApiMessage("");
    setApiErrors("");
  };

  const handleClose = () => {
    setShowMobileDialog(false);
  };

  return (
    <>
      {showMobileDialog && (
        <MyProfileMobileVerification onClose={handleClose} />
      )}
      <div className="forgotPassword">
        <div className="content">
          <div>
            <Row className="d-flex justify-content-between mb-3">
              <Col
                xs="auto"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h2 className="registerLabel">My Profile</h2>
                <ButtonComponent
                  type="primaryBlue"
                  onClick={handleEditable}
                  style={{ marginLeft: "1rem" }}
                  disabled={isEditable}
                >
                  Edit
                </ButtonComponent>
              </Col>
              <Col xs="auto">
                <span className="star">*</span>
                <span className="mandatoryNotification"> Mandatory fields</span>
              </Col>
            </Row>
            <p className="success-message mt-2">{apiMessage}</p>
            <p className="is-invalid-border-only mt-2">{mobileNoErrors}</p>
            <div className="formComponent">
              <Form autoComplete="false">
                <Row>
                  <Col md={12} lg={{ span: 5 }}>
                    <FloatingLabel label="First name" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        name="firstName"
                        required
                        disabled
                        maxLength={30}
                        {...register("firstName", {
                          required: "First name is required",
                          pattern: {
                            value: /^[A-Za-z\s]+$/i,
                            message: "First name must contain only alphabets",
                          },
                        })}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={12} lg={{ span: 5, offset: 2 }}>
                    <FloatingLabel label="Last name" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        name="lastName"
                        disabled={!isEditable}
                        maxLength={30}
                        {...register("lastName", {
                          pattern: {
                            value: /^[A-Za-z\s]+$/i,
                            message: "Last name must contain only alphabets",
                          },
                        })}
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
                        disabled={!isEditable}
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
                <Row>
                  <Col xs={3} sm={2} lg={{ span: 1 }}>
                    <CustomSelect
                      options={countriesMaster}
                      placeholder="Code"
                      disabled={!isEditable}
                      defaultValue={dialCode}
                      onSelectChange={(value) => setCountryCodeValue(value)}></CustomSelect>
                  </Col>
                  <Col xs={9} sm={10} lg={{ span: 4 }}>
                    <InputGroup>
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
                          // ref={mobileRef}
                          disabled={!isEditable}
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
                        // onChange={(event) => setMobileNoErrors("")}
                        />
                        {/* {errors.mobileNumber} */}
                        {errors.mobileNumber && (
                          <span className="is-invalid-border-only">
                            {errors.mobileNumber.message}
                          </span>
                        )}
                      </FloatingLabel>
                      {isEditable ? (
                        <InputGroup.Text
                          className={
                            errors.mobileNumber ? "validate" : "iconProfile"
                          }
                        >
                          <ButtonComponent
                            type="primaryBlue"
                            onClick={(e) => showMobileVerification(e)}
                            disabled={mobileNo === getValues("mobileNumber") && existingCountryCode === countryCodeValue}
                          >
                            Validate
                          </ButtonComponent>
                        </InputGroup.Text>
                      ) : (
                        <InputGroup.Text className="iconProfile">
                          {/* <ApproveIcon/> */}
                          <img
                            src={ApproveIcon}
                            alt="edit icon"
                            style={{ width: "48px" }}
                          />
                        </InputGroup.Text>
                      )}
                    </InputGroup>
                  </Col>
                  <Col md={12} lg={{ span: 5, offset: 2 }}>
                    <FloatingLabel label="Email" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Email ID"
                        name="email"
                        maxLength={320}
                        disabled
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
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} lg={{ span: 5 }}>
                    <FloatingLabel label="Organization Name" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Organization name"
                        name="organizationName"
                        disabled={!isEditable}
                        maxLength={60}
                        className={
                          errors.organizationName
                            ? "is-invalid-border-only"
                            : ""
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
                  <Col md={12} lg={{ span: 5, offset: 2 }}>
                    <FloatingLabel
                      controlId="organizationTypeId"
                      label="Type of organization"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Type of organization"
                        name="organizationTypeId"
                        disabled={!isEditable}
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
                </Row>
                <Row>
                  <Col md={12} lg={{ span: 5 }}>
                    <FloatingLabel label="Address" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Address"
                        name="address"
                        disabled={!isEditable}
                        {...register("address")}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={12} lg={{ span: 5, offset: 2 }}>
                    <FloatingLabel label="Pincode" className="mb-3">
                      <Form.Control
                        type="text"
                        maxLength={country === 'India' ? 6 : 10}
                        placeholder="Pincode"
                        name="pinCode"
                        disabled={!isEditable}
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
                      controlId="floatingSelect"
                      label="Country"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Floating label select country"
                        name="country"
                        disabled={!isEditable}
                        required
                        {...register("country", {
                          required: "Country is required",
                        })}
                      >
                        <option value="">Select</option>
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
                    <FloatingLabel
                      controlId="floatingSelect"
                      label="State"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Floating label select State"
                        name="state"
                        disabled={!isEditable}
                        {...register("state")}
                      >
                        <option value="">Select</option>
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
                </Row>
              </Form>
            </div>
          </div>
          {isEditable && (
            <div className="submit-btn">
              <ButtonComponent
                type="primaryBlue"
                onClick={handleSubmit(handleRegister)}
                disabled={mobileNoErrors !== ""}
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
            </div>
          )}
          <p className="is-invalid-border-only mt-2">{apiErrors}</p>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
