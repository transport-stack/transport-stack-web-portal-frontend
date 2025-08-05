import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import RejectModal from "../../../components/admin/RejectModal";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import { deactivateUserAPI, viewUserAPI, deleteUserAPI, activateUserAPI } from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import DeleteIcon from "../../../assets/images/delete-icon.png";
import DeactivateIcon from "../../../assets/images/deactivate.svg";

const ViewUser = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [detailsUser, setDetailsUser] = useState([]);
  const [apiErrors, setAPIErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const { id: adminID } = useSelector((state) => state.auth.admin.profile);
  const [userStatus, setUserStatus] = useState();

  useEffect(() => {
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
          setDetailsUser(response)
          setUserStatus(response.userStatus)
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
    window.scrollTo(0, 0);
  }, [id]);

  const deleteUser = (e) => {
    let userData = {
      userId: id,
      reason: e.reason,
      adminId: adminID,
    };
    const deleteUserPost = async () => {
      return deleteUserAPI("user", userData);
    };
    deleteUserPost()
      .then((response) => {
        if (response?.message === "User deleted successfully") {
          setShowDeleteModal(false);
          navigate("/admin/usermanagement")
        }
      })
      .catch((error) => {
        setShowDeleteModal(false);
        if (error?.response?.data?.message) {
          setAPIErrors(error?.response.data.message);
        } else {
          setAPIErrors(error?.message);
        }
      });
  };

  const deactivateUser = (e) => {
    setLoader(true);
    let userData = {
      userId: id,
      reason: e.reason,
      adminId: adminID,
    };
    const deactivateUser = async () => {
      return deactivateUserAPI(userData);
    };
    deactivateUser()
      .then((response) => {
        if (response?.message === "User deactivated successfully") {
          setLoader(false);
          navigate("/admin/usermanagement")
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setAPIErrors(error?.response.data.message);
        } else {
          setAPIErrors(error?.message);
        }
      });
  };

  const activateUser = (e) => {
    let userData = {
      userId: id,
      reason: e.reason,
      adminId: adminID,
    };
    const activateUserPost = async () => {
      return activateUserAPI(userData);
    };
    activateUserPost()
      .then((response) => {
        if (response?.message === "User reactivated successfully") {
          setShowDeactivateModal(false);
          navigate("/admin/usermanagement")
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setAPIErrors(error?.response.data.message);
        } else {
          setAPIErrors(error?.message);
        }
      });
  };

  const handleDelete = (data) => {
    setShowDeleteModal(true);

  };

  const handleDeactivate = (data) => {
    setShowDeactivateModal(true);

  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const hideDeactivateModal = () => {
    setShowDeactivateModal(false);
  };

  const handleUserAction = (formData, label) => {
    if (userStatus === "APPROVED") {
      deactivateUser(formData);
    }
    if (userStatus === "DEACTIVATED") {
      activateUser(formData);
    }
  };

  return (
    <>
      {showDeleteModal && (
        <RejectModal
          headerMessage="Delete user"
          onNoClick={hideDeleteModal}
          onYesClick={deleteUser}
          label='Reason for Deleting the User?'
        />

      )}
      {showDeactivateModal && (
        <RejectModal
          headerMessage={userStatus === "APPROVED" ? "Deactivate user" : "Activate user"}
          onNoClick={hideDeactivateModal}
          onYesClick={handleUserAction}
          label={userStatus === "APPROVED" ? "Reason for Deactivating the User?" : 'Reason for Activating the User?'}
        />
      )}
      <div className="container mb-5">
        <Row className="mb-4">
          <Col md={6}>
            <h2 className="form-title">View User</h2>
          </Col>
          <Col md={6} className="text-end">
            <ButtonComponent
              type="primaryWhite"
              className="button-icon"
              onClick={() => handleDelete()}
            >
              <img src={DeleteIcon} alt="delete" />{''}
              Delete
            </ButtonComponent>
            <ButtonComponent
              type="primaryWhite"
              className="button-icon"
              onClick={() => handleDeactivate()}
            >
              <img src={DeactivateIcon} alt="deactivate" />
              {userStatus === "APPROVED" ? "Deactivate" : "Activate"}
            </ButtonComponent>
          </Col>
        </Row>
        <div className="formComponent">
          <Form autoComplete="off">
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="User Id" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="User Id"
                    name="sequenceId"
                    disabled
                    maxLength={30}
                    value={detailsUser.sequenceId}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="First name" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="First name"
                    name="firstName"
                    disabled
                    maxLength={30}
                    value={detailsUser.firstName}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="Last name" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Last name"
                    name="lastName"
                    disabled
                    maxLength={30}
                    value={detailsUser.lastName}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="Dial Code" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Dial Code"
                    maxLength={10}
                    name="mobileNumber"
                    disabled
                    value={detailsUser.dialCode}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="Mobile Number" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Mobile number"
                    maxLength={10}
                    name="mobileNumber"
                    disabled
                    value={detailsUser.mobileNumber}
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
                    disabled
                    maxLength={60}
                    value={detailsUser.organizationName}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="Type of organization" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Type of organization"
                    name="organizationType"
                    disabled
                    value={detailsUser.organizationTypeName}
                  />
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
                    disabled
                    value={detailsUser.address}
                  />
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
                    disabled
                    value={detailsUser.country}
                  >
                    <option value=''>Select</option>
                    <option value="India">India</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel
                  controlId="floatingSelect"
                  label="State"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Floating label select State"
                    name="state"
                    disabled
                    value={detailsUser.state}
                  >
                    <option>Select</option>
                    <option value="AndhraPradesh">Andhra Pradesh</option>
                    <option value="AndamanandNicobarIslands">
                      Andaman and Nicobar Islands
                    </option>
                    <option value="ArunachalPradesh">Arunachal Pradesh</option>
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
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="Pincode" className="mb-3">
                  <Form.Control
                    type="text"
                    maxLength={6}
                    placeholder="Pincode"
                    name="pincode"
                    disabled
                    value={detailsUser.pinCode}
                  />
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
                    maxLength={320}
                    disabled
                    value={detailsUser.email}
                  />
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
                    disabled
                    name="profileDescription"
                    maxLength={200}
                    value={detailsUser.profileDescription}
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="submit-btn">
          <ButtonComponent type="primaryWhite" onClick={() => navigate(-1)}>
            Back
          </ButtonComponent>
        </div>
        <p className="is-invalid-border-only mt-2">{apiErrors}</p>
      </div>
    </>
  );
};

export default ViewUser;
