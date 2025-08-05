import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import article_img from "../../assets/images/article_img.png";

const MediaArticleCard = ({ data, onClick }) => {
  return (
    <Card className="articles__card cursor-pointer" onClick={onClick}>
      <Card.Img variant="top" alt={data.name} src={article_img} />
      <Card.Body>
        <Card.Title className="fw-bold" title={data.name}>
          {data.name}
        </Card.Title>
        <Card.Text>{data.date}</Card.Text>
        <p className="read_more">Read more</p>
      </Card.Body>
    </Card>
  );
};

export default MediaArticleCard;
