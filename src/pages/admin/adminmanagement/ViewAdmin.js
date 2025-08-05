import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import RejectModal from "../../../components/admin/RejectModal";
import { viewAdminAPI, deleteUserAPI } from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import DeleteIcon from "../../../assets/images/delete-row.svg";
import EditIcon from "../../../assets/images/edit-icon.png";

const ViewUser = () => {
  let navigate = useNavigate();
  const [detailsUser, setDetailsUser] = useState([]);
  const [apiErrors, setAPIErrors] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const { id: adminID } = useSelector((state) => state.auth.admin.profile);

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
          setDetailsUser(response);
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

  const deleteUser = (e) => {
    let userData = {
      userId: id,
      reason: e.reason,
      adminId: adminID,
    };
    const deleteUserPost = async () => {
      return deleteUserAPI("super-admin", userData);
    };
    deleteUserPost()
      .then((response) => {
        if (response?.message === "User deleted successfully") {
          setShowDeleteModal(false);
          navigate(-1)
        }
      })
      .catch((error) => {
        setShowDeleteModal(false);
        setAPIErrors(error?.message);
      });
  };

  const handleDelete = (data) => {
    setShowDeleteModal(true);
  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    navigate("/admin/adminmanagement/editadmin/" + id)
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
      <div className="container mb-5">
        <Row className="mb-4">
          <Col md={6}>
            <h2 className="form-title">View Admin/Data Provider</h2>
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
              onClick={() => handleEdit()}
            >
              <img src={EditIcon} alt="edit" />{''}
              Modify
            </ButtonComponent>
          </Col>
        </Row>
        <div className="formComponent">
          <Form autoComplete="off">
          <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="Admin Id" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Admin Id"
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
                <FloatingLabel
                  controlId="roleName"
                  label="Role"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Role"
                    name="roleName"
                    disabled
                    value={detailsUser.roles?.[0]}
                  >
                    <option value=''>Select</option>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_DATA_PROVIDER">Data Provider</option>
                  </Form.Select>
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
                    disabled
                    maxLength={30}
                    value={detailsUser.firstName}
                  />
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
                    value={detailsUser.lastName}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={{ span: 5 }}>
                <FloatingLabel label="User EmailID" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="User EmailID"
                    name="email"
                    maxLength={320}
                    disabled
                    value={detailsUser.email}
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
