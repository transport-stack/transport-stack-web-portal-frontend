import React from "react";
import Accordion from "react-bootstrap/Accordion";
import { useNavigate } from "react-router-dom";
import AddSeo from "../../utils/AddSeo";
import BannerTitle from "../../components/user/ui/BannerTitle/BannerTitle";
import Breadcrumb from "../../components/user/ui/Breadcrumb/Breadcrumb";
import "../../assets/styles/howToJoin.scss";
import "../../assets/styles/accordioncomponent.scss";

const HowToJoin = () => {
  let navigate = useNavigate();
  
  const onClickPolicy = (policyKey) => {
    localStorage.setItem("policyKey", policyKey);
    navigate("../resources/boardingpolicy");
  };

  return (
    <div>
      <AddSeo title=" How to Join :  Delhi Transport Stack" description="Join the Delhi Transport Stack  for seamless data access and API integration create innovative mobility solutions." keywords="Delhi Transport Stack Membership, Transport Stack API Access, Delhi Transport Data Integration, Mobility Solutions Development, Public Transport Innovation Partner, Smart City Collaboration"/>
      <div className="join-header">
        <div className="join-breadcrumb section-container">
          <Breadcrumb />
          <BannerTitle title="How to join"></BannerTitle>
        </div>
      </div>
      <div className="join-banner section-container">
        <div className="join-banner__title">
          <h2>Join us to be a part of transforming how Delhi commutes</h2>
        </div>
        <div className="join-banner__role-label">
          <h3>Select your role</h3>
        </div>
        <Accordion className="d-flex">
          <Accordion.Item eventKey="0">
            <Accordion.Header>For data users</Accordion.Header>
            <Accordion.Body>
              <p className="accordion-body__title">
                In case you are a data user
              </p>
              <ol>
                <li>
                Create your user profile and explore our data and services catalog
                </li>
                <li>Browse and select the dataset or service that meets your needs</li>
                <li>Complete and submit the data/ service request form</li>
                <li>
                After submission, your request will either be auto-approved or reviewed by us, depending on the dataset/ service type
                </li>
                <li>
                Once approved, proceed with any required payments (if applicable)
                </li>
                <li>Download your dataset/service, or receive your API keys</li>
              </ol>
              <button
                onClick={() => onClickPolicy("item0")}
                className="accordion-body__link cursor-pointer has-link"
              >
                Onboarding policy for data user
              </button>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>For data providers</Accordion.Header>
            <Accordion.Body>
              <p className="accordion-body__title">
                In case you are a data provider
              </p>
              <ol>
                <li>Reach out to us and complete the data contributor form</li>
                <li>Align on the data exchange mechanism</li>
                <li>
                Assist with system integration to seamlessly share your data
                </li>
              </ol>
              <button
                onClick={() => onClickPolicy("item1")}
                className="accordion-body__link cursor-pointer has-link"
              >
                Onboarding policy for data provider
              </button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

export default HowToJoin;
