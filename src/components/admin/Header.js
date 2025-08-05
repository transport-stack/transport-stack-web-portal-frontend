import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "../../assets/styles/header.scss";
import "../../assets/styles/admin.scss";
import NCT_seal from "../../assets/images/NCT_seal.png";
import transportStackLogo from "../../assets/images/ts-logo-updated.png";
import bell from "../../assets/images/bell.png";
import Notifications from "../../assets/images/notifications-svgrepo-com1.png";
import SignOut from "../../assets/images/sign-out-svgrepo-com1.png";

const Header = () => {
  let navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, profile, accessToken } = useSelector((state) => state.auth.admin);
  const { newNotification } = useSelector((state) => state.notifications);
  const [profileName, setProfileName] = useState('');
  const ProfileList = [
    { name: "My Notifications", icon: Notifications, path: "/admin/notifications" },
    { name: "Sign Out", icon: SignOut, path: "/SignOut" },
  ];
  const pathnames = pathname.split('/');
  let defaultTab = '';
  if (pathnames.length > 3) {
    defaultTab = pathnames[pathnames.length - 2];
  } else {
    defaultTab = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
  }
  const headerTabs = {
    "adminmanagement":'Admin Management',
    "usermanagement": "User Management",
    "dataservicemanagement": "Data Sets/ Service Management",
    "requestmanagement": "Request Management",
    "documentmanagement": "Document Management",
    "reportsmanagement": "Reports Management",
    "dashboards": "Reports Management",
    "helpsupport": "Help & Support"
  };

  const handleSignout = () => {
    dispatch({ type: 'auth/adminLogoutRequest', payload: { accessToken: accessToken } })
  }

  useEffect(() => {
    let profileText = '';
    if (profile?.firstName) {
      if (profile?.lastName) {
        profileText = profile?.firstName[0]?.toUpperCase() + profile?.lastName[0]?.toUpperCase();
      } else {
        profileText = profile?.firstName[0]?.toUpperCase() + profile?.firstName[1]?.toUpperCase()
      }
    } else if (profile?.username) {
      profileText = profile?.username[0]?.toUpperCase() + profile?.username[1]?.toUpperCase()
    }
    setProfileName(profileText);
  }, [profile])

  useEffect(() => {
    if(profile?.id){
      const data = {
        id: profile?.id,
        accessToken:accessToken
      };
      dispatch({ type: "checkNewNotificationStatus", payload: data });
    }
  }, [location]);

  return (
    <header className="header-content admin-content">
      <div className="d-flex align-items-center">
        <span className='header_logos d-flex'>
            <img src={NCT_seal} className="NCT_seal img" alt="NCT seal logo" />
            <NavLink to="usermanagement" >
              <img src={transportStackLogo} className="transportStackLogo img" alt="transport Stack logo" />
          </NavLink>
        </span>
        <h1 className="adminHeading">{headerTabs[defaultTab]}</h1>
      </div>
      {isAuthenticated ? <div className="d-flex align-items-center">
        <div className="ps-3 userName-header">
          <div className="d-flex float-right align-items-center">
            {newNotification ? <span className="bell-indicator"></span> : ''}
            <span
              className="d-flex align-items-center justify-content-center pe-3"
              id="bell-container"
              onClick={() => {
                navigate("notifications");
            }}
            >
              <img
                src={bell}
                className="bell-icon cursor-pointer"
                alt="notification bell icon"
              />
            </span>
            <DropdownButton title={profileName || 'AA'} className="user-drop">
              {ProfileList.map((item, index) => {
                return (
                  item.name.toLowerCase() === 'sign out' ?
                    (<Dropdown.Item key={item.name} onClick={() => handleSignout()}> <img src={item.icon} alt={item.name} /> <span>{item.name}</span> </Dropdown.Item>) :
                    (<Dropdown.Item key={item.name}>
                      <NavLink to={item.path}>
                        <img src={item.icon} alt={item.name} />
                        {item.name}
                      </NavLink>
                    </Dropdown.Item>)
                );
              })}
            </DropdownButton>
          </div>
        </div>
      </div> : null}

    </header>
  );
};

export default Header;
