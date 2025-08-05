import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import useCheckMobileScreen from "../../../hooks/useCheckMobileScreen";
import { downloadResource } from "../../../utils/Helper";
import Breadcrumb from "../../../components/user/ui/Breadcrumb/Breadcrumb";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import PdfViewer from "../../../components/common/ui/pdfviewer/PdfViewer";
import VideoPlayer from "../../../components/common/ui/video/VideoPlayer";
import "../../../assets/styles/ResourceDetails.scss";
import arrow from "../../../assets/images/left-arrow.png";
import AddSeo from "../../../utils/AddSeo";

function UserSupport() {
  let navigate = useNavigate();
  const mobileScreenSize = useCheckMobileScreen();
  const [videoDimensions, setVideoDimensions] = useState({width:0,height:0});
  let selectedResourceDetails = {
    title: "User Support",
    img: "../resource/resource-img-1.png",
    tabNames: [
      "User Guide",
      "Issue & Grievance Management",
      "Dispute Resolution Mechanism",
    ],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if(mobileScreenSize)setVideoDimensions({width:'100%',height:300})
      else setVideoDimensions({width:'100%',height:400})
  }, []);
  useEffect(() => {
    
  }, []);

  const handleDownload = (category, subcategory, title) => {
    downloadResource(category, subcategory, title);
  };

  return (
    <div className="resource-details">
      <AddSeo title="Support Resources : Delhi Transport Stack" description="Find comprehensive guide for using Transport Stack and solutions for any issues or grievances you encounter while using the platform." keywords="Delhi Transport Stack Support, API Support, Issue Support, Delhi Transport Stack Membership, Transport Stack API Access, Delhi Transport Data Integration, Mobility Solutions Development," />
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
                        Find comprehensive guide for using Transport Stack and
                        solutions for any issues or grievances you encounter
                        while using the platform.
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
                            <Nav.Item key={i + ''} className={"item" + i}>
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
                      <h2>User Guide</h2>
                      <div className="inner-content">
                        <div className="user_guide_video">
                          <VideoPlayer
                            videoUrl="https://dts-portal-assets.s3.ap-south-1.amazonaws.com/TS+Web+Portal_Demo+Video.mp4"
                            width={videoDimensions.width} height={videoDimensions.height}
                          />
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="item1">
                      <div className="tab-panel-content">
                        <h2>Issue & Grievance Management</h2>
                        {mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="mobile-view-btn"
                            onClick={() => handleDownload(1, 2, 'Issue_Grievance_Management')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                        <PdfViewer category='1' subcategory='2' />
                        {!mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="desktop-view-btn"
                            onClick={() => handleDownload(1, 2, 'Issue_Grievance_Management')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="item2">
                      <div className="tab-panel-content">
                        <h2>Dispute Resolution Mechanism</h2>
                        {mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="mobile-view-btn"
                            onClick={() => handleDownload(1, 3, 'Dispute_Resolution_Mechanism')}
                          >
                            Download
                          </ButtonComponent>
                        )}
                        <PdfViewer category='1' subcategory='3' />
                        {!mobileScreenSize && (
                          <ButtonComponent
                            type="primaryBlue"
                            className="desktop-view-btn"
                            onClick={() => handleDownload(1, 3, "Dispute_Resolution_Mechanism")}
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

export default UserSupport;
