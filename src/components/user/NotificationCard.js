import React from "react";
import approvedIcon from "../../assets/images/approved.png";
import warningIcon from "../../assets/images/warning.png";
import deleteIcon from "../../assets/images/delete.png";

const NotificationCard = ({ data, onClick }) => {
  return (
    <div className="notifications_card">
      <span className="d-flex justify-content-between">
        <span className="d-flex align-items-center">
          <img src={(data?.status?.includes("UNSUCCESSFUL") || data?.status?.includes("EXPIRING")) ? warningIcon : approvedIcon} className="card_img" alt="notification status" />
          <span>
            <h2 className="card_title">{data?.status}</h2>
            <p className="mb-0 card_description">{data?.message}</p>
          </span>
        </span>
        <div className="d-flex justify-content-end align-items-center">
          <span className="d-flex justify-content-center card_actions">
            {!data?.read ? <span className="new"></span> : data?.creationDate}
          </span>
          <img
            src={deleteIcon}
            className="delete_icon"
            alt="delete icon"
            onClick={onClick}
          />
        </div>
      </span>
    </div>
  );
};

export default NotificationCard;
