import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";

const SignInModal = ({label, setShowSignInModal}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  let navigate = useNavigate();

  const closeModal = () => {
    setShow(false)
    setShowSignInModal(false);
  }

  const onClickSignIn=()=>{
    let data={
      status:true,
      path:location.pathname
    }
    dispatch({ type: 'verify/userDataServiceLoginRequest', payload: data });
    navigate("/signin");
  }
  
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      className="serviceForm"
      onHide={() => closeModal()}
    >
      <Modal.Body
        style={{ padding: "3rem", borderRadius: 0 }}
        className="rounded-0"
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p style={{ font: "normal normal normal 24px/24px Roboto-Regular" }}>
            Interested in accessing the {label} product? Please sign in or register
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <ButtonComponent
            type="primaryBlue"
            onClick={() => {
              onClickSignIn()
            }}
          >
            Sign in
          </ButtonComponent>
          <ButtonComponent
            type="primaryWhite"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </ButtonComponent>
        </div>
      </Modal.Body>
    </Modal>
  );
};
SignInModal.propTypes = {
  label: PropTypes.string,
  setShowSignInModal: PropTypes.func,
};
export default SignInModal;