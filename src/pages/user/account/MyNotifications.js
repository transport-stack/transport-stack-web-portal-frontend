import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Pagination from "../../../components/common/ui/pagination/Pagination";
import NotificationCard from "../../../components/user/NotificationCard";
import "../../../assets/styles/accountNotifications.scss";

const MyNotifications = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const listcontent = useRef(null);
  const [adminUser] = useState(location.pathname.includes("admin"));
  const userProfile = useSelector((state) => 
    adminUser ? state.auth.admin : state.auth.user
  );
  const { profile: { id }, accessToken } = userProfile;
  const {
    notifications: notificationList,
    error,
    message,
    switchStatus,
  } = useSelector((state) => state.notifications);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if(switchStatus) getNotificationList()
    window.scrollTo({
      top: listcontent.current.offsetTop-300,
      behaviour: "smooth",
    });
  }, [dispatch, currentPage]);

  useEffect(() => {
    const data = {
      id: id,
      accessToken: accessToken,
    };
    dispatch({ type: "fetchNotificationSwitchStatus", payload: data });
  }, []);

  useEffect(() => {
    if(switchStatus){
      notificationList?.content?.forEach(element => {
        if(!element.read){
          const data = {
            notificationId: element.id,
            accessToken: accessToken,
          };
          dispatch({ type: "readNotificationRequest", payload: data });
        }
      });
    }
    
  }, [notificationList,switchStatus]);

  const handleDeleteClick = (NotificationId) => {
    const data = {
      id: id,
      NotificationId: NotificationId,
      accessToken: accessToken,
      page: currentPage - 1,
      size: 10,
    };
    dispatch({ type: "deleteNotificationRequest", payload: data });
  };

  const checkNewNotification = () => {
    if(id){
      const data = {
        id: id,
        accessToken:accessToken
      };
      dispatch({ type: "checkNewNotificationStatus", payload: data });
    }
  }

  const getNotificationList = () => {
    const data = {
      id: id,
      accessToken: accessToken,
      page: currentPage - 1,
      size: 10,
    };
    dispatch({ type: "fetchNotificationRequest", payload: data });
  }

  const changeSwitchStatus = () => {
    const data = {
      id: id,
      accessToken: accessToken,
      switchState: !switchStatus,
    };
    dispatch({ type: "changeNotificationSwitchStatus", payload: data });
    checkNewNotification()
    if(!switchStatus)getNotificationList()
  };

  return (
    <div className="container notifications" ref={listcontent}>
      <div className="notifications_header d-flex mb-5">
        <h1 className="notifications_title">My Notifications</h1>
        <ButtonComponent type="primaryBlue notifications_btn">
          Notifications On
          <label className="switch">
            <input
              type="checkbox"
              checked={switchStatus}
              onChange={() => changeSwitchStatus()}
            />
            <span className="slider round"></span>
          </label>
        </ButtonComponent>
      </div>
      {message && <p className="success-message mt-2">{message}</p>}
      {error && <p className="is-invalid-border-only mt-2">{error}</p>}
      {switchStatus ? (
        <div className="mb-5">
          {Array.isArray(notificationList?.content) &&
            notificationList?.content?.map((item, index) => {
              return (
                <div key={item.id} className="">
                  <span
                    // onClick={() => handleReadClick(item.id)}
                  >
                    <NotificationCard
                      data={item}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event from bubbling up to the span
                        handleDeleteClick(item.id);
                      }}
                    ></NotificationCard>
                  </span>
                </div>
              );
            })}
          {(!Array.isArray(notificationList?.content) ||
            notificationList?.content?.length === 0) && <p>No data available</p>}
          {notificationList?.totalPages > 1 ? (
            <Pagination
              totalPages={notificationList.totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default MyNotifications;
