import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import useCheckMobileScreen from "../../../hooks/useCheckMobileScreen";
import { downloadResource } from "../../../utils/Helper";
import Breadcrumb from "../../../components/user/ui/Breadcrumb/Breadcrumb";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import "../../../assets/styles/ResourceDetails.scss";
import arrow from "../../../assets/images/left-arrow.png";
import DTS_Option_Dark from "../../../assets/images/TS_logo_op3_Dark.png";
import DTS_Option_Light from "../../../assets/images/TS_logo_op3_light.png";
import PdfViewer from "../../../components/common/ui/pdfviewer/PdfViewer";
import AddSeo from "../../../utils/AddSeo";

function MarketingResource() {
  let navigate = useNavigate();
  const mobileScreenSize = useCheckMobileScreen();
  let selectedResourceDetails = {
    title: "Marketing Resources",
    img: "../resource/resource-img-4.png",
    tabNames: ["Branding Guidelines Users", "TS Logo"],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = (category, subcategory, title) => {
    downloadResource(category, subcategory, title);
  };

  return (
    <div className="resource-details">
      <AddSeo title="Marketing Resources: Delhi Transport Stack" description="Delhi Transport Stack Marketing Resources, MaaS Marketing Materials Download, Delhi Transport Stack Brand Assets, Brand Guidelines, Logo Usage" />
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
                        Explore our branding guidelines to understand the proper
                        usage of the Transport Stack mark
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
                        <h2>Branding Guidelines</h2>
                        {mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="mobile-view-btn"
                            onClick={() => handleDownload(4, 8, 'Branding_Guidelines')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                        <PdfViewer category='4' subcategory='8' />
                        {!mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="desktop-view-btn"
                            onClick={() => handleDownload(4, 8, 'Branding_Guidelines')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="item1">
                      <div className="tab-panel-content">
                        <h2>TS Logo</h2>
                        <div className="inner-content">
                          <Image
                            src={DTS_Option_Dark}
                            alt="DTS Option Dark"
                            className="DTC_logos"
                          />
                          <Image
                            src={DTS_Option_Light}
                            alt="DTS Option Light"
                            className="DTC_logos"
                            style={{ "background": "#0186e0" }}
                          />
                        </div>
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

export default MarketingResource;
