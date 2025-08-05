import React, { useEffect } from "react";
import Breadcrumb from '../../components/user/ui/Breadcrumb/Breadcrumb'
import arrow from "../../assets/images/left-arrow.png";
import "../../assets/styles/resource.scss";
import ResourceCard from "../../components/user/ResourceCard";
import AddSeo from "../../utils/AddSeo";
import ButtonComponent from "../../components/common/ui/button/ButtonComponent";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const navigate = useNavigate();
  const resourceData = [
    {
      title: "User Support",
      description:
        "Find comprehensive guide for using Transport Stack and solutions for any issues or grievances you encounter while using the platform.",
      img: "../resource/resource-img-1.png",
    },
    {
      title: "Onboarding Policies",
      description:
        "Review our onboarding policies to discover the procedure to join the Transport Stack ecosystem.",
      img: "../resource/resource-img-2.png",
    },
    {
      title: "Technical Resources",
      description:
        "Access our technical documentation and guidelines to securely integrate with Transport Stack",
      img: "../resource/resource-img-3.png",
    },
    {
      title: "Marketing Resources",
      description:
        "Explore our branding guidelines to understand the proper usage of the Transport Stack mark",
      img: "../resource/resource-img-4.png",
    }
  ];

  const handleHowtoJoinClick = () => {
    navigate("/howtojoin", { replace: true });
  }
  useEffect(() => {
    localStorage.removeItem('policyKey');
  }, []);

  return (
    <div className="resource">
      <AddSeo title=" Resources : Delhi Transport Stack" description="Explore the Transport Stack Resource Center - your one-stop hub for mastering the platform. Discover governance, policies, grievance management, and more to enhance your Transport Stack experience." keywords="How to Use Transport Stack, Transport Stack Data Portal, Transport Stack Learning Center, Public Transport Data Resources, Mobility as a Service (MaaS) Resources, Developer Resources"/>
      <div className="content-header">
        <div className="container">
          <Breadcrumb />
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <img src={arrow} alt="left arrow" className="left-arrow" onClick={() => navigate(-1)} />
              <h1 className="header-title">Resources</h1>
            </div>
            <ButtonComponent
              type="secondaryWhite"
              onClick={() => handleHowtoJoinClick()}
              className="me-0"
            >
              How to join
            </ButtonComponent>
          </div>
          <div className="resource-information">
            <p>
              Explore the Transport Stack Resource Center - your essential guide
              to mastering the Transport Stack portal. This comprehensive hub
              provides all the information necessary to navigate the platform
              effectively. From governance and policies to grievance management,
              we cover all the essentials. Our Resource Center is committed to
              supporting you and enhancing your experience with Transport Stack.
              Take a look and discover everything we have to offer!
            </p>
          </div>
        </div>
      </div>
      <div className="content-body">
        <div className="container-1 d-flex justify-content-center">
          <div className="row p-0 m-0 cards ">
            {resourceData.map((item, i) => {
              return <ResourceCard data={item} key={item.title}></ResourceCard>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
