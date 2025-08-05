import React from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import MobileVerification from "../authentication/MobileVerification";
import "../../../assets/styles/forgotPassword.scss";
import "../../../assets/styles/style.scss";
import "../../../assets/styles/formcomponent.scss";

const MyProfileMobileVerification = ({onClose}) => {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
      className="serviceForm"
      onHide={() => onClose()}
    >
  <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>
      <Modal.Body
        style={{ padding: "3rem", borderRadius: 0 }}
        className="rounded-0"
      >
        <MobileVerification onClose={onClose}/>
      </Modal.Body>
    </Modal>
  );
};

MyProfileMobileVerification.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MyProfileMobileVerification;
