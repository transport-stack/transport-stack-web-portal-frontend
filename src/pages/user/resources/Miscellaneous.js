import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Breadcrumb from "../../../components/user/ui/Breadcrumb/Breadcrumb";
import useCheckMobileScreen from "../../../hooks/useCheckMobileScreen";
import "../../../assets/styles/ResourceDetails.scss";
import arrow from "../../../assets/images/left-arrow.png";

function Miscellaneous() {
  let navigate = useNavigate();
  const mobileScreenSize = useCheckMobileScreen();
  let selectedResourceDetails = {
    title: "Miscellaneous",
    img: "../resource/resource-img-5.png",
    tabNames: [],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="resource-details">
      <div className="content-header">
        <div className="container">
        <Breadcrumb/>
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
                        Explore additional resources and information essential
                        for enhancing your Transport Stack experience
                      </p>
                    </div>
                  </div>
                  <div className="details-tab">
                    <button
                      className="close-icon"
                      style={{border:"none",background:"none"}}
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
                        <h2>Issue & Grievance Management</h2>
                        <ButtonComponent
                          type="primaryBlue"
                          className="mobile-view-btn"
                        >
                          Download
                        </ButtonComponent>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="item1">
                      <div className="tab-panel-content">
                        <h2>Issue & Grievance Management</h2>
                        <ButtonComponent
                          type="primaryBlue"
                          className="desktop-view-btn"
                        >
                          Download
                        </ButtonComponent>
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

export default Miscellaneous;
