import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import useCheckMobileScreen from "../../../hooks/useCheckMobileScreen";
import { downloadResource } from "../../../utils/Helper";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Breadcrumb from "../../../components/user/ui/Breadcrumb/Breadcrumb";
import "../../../assets/styles/ResourceDetails.scss";
import arrow from "../../../assets/images/left-arrow.png";
import PdfViewer from "../../../components/common/ui/pdfviewer/PdfViewer";
import AddSeo from "../../../utils/AddSeo";

function TechResource() {
  let navigate = useNavigate();
  const mobileScreenSize = useCheckMobileScreen();
  let selectedResourceDetails = {
    title: "Technical Resources",
    img: "../resource/resource-img-3.png",
    tabNames: [
      "Data Security and Privacy Guidelines for Apps",
      "Integration Guide",
    ],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = (category, subcategory, title) => {
    downloadResource(category, subcategory, title);
  };

  return (
    <div className="resource-details">
      <AddSeo title=" Technical Resources : Delhi Transport Stack" description="Explore our technical documentation and guidelines for developers  to securely integrate with Transport Stack including Data Security and Privacy Guidelines" keywords="Delhi Transport Stack Tech Resources, Transport Stack Developer Documentation, MaaS API Documentation, Delhi Transport Stack Data Standards, Data Security, Data Privacy" />
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
              <Tab.Container id="left-tabs-example" defaultActiveKey="item0">
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
                        Access our technical documentation and guidelines to
                        securely integrate with Transport Stack
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
                        <h2>Data Security and Privacy Guidelines for Apps</h2>
                        {mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="mobile-view-btn"
                            onClick={() => handleDownload(3, 6, 'Data_Security_and_Privacy_Guidelines_for_Apps')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                        <PdfViewer category='3' subcategory='6' />
                        {!mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="desktop-view-btn"
                            onClick={() => handleDownload(3, 6, 'Data_Security_and_Privacy_Guidelines_for_Apps')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="item1">
                      <div className="tab-panel-content">
                        <h2>Integration Guide</h2>
                        {mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="mobile-view-btn"
                            onClick={() => handleDownload(3, 7, 'Integration_Guide')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                        <PdfViewer category='3' subcategory='7' />
                        {!mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="desktop-view-btn"
                            onClick={() => handleDownload(3, 7, 'Integration_Guide')}
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

export default TechResource;
