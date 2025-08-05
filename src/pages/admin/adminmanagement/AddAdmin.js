import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useForm } from "react-hook-form";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import { getRoleOptionsAPI, registerAdminAPI, getOrganizationListApi } from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";

const AddAdmin = () => {
  let navigate = useNavigate();
  const [apiErrors, setAPIErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [organizationList, setOrganizationList] = useState([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const fetchRoleOptions = async () => {
      return getRoleOptionsAPI();
    };
    fetchRoleOptions()
      .then((res) => {
        setRoleOptions(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getOrganizationListApi().then((res) => setOrganizationList(res));
    console.log(organizationList);
  }, []);

  const handleOrganizationChange = (e) => {
    const selectedValue = JSON.parse(e.target.value);
    if (selectedValue.name === "Others") {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
      clearErrors("organizationName"); // Clear validation errors for organizationName
      setValue("organizationName", ""); // Reset organizationName field value
    }
    console.log(selectedValue, isOtherSelected);
  };

  const handleAdminSubmit = (data) => {
    setLoader(true);
    setAPIErrors("");

    // Parse the selected organization data
    const selectedOrganization = JSON.parse(data.organizationList);

    // Add both ID and name to the submission payload
    const transformedData = {
      ...data,
      organizationMasterId: selectedOrganization.id,
      organizationName: (selectedOrganization.name !== 'Others') ? selectedOrganization.name : data.organizationName,
    };

    // Remove the unnecessary key
    delete transformedData.organizationList;

    const postRegisterAdmin = async () => {
      return registerAdminAPI(transformedData);
    };

    postRegisterAdmin()
      .then((response) => {
        setLoader(false);
        if (response?.message === "User registered successfully") {
          setApiMessage(response.message);
          setTimeout(() => navigate("/admin/adminmanagement"), 3000);
        } else {
          setAPIErrors(response?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        if (error?.response?.data?.message) {
          setAPIErrors(error.response.data.message);
        } else {
          setAPIErrors(error?.message);
        }
      });
  };

  return (
    <div className="container mb-5">
      <h2 className="form-title">Add New Admin/Data Provider</h2>
      <div className="formComponent">
        <Form autoComplete="off">
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel
                controlId="roleName"
                label="Role"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Role"
                  name="roleName"
                  disabled={loader}
                  required
                  {...register("roleName", {
                    required: "Role is required",
                  })}
                >
                  <option value=''>Select</option>
                  {roleOptions.map((item) => {
                    return (
                      <option key={item.value} value={item.name}>{item.value}</option>
                    )
                  })}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.roleName && (
                    <span className="is-invalid-border-only">
                      {errors.roleName.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="User First name" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="User First name"
                  name="firstName"
                  required
                  disabled={loader}
                  maxLength={30}
                  className={errors.firstName ? "is-invalid-border-only" : ""}
                  {...register("firstName", {
                    required: "User First name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/i,
                      message: "User First name must contain only alphabets",
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
          </Row>
          <Row>
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="User Last name" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="User Last name"
                  name="lastName"
                  disabled={loader}
                  maxLength={30}
                  {...register("lastName", {
                    pattern: {
                      value: /^[A-Za-z\s]+$/i,
                      message: "User Last name must contain only alphabets",
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
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="User Email ID" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="User Email ID"
                  name="email"
                  maxLength={320}
                  disabled={loader}
                  required
                  className={errors.email ? "is-invalid-border-only" : ""}
                  {...register("email", {
                    required: "User Email ID is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "User Email ID is not valid",
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
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel label="User Phone Number" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="User Phone Number"
                  maxLength={10}
                  name="mobileNumber"
                  required
                  className={
                    errors.mobileNumber ? "is-invalid-border-only" : ""
                  }
                  disabled={loader}
                  {...register("mobileNumber", {
                    required: "User Phone Number is required",
                    pattern: {
                      value: /^[6-9]{1}[0-9]{9}$/,
                      message: "User Phone Number is not valid",
                    },
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
            <Col md={12} lg={{ span: 5 }}>
              <FloatingLabel
                  controlId="organizationList"
                  label="Organization"
                  className="mb-3"
              >
                <Form.Select
                    aria-label="Organization"
                    name="organizationList"
                    disabled={loader}
                    required
                    {...register("organizationList", {
                      required: "Organization is required",
                    })}
                    onChange={handleOrganizationChange}
                >
                  <option value=''>Select</option>
                  {organizationList.map((item) => {
                    return (
                        <option key={item.id} value={JSON.stringify({ id: item.id, name: item.name })}>{item.name}</option>
                    )
                  })}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.organizationList && (
                    <span className="is-invalid-border-only">
                      {errors.organizationList.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
          {isOtherSelected && (
            <Row>
              <Col md={12} lg={{ span: 5 }}>
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
          )}
        </Form>
      </div>
      <div className="submit-btn">
        <ButtonComponent
          type="primaryBlue"
          onClick={handleSubmit(handleAdminSubmit)}
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
        <ButtonComponent type="primaryWhite" onClick={() => navigate(-1)}>
          Back
        </ButtonComponent>
      </div>
      <p className="is-invalid-border-only mt-2">{apiErrors}</p>
      <p className="success-message mt-2">{apiMessage}</p>
    </div>
  );
};

export default AddAdmin;
