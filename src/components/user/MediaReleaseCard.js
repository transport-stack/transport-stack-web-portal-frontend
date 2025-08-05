import React from "react";
import Card from "react-bootstrap/Card";

const MediaReleaseCard = ({ data, onClick }) => {
  return (
    <Card className="release__card" onClick={onClick}>
      <Card.Img variant="top" alt={data.name} src={data.backgroundImage} />
      <Card.Body>
        <Card.Title className="fw-bold" title={data.name}>
          {data.name}
        </Card.Title>
        <Card.Text>{data.date}</Card.Text>
        <a
          href={data?.link ? data?.link : "/"}
          className="read_more"
          target="_blank"
        >
          Read more
        </a>
      </Card.Body>
    </Card>
  );
};

export default MediaReleaseCard;
