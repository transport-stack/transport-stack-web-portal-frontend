import Modal from "react-bootstrap/Modal";
import ButtonComponent from "../../components/common/ui/button/ButtonComponent";
import { useState } from "react";
import PropTypes from "prop-types";
import "../../assets/styles/modal.scss";

const ConfirmModal = ({
  action,
  category,
  onNoClick,
  onYesClick,
  showError = false,
  errorMessage,
  confirmModal,
}) => {
  const [show, setShow] = useState(true);
  const closeModal = () => {
    setShow(false);
    confirmModal(false);
  };
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      className="serviceForm confirm-modal"
      onHide={() => closeModal()}
      backdrop="static"
    >
      <Modal.Body className="p-5">
        <div className="d-flex justify-content-center">
          <p className="confirm_message">
            Are you sure you want to {action} the {category}?
          </p>
        </div>
        <div className="d-flex justify-content-center mt-5">
          <ButtonComponent
            type="primaryBlue"
            onClick={() => {
              onYesClick();
            }}
          >
            Yes
          </ButtonComponent>
          <ButtonComponent
            type="primaryWhite"
            onClick={() => {
              onNoClick();
            }}
          >
            No
          </ButtonComponent>
        </div>
        {showError && (
          <p className="is-invalid-border-only mt-2 d-flex align-items-center justify-content-center">
            {errorMessage}
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
};
ConfirmModal.propTypes = {
  action: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onNoClick: PropTypes.func.isRequired,
  onYesClick: PropTypes.func.isRequired,
  showError: PropTypes.bool,
  errorMessage: PropTypes.string,
  confirmModal: PropTypes.func,
};
export default ConfirmModal;
