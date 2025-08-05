import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Profile from "../../assets/images/profile-svgrepo-com1.png";
import Subscriptions from "../../assets/images/magazines-svgrepo-com1.png";
import Requests from "../../assets/images/cloud-sun-svgrepo-com1.png";
import Notifications from "../../assets/images/notifications-svgrepo-com1.png";
import Settings from "../../assets/images/Page-11.png";
import SignOut from "../../assets/images/sign-out-svgrepo-com1.png";
import { useDispatch, useSelector } from "react-redux";

const ProfileMenu = (props) => {
  const { accessToken } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { setProfileMenu } = props;
  const [show, setShow] = useState(true);
  function handleShow() {
    setShow(false);
    setProfileMenu(false);
  }
  const handleSignout = () => {
    setShow(false);
    setProfileMenu(false);
    dispatch({ type: 'auth/userLogoutRequest', payload: { accessToken: accessToken } })
  }

  const ProfileList = [
    { name: "My Profile", icon: Profile, path: "/account/myprofile" },
    { name: "My Subscriptions", icon: Subscriptions, path: "/account/mysubscriptions" },
    { name: "My Requests", icon: Requests, path: "/account/myrequests" },
    { name: "My Notifications", icon: Notifications, path: "/account/mynotifications" },
    { name: "Settings", icon: Settings, path: "/account/settings" },
    { name: "Sign Out", icon: SignOut, path: "/" },
  ];
  return (
    <div>
      <Modal
        className="profileMenu"
        show={show}
        fullscreen={true}
        onHide={() => setShow(false)}
        backdrop="static"
      >
        <Modal.Header>
          <span className="close-icon" onClick={() => handleShow()}>
            ×
          </span>
        </Modal.Header>
        <Modal.Body>
          <header className="d-flex profile-menu items-center flex-start">
            <nav className="HeaderNav">
              <ul className="list-none d-inline-flex flex-column list-unstyled">
                {ProfileList.map((item, index) => {
                  return (
                    <li key={item.name}>
                      {item.name === "Sign Out" ? (
                        <NavLink
                          onClick={handleSignout}
                        >
                          <img src={item.icon} alt={item.name} />
                          {item.name}
                        </NavLink>

                      ) : (
                        <NavLink
                          to={item.path}
                          onClick={() => handleShow()}
                        >
                          <img src={item.icon} alt={item.name} />
                          {item.name}
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </header>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfileMenu;
