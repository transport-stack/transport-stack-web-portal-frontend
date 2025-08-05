import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import "./WinnerCard.scss";

const WinnerCard = ({ logo, teamName, description }) => {
  return (
    <Card className="winner-card mb-3 p-3 shadow-sm">
      <Row className="align-items-center flex-column flex-sm-row text-center text-sm-start">
        <Col xs={12} sm={2} className="d-flex justify-content-center mb-3 mb-sm-0">
          <img
            src={logo}
            alt={teamName}
            className="img-fluid winner-logo"
          />
        </Col>

        {/* Right Side - Team Name & Description */}
        <Col xs={12} sm={10}>
          <h5 className="fw-bold mb-2">{teamName}</h5>
          <p className=" mb-0">{description}</p>
        </Col>
      </Row>
    </Card>
  );
};

export default WinnerCard;
