import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import Breadcrumb from "../../../components/user/ui/Breadcrumb/Breadcrumb";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import useCheckMobileScreen from "../../../hooks/useCheckMobileScreen";
import { downloadResource } from "../../../utils/Helper";
import "../../../assets/styles/ResourceDetails.scss";
import arrow from "../../../assets/images/left-arrow.png";
import PdfViewer from "../../../components/common/ui/pdfviewer/PdfViewer";
import AddSeo from "../../../utils/AddSeo";

function BoardingPolicy() {
  let navigate = useNavigate();
  const mobileScreenSize = useCheckMobileScreen();
  const [policyKey] = useState(
    localStorage.getItem("policyKey")
      ? localStorage.getItem("policyKey")
      : "item0"
  );
  let selectedResourceDetails = {
    title: "Onboarding Policies",
    img: "../resource/resource-img-2.png",
    tabNames: ["Onboarding of data users", "Onboarding of data contributors"],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = (category, subcategory, title) => {
    downloadResource(category, subcategory, title);
  };

  return (
    <div className="resource-details">
      <AddSeo title="Boarding Policy Resources : Delhi Transport Stack" description="Review our onboarding policies for data users and contributors  to discover the procedure to join the Transport Stack ecosystem." keywords="Delhi Transport Stack Onboarding Policy, Transport Stack Data User Policy, Accessing Delhi Transport Stack Data, Transport Stack Data Sharing Agreement, Delhi Transport Stack User Terms" />
      <div className="content-header">
        <div className="container">
          <Breadcrumb />
          <div className="d-flex">
            <Image
              src={arrow}
              alt="left arrow"
              className="left-arrow"
              onClick={() => {
                navigate("../../resources");
              }}
            />
            <h1 className="header-title">
              {mobileScreenSize ? (
                <>Resource</>
              ) : (
                <>{selectedResourceDetails?.title}</>
              )}
            </h1>
          </div>
        </div>
      </div>
      <div className="content-body">
        <div className="container-1 container d-flex justify-content-center">
          <div className="row p-0 m-0 cards ">
            <div className="details">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={policyKey}
              >
                <div className="d-flex details-header">
                  <div className="details-picture">
                    <img
                      src={selectedResourceDetails?.img}
                      alt={selectedResourceDetails?.title}
                      className="picture-img"
                    />
                    <h1 className="picture-title">
                      {selectedResourceDetails?.title}
                    </h1>
                    <div className="picture-description">
                      <p>
                        Review our onboarding policies to discover the procedure
                        to join the Transport Stack ecosystem.
                      </p>
                    </div>
                  </div>
                  <div className="details-tab">
                    <button
                      className="close-icon"
                      style={{ border: "none", background: "none" }}
                      onClick={() => {
                        navigate("../../resources");
                      }}
                    >
                      ×
                    </button>
                    <div className="nav-items">
                      <Nav variant="pills" className="flex-column">
                        {selectedResourceDetails?.tabNames?.map((item, i) => {
                          return (
                            <Nav.Item key={item} className={"item" + i}>
                              <Nav.Link eventKey={"item" + i}>{item}</Nav.Link>
                            </Nav.Item>
                          );
                        })}
                      </Nav>
                    </div>
                  </div>
                </div>
                <div className="user_support">
                  <Tab.Content>
                    <Tab.Pane eventKey="item0">
                      <div className="tab-panel-content">
                        <h2>Onboarding of data users</h2>
                        {mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="mobile-view-btn"
                            onClick={() => handleDownload(2, 4, 'Onboarding_of_data_users')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                        <PdfViewer category='2' subcategory='4' />
                        {!mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="desktop-view-btn"
                            onClick={() => handleDownload(2, 4, 'Onboarding_of_data_users')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="item1">
                      <div className="tab-panel-content">
                        <h2>Onboarding of data contributors</h2>
                        {mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="mobile-view-btn"
                            onClick={() => handleDownload(2, 5, 'Onboarding_of_data_contributors')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                        <PdfViewer category='2' subcategory='5' />
                        {!mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="desktop-view-btn"
                            onClick={() => handleDownload(2, 5, 'Onboarding_of_data_contributors')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardingPolicy;
