import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useForm } from "react-hook-form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import PropTypes from "prop-types";
import ButtonComponent from "../../components/common/ui/button/ButtonComponent";
import "../../assets/styles/formcomponent.scss";

const RejectModal = ({ headerMessage, onYesClick, onNoClick, label }) => {
  const [show, setShow] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const handleAction = (data) => {
    let res = { reason: data.reason };
    onYesClick(res);
  };
  const closeModal = () => {
    setShow(false);
  };
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      className="serviceForm reject-modal"
      onHide={() => closeModal()}
      backdrop="static"
    >
      <Modal.Body className="rounded-0 p-5">
        <div className="formComponent">
          <div className="d-flex mb-5 justify-content-start">
            <p className="confirm_message">{headerMessage}</p>
          </div>
          <Form>
            <Row>
              <Col md={12}>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label={label}
                  className="mb-3 floating_textarea_label"
                >
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Reason"
                    // disabled={loader}
                    required
                    name="reason"
                    maxLength={200}
                    className={errors.reason ? "is-invalid-border-only" : ""}
                    {...register("reason", {
                      required: "Reason is required",
                    })}
                  />
                  {errors.reason && (
                    <span className="is-invalid-border-only">
                      {errors.reason.message}
                    </span>
                  )}
                </FloatingLabel>
              </Col>
            </Row>
          </Form>

          <div className="d-flex mt-5 justify-content-end">
            <ButtonComponent
              type="primaryBlue"
              onClick={handleSubmit(handleAction)}
            >
              Submit
            </ButtonComponent>
            <ButtonComponent
              type="primaryWhite"
              onClick={() => {
                onNoClick();
              }}
            >
              Close
            </ButtonComponent>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

RejectModal.propTypes = {
  headerMessage: PropTypes.string.isRequired,
  onNoClick: PropTypes.func.isRequired,
  onYesClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default RejectModal;
