import React from "react";
import Card from "react-bootstrap/Card";
import video_load_icon from "../../assets/images/video_load_icon.png";
import duration_icon from "../../assets/images/duration_icon.png";

const MediaVideoCard = ({ data, onClick }) => {
  return (
    <Card className="videos__card cursor-pointer">
      <Card.Img variant="top" alt={data.name} src={data.backgroundImage} />
      <div
        className="d-flex justify-content-center align-items-center video_load"
        onClick={onClick}
      >
        <Card.Img
          className="video_load_icon"
          alt="video load icon"
          src={video_load_icon}
        />
      </div>
      <Card.Body>
        <Card.Title title={data.name}>
          {data.name}
        </Card.Title>
        <div className="card-text">
          <p>{data.date}</p>
          <img
            src={duration_icon}
            alt="duration icon"
            className="duration_icon me-2"
          />
          {data.duration}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MediaVideoCard;
