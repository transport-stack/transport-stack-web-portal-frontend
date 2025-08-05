import React from "react";
import Image from "react-bootstrap/Image";
import PropTypes from "prop-types";
import UserIcon from "../../assets/images/graphNotificationIcon.png";
import "../../assets/styles/graphNotificationCard.scss";

const GraphNotificationCard = ({ data }) => {
  return (
    <div className="graphNotificationCard d-flex">
      <div className="card_img">
        <Image src={UserIcon} alt="user notification icon" fluid />
      </div>
      <div className="d-flex flex-column">
        <p className="card_name">{data?.name}</p>
        <p className="card_data">{data?.value}</p>
      </div>
    </div>
  );
};

GraphNotificationCard.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
};

export default GraphNotificationCard;
