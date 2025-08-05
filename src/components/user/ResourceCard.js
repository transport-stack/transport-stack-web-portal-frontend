import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import "../../assets/styles/resourceCard.scss";
import ButtonComponent from "../common/ui/button/ButtonComponent";

const ResourceCard = (data) => {
  function getResourceName(title) {
    if (title === "User Support") navigate("usersupport");
    else if (title === "Marketing Resources") navigate("marketingresource");
    else if (title === "Onboarding Policies") navigate("boardingpolicy");
    else if (title === "Technical Resources") navigate("techresource");
    else if (title === "Miscellaneous") navigate("../resources");
  }

  let navigate = useNavigate();
  let cardDetails = data.data;
  return (
    <div className="col-md-6 col-lg-6 m-0 resource-card">
      <Card className="cursor-pointer">
        <Card.Img className="card-img" variant="top" src={cardDetails?.img} />
        <Card.Body className="pb-0 px-0">
          <Card.Title className="fw-bold" title={cardDetails.title}>
            {cardDetails.title}
          </Card.Title>
          <Card.Text>{cardDetails.description}</Card.Text>
          <ButtonComponent type='primaryBlue' onClick={() => getResourceName(cardDetails.title)} className='mb-0 me-0'> Read more</ButtonComponent>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResourceCard;
