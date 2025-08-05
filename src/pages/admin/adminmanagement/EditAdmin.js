import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {getOrganizationListApi, updateAdminAPI, viewAdminAPI} from "../../../services/apiservices";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import "../../../assets/styles/formcomponent.scss";

const EditAdmin = () => {
  let navigate = useNavigate();
  const [apiErrors, setAPIErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [organizationList, setOrganizationList] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState({});
  const [adminUserData, setAdminUserData] = useState({});
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    let data = {
      userId: id,
    };

    const viewAdmin = async () => {
      return viewAdminAPI(data);
    };

    viewAdmin()
      .then((response) => {
        if (response) {
          setAdminUserData(response);
          setValue("roleName", response.roles?.[0]);
          setValue("firstName", response.firstName);
          setValue("lastName", response.lastName);
          setValue("email", response.email);
          setValue("mobileNumber", response.mobileNumber);
        } else {
          setAPIErrors(response?.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setAPIErrors(error.response.data.message);
        } else {
          setAPIErrors(error?.message);
        }
      });
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    getOrganizationListApi().then((res) => setOrganizationList(res));
  }, []);

  useEffect(() => {
    if (organizationList && organizationList.length > 0 && adminUserData && Object.keys(adminUserData).length > 0) {
      const organization = organizationList.find((org) => org.name === adminUserData.organizationName);

      if (organization !== undefined && organization !== null) {
        setSelectedOrganization(organization);
        setValue("organizationList", adminUserData.organizationName);
      } else {
        setSelectedOrganization(organizationList.find((org) => org.name === 'Others'));
        setValue("organizationList", "Others");
        setValue("organizationName", adminUserData.organizationName);
      }

    }
  }, [organizationList, adminUserData])

  const handleOrganizationChange = (e) => {
    const selectedOrg = organizationList.find((org) => org.name === e.target.value);
    setSelectedOrganization(selectedOrg || {});

    console.log("selectedOrg ", selectedOrg);
    if (selectedOrg?.name !== "Others") {
      setValue("organizationName", selectedOrg?.name || "");
    } else {
      // setValue("organizationName", adminUserData.organizationName);
      setValue("organizationName", "");
    }
  };

  const handleAdminSubmit = (data) => {
    setLoader(true);
    setAPIErrors("");

    const updatedData = {
      userId: id,
      mobileNumber: data.mobileNumber,
      organizationMasterId: selectedOrganization.id || null,
      organizationName:
          selectedOrganization.name === "Others"
              ? data.organizationName
              : selectedOrganization.name,
      roleName: data.roleName,
    }

    const postUpdateAdmin = async () => {
      return updateAdminAPI(updatedData);
    };

    postUpdateAdmin()
      .then((response) => {
        setLoader(false);
        if (response?.message === "User details updated successfully") {
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
      <h2 className="form-title">Modify Admin/Data Provider</h2>
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
                  required
                  {...register("roleName", {
                    required: "Role is required",
                  })}
                >
                  <option value=''>Select</option>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_DATA_PROVIDER">Data Provider</option>
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
                  disabled
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
                  disabled
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
                  disabled
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
                  <option value="">Select</option>
                  {organizationList.map((org) => (
                      <option key={org.id} value={org.name}>
                        {org.name}
                      </option>
                  ))}
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
          {selectedOrganization.name === "Others" && (
              <Row>
                <Col md={12} lg={{span: 5}}>
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
                            message:
                                "Organization name must contain at least one letter and can include letters, numbers, spaces, and special characters (-&').",
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

export default EditAdmin;
