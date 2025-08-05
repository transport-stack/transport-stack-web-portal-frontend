import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Accordion from "react-bootstrap/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import useMasterData from "../../hooks/useMasterData";
import useCheckMobileScreen from "../../hooks/useCheckMobileScreen";
import AddSeo from "../../utils/AddSeo";
import Banner from "../../components/user/Banner";
import Breadcrumb from "../../components/user/ui/Breadcrumb/Breadcrumb";
import ButtonComponent from "../../components/common/ui/button/ButtonComponent";
import { resetSupportFormState } from "../../redux/slices/helpsupport/helpSupportSlice";
import "../../assets/styles/helpsupport.scss";
import "../../assets/styles/formcomponent.scss";
import "../../assets/styles/accordioncomponent.scss";
import CustomSelect from "../../components/common/ui/select/CustomSelect";

const HelpSupport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();
  const [countryCodeValue, setCountryCodeValue] = useState('');
  const { data: categoryMaster } = useMasterData("query-category", "user", false);
  const { data: countriesMaster } = useMasterData('countries', '', false, true);
  const successMessage = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const userData = useSelector((state) => state.auth.user);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { submitError, submitSuccess, submitting } = useSelector((state) => state.helpSupport);

  useEffect(() => {
    if (userData) {
      setValue("firstName", userData?.profile?.firstName || "");
      setValue("lastName", userData?.profile?.lastName || "");
      setValue("email", userData?.profile?.username || "");
      setValue("mobileNumber", userData?.profile?.mobileNumber || "");
      // setValue("dialCode", userData?.profile?.dialCode || "");
      reset({
        firstName: userData?.profile?.firstName,
        lastName: userData?.profile?.lastName,
        email: userData?.profile?.username,
        mobileNumber: userData?.profile?.mobileNumber,
        dialCode: userData?.profile?.dialCode,
      })
    }
  }, [userData])
  useEffect(() => {
    if (!userData) {
      reset();
      setCountryCodeValue("+91");
    } else {
      setValue("subject", "");
      setValue("message", "");
      reset({
        subject: "",
        message: "",

      })
    }

    if (isSubmit) {
      window.scrollTo({
        top: successMessage.current?.offsetTop,
        behaviour: "smooth",
      });
    }
  }, [submitSuccess]);

  useEffect(() => {
    return () => {
      dispatch(resetSupportFormState())
    }
  }, [dispatch, navigate])

  const handleSubmitForm = (data) => {
    data.dialCode = countryCodeValue;
    dispatch({ type: 'helpSupportSubmit', payload: data });
    setIsSubmit(true)
  };

  return (
    <div className="helpsupport">
      <AddSeo title="Help & Support : Delhi Transport Stack" description="We're here to help! If you have any questions or need assistance write to us and we would get back to you at the earliest." keywords="Delhi Transport Stack Help Center, Transport Stack User Support, Transport Stack  FAQs, Frequently Asked Questions" />
      <Banner>
        <Breadcrumb />
        <h1 className="heading">Help & Support</h1>
        {isMobile && <div className="heading-background"></div>}
        <div className="heading-content">
          <div ref={successMessage} className="heading-message">
            <p>
              We're here to help! If you have any questions or need assistance,
              please fill out the form below and our team will get back to you
              as soon as possible.
            </p>
          </div>
        </div>
      </Banner>
      <section className="helpsupport__form--section">
        <div className="helpsupport__form--bg">
          <Form className="helpsupport__form formComponent">
            {/* {isSubmit && <> */}
            <p className="success-message my-2"> {submitSuccess}</p>
            <p className="is-invalid-border-only my-2">{submitError}</p>
            {/* </>} */}
            <Row>
              <Col md={6}>
                <FloatingLabel
                  controlId="category"
                  label="Select Category"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Select Category"
                    name="category"
                    disabled={submitting}
                    className={errors.category ? "is-invalid-border-only" : ""}
                    required
                    {...register("category", {
                      required: "Category is required",
                    })}
                  >
                    <option value="">Select</option>
                    {categoryMaster.length > 0 &&
                      categoryMaster.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                  </Form.Select>
                  <span className="is-invalid-border-only">
                    {errors.category && (
                      <span className="is-invalid-border-only">
                        {errors.category.message}
                      </span>
                    )}
                  </span>
                </FloatingLabel>
              </Col>
              {!isMobile && (
                <Col md={6}>
                  <p className="mandate-text">
                    <span className="required">*</span> Mandatory fields
                  </p>
                </Col>
              )}
            </Row>
            <Row>
              <Col md={12}>
                <hr className="dashed-line"></hr>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="First name"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="First name"
                    required
                    maxLength={30}
                    className={errors.firstName ? "is-invalid-border-only" : ""}
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
              <Col md={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Last name"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Last name"
                    // required
                    maxLength={30}
                    className={errors.lastName ? "is-invalid-border-only" : ""}
                    {...register("lastName", {
                      // required: "Last name is required",
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
              <Col md={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    maxLength={320}
                    disabled={submitting}
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
              <Col xs={3} sm={2} md={2} lg={{ span: 2 }}>
                <CustomSelect
                  options={countriesMaster}
                  placeholder="Code"
                  defaultValue={userData?.profile?.dialCode}
                  onSelectChange={(value) => setCountryCodeValue(value)}></CustomSelect>
              </Col>
              <Col xs={9} sm={10} md={4} lg={{ span: 4 }}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Phone number"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Phone number"
                    required
                    maxLength={countryCodeValue === '+91' ? 10 : 15}
                    name="mobileNumber"
                    className={
                      errors.mobileNumber ? "is-invalid-border-only" : ""
                    }
                    disabled={submitting}
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
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Subject"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Subject"
                    required
                    disabled={submitting}
                    // maxLength={60}
                    minLength={20}
                    className={errors.subject ? "is-invalid-border-only" : ""}
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: {
                        value: 20,
                        message: "Subject must be at least 20 characters long",
                      },
                      maxLength: {
                        value: 60,
                        message: "Subject must be no longer than 60 characters",
                      },
                    })}
                  />
                  {errors.subject && (
                    <span className="is-invalid-border-only">
                      {errors.subject.message}
                    </span>
                  )}
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Message"
                  className="mb-3 floating_textarea_label"
                >
                  <Form.Control
                    as="textarea"
                    rows={5}
                    required
                    // maxLength={800}
                    minLength={20}
                    placeholder="Message"
                    disabled={submitting}
                    className={errors.message ? "is-invalid-border-only" : ""}
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 20,
                        message: "Message must be at least 20 characters long",
                      },
                      maxLength: {
                        value: 800,
                        message: "Message must be no longer than 800 characters",
                      },
                    })}
                  />
                  {errors.message && (
                    <span className="is-invalid-border-only">
                      {errors.message.message}
                    </span>
                  )}
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <ButtonComponent
                  type="primaryBlue"
                  className="mb-2 mt-4"
                  onClick={handleSubmit(handleSubmitForm)}
                >
                  Submit
                </ButtonComponent>
              </Col>
            </Row>
          </Form>
        </div>
      </section >
      <section className="helpsupport__accordion--section">
        <h2 className="helpsupport__accordion--heading">FAQ's</h2>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <span className="dot">1</span>{''}
              How can our organization provide data to Transport Stack?
            </Accordion.Header>
            <Accordion.Body>
              <p>
                You can begin by filling out the data contributor form and coordinating with us on the data sharing mechanism. Once this is completed, you can start sharing your data. For further details, please refer to the onboarding of data contributors policy available in the onboarding policies under the resources section.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <span className="dot">2</span>I was charged twice for the dataset
              I purchased. What steps should I take?
            </Accordion.Header>
            <Accordion.Body>
              <p>
                If you notice a double charge for a dataset purchase, please
                report this under the 'Issue' tab in the Help and Support
                section. Include the transaction details, and we will assist you
                in resolving the issue and processing any necessary refunds.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <span className="dot">3</span>What is the typical processing time
              for a data request approval?
            </Accordion.Header>
            <Accordion.Body>
              <p>
                The usual processing time for a data request varies but
                generally takes a few business days. We strive to handle all
                requests as quickly as possible to minimize any delays.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <span className="dot">4</span>Is it possible to subscribe to
              multiple products simultaneously?
            </Accordion.Header>
            <Accordion.Body>
              <p>
                Yes, you can subscribe to multiple products at the same time.
                Our platform supports multiple subscriptions, allowing you to
                access various datasets and services according to your needs.
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </section>
    </div>
  );
};

export default HelpSupport;
