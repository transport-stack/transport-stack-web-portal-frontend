import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import ButtonComponent from "../common/ui/button/ButtonComponent";

const HamburgerMenu = (props) => {
  const { setShowHamburgerMenu } = props;
  const { isAuthenticated } = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const menuList = [
    { name: "Home", path: "/" },
    { name: "About us", path: "/aboutus" },
    { name: "Data & Services", path: "/data-services" },
    // { name: "How to Join", path: "/howtojoin" },
    { name: "Resources", path: "/resources" },
    { name: "Innovation Challenge", path: "/innovationchallenge" },
    { name: "Media", path: "/media" },
    { name: "Help & Support", path: "/help-support" },
  ];

  function handleShow() {
    setShow(false);
    setShowHamburgerMenu(false);
  }

  return (
    <Modal
      className="hamburgerMenu"
      show={show}
      fullscreen={true}
      onHide={() => setShow(false)}
      backdrop="static"
    >
      <Modal.Header>
        <span className="close-icon" onClick={handleShow}>
          ×
        </span>
      </Modal.Header>
      <Modal.Body>
        <header>
          <nav className="HeaderNav">
            <ul className="list-none d-inline-flex flex-column list-unstyled">
              {menuList.map((item) => {
                return (
                  <li key={item.name} className="p-3">
                    <NavLink to={item.path} onClick={() => handleShow()}>
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
          {!isAuthenticated ? (
            <div className="d-flex px-3 pt-1 register-btn">
              <ButtonComponent
                type="primaryBlue"
                onClick={() => {
                  navigate("signin");
                }}
              >
                Signin
              </ButtonComponent>
              <ButtonComponent
                type="primaryWhite"
                onClick={() => {
                  navigate("register");
                }}
              >
                Register
              </ButtonComponent>
            </div>
          ) : null}
        </header>
      </Modal.Body>
    </Modal>
  );
};
export default HamburgerMenu;
