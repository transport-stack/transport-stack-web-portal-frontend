import React, { Suspense, useState } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { useSelector, useDispatch } from "react-redux";
import Image from "react-bootstrap/Image";
import Footer from "../../../components/user/Footer";
import Header from "../../../components/user/Header";
import Loader from "../../../layouts/Loader";
import "../../../assets/styles/accountLayout.scss";
import profileInactive from "../../../assets/images/profile-svgrepo-com1.png";
import SubscriptionsInactive from "../../../assets/images/magazines-svgrepo-com1.png";
import RequestsInactive from "../../../assets/images/cloud-sun-svgrepo-com1.png";
import NotificationsInactive from "../../../assets/images/notifications-svgrepo-com1.png";
import SettingsInactive from "../../../assets/images/Page-11.png";
import profileActive from "../../../assets/images/profile_white.png";
import SubscriptionsActive from "../../../assets/images/magazines-_white.png";
import RequestsActive from "../../../assets/images/cloud_white.png";
import NotificationsActive from "../../../assets/images/notifications_white.png";
import SettingsActive from "../../../assets/images/setting_white.png";

const Account = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const defaultTab = pathname.slice(
    pathname.lastIndexOf("/") + 1,
    pathname.length
  );
  const userData = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const headerTabs = [
    {
      name: "My Profile",
      key: "myprofile",
      iconInactive: profileInactive,
      iconActive: profileActive,
    },
    {
      name: "My Subscriptions",
      key: "mysubscriptions",
      iconInactive: SubscriptionsInactive,
      iconActive: SubscriptionsActive,
    },
    {
      name: "My Requests",
      key: "myrequests",
      iconInactive: RequestsInactive,
      iconActive: RequestsActive,
    },
    {
      name: "My Notifications",
      key: "mynotifications",
      iconInactive: NotificationsInactive,
      iconActive: NotificationsActive,
    },
    {
      name: "Settings",
      key: "settings",
      iconInactive: SettingsInactive,
      iconActive: SettingsActive,
    },
  ];
  const [defaultKey, setDefaultKey] = useState(defaultTab);
  
  const onSelectTab = (tabName) => {
    setDefaultKey(tabName);
    navigate("./" + tabName);
    const data = {
      id: userData.profile?.id,
      accessToken:userData.accessToken
    };
    dispatch({ type: "checkNewNotificationStatus", payload: data });
  };


  return (
    <div className="account">
      <Header />
      <main className="Main">
        <Suspense fallback={<Loader />}>
          <ScrollRestoration />
          <div className="container">
            <Nav
              variant="pills"
              activeKey={defaultTab}
              className="mainProfile-tabs"
            >
              {/* <div className="container d-flex"> */}
              {headerTabs.map((item, index) => {
                return (
                  <Nav.Item key={item.key}>
                    <Nav.Link
                      eventKey={item.key}
                      onClick={() => onSelectTab(item.key)}
                    >
                      <div className="d-flex align-items-center">
                        {defaultKey !== item.key ? (
                          <Image
                            src={item.iconInactive}
                            alt={item.name}
                            fluid
                          />
                        ) : (
                          <Image
                            src={item.iconActive}
                            alt={item.name}
                            fluid
                          />
                        )}
                        <p className="nav-link_name">{item.name}</p>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </div>
          <div className="mt-3 mb-3">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
