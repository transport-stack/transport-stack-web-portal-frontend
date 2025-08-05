import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import AddSeo from "../../utils/AddSeo";
import VideoPlayer from "../../components/common/ui/video/VideoPlayer";
import useCheckMobileScreen from "../../hooks/useCheckMobileScreen";
import Breadcrumb from "../../components/user/ui/Breadcrumb/Breadcrumb";
import CarouselComponent from "../../components/common/ui/carousel/CarouselComponent";
import BannerTitle from "../../components/user/ui/BannerTitle/BannerTitle";
import "../../assets/styles/aboutUs.scss";
import memberLogo from "../../assets/images/user-icon.png";
import link from "../../assets/images/link-arrow.png";

const AboutUs = () => {
  let councilData = [
    {
      name: "Mr. Prashant Goyal",
      role: "Principal Secretary Cum Commissioner, Transport Department, GNCTD",
    },
    {
      name: "Mr. Vikas Kumar",
      role: "Managing Director, Delhi Metro Rail Corporation",
    },
    {
      name: "Ms. Shilpa Shinde",
      role: "Managing Director, Delhi Transport Corporation",
    },
    {
      name: "Mr. Rakesh Jain",
      role: "CEO, Delhi Integrated Multi-Modal Transit System Limited",
    },
  ];
  let panelData = [
    {
      name: "Mr. Yushi Nagano",
      role: "Head, DXLab, Japan International Cooperation Agency",
    },
    {
      name: "Mr. Pravesh Biyani",
      role: "Head, Centre for Sustainable Mobility, IIIT Delhi",
    },
  ];
  let benefitsData = [
    {
      name: "Citizens",
      img: "../aboutUs/review-img-1.png",
      description:
        "Transport Stack revolutionizes your journey planning by offering a comprehensive view of travel options, including metro, bus, and last-mile connectivity. You can easily compare times and fares to select the optimal journey option, and book it all through a single app with a unified QR code. Additionally, Transport Stack provides information on parking availability at metro stations, further enhancing the convenience of your commute",
    },
    {
      name: "Transport Operators",
      img: "../aboutUs/review-img-2.png",
      description:
        "Harness the power of data from diverse customer segments across different transportation modes to enhance your operational planning and efficiency. By analyzing commuter demand patterns, you can dynamically schedule public transport services to optimize integration and meet user needs effectively",
    },
    {
      name: "Businesses",
      img: "../aboutUs/review-img-3.png",
      description:
        "Transport Stack empowers your business to unlock innovative use cases by utilizing data from diverse transportation modes and ancillary services. With various datasets integrated into Transport Stack and accessible via open APIs, you can save significant time on data collection and processing. This will drastically reduce the time to market for new applications, enhancing your operational efficiency and sparking innovation",
    },
    {
      name: "Government",
      img: "../aboutUs/review-img-4.png",
      description:
        "Increased adoption of public transport will reduce the number of private vehicles on the road, leading to a decrease in congestion-related issues and air pollution, thereby promoting environmental sustainability. Additionally, government agencies can leverage transit data for effective public transport network planning and improve disaster response and recovery efforts through data-driven insights",
    },
  ];
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const mobileScreenSize = useCheckMobileScreen();
  // if(mobileScreenSize)setVideoDimensions({width:380,height:250})
  // else setVideoDimensions({width:460,height:340})

  useEffect(() => {
    let nestedElement = document.querySelector('.panel-members .react-multi-carousel-list');
    if (panelData?.length < 4) nestedElement.classList.add('carousel-items');
  }, [panelData]);

  useEffect(() => {
    if (mobileScreenSize) setVideoDimensions({ width: '100%', height: 250 })
    else setVideoDimensions({ width: 460, height: 340 })
  }, []);

  return (
    <div className="aboutUs">
      <AddSeo title="About Us: Delhi Transport Stack" description="Transport Stack uses Standard Data Exchange Protocols & the Mobility as a Service (MaaS) framework to ensure  data interoperability through well-defined data standards across the transport ecosystem."  keywords="Transport Stack Delhi, Delhi Transport Department, Digital Public Infrastructure, MaaS (Mobility as a Service), Urban Mobility Solutions, Smart City Initiative, Government of NCT Delhi,  Public Transportation, Data Interoperability, API Integration, Digital Transformation" />
      <div className="header">
        <div className="header__breadcrumb container">
          <Breadcrumb />
          <BannerTitle title='About us'></BannerTitle>
        </div>
      </div>
      <div className="introduction">
        <div className="introduction__bg">
          <div className="introduction__content">
            <h2>Introduction of Transport Stack</h2>
            <p className="pb-5">
              The Transport Department of the Government of the National Capital Territory of Delhi (GNCTD) has introduced Transport Stack, a Digital Public Infrastructure. It is designed to enable next-generation citizen mobility, seamlessly integrate services, and facilitate the evolution of future mobility solutions. Acting as a unifying force, Transport Stack establishes an efficient, streamlined system across the entire transport network.
            </p>
            <p>
              Transport Stack leverages Standard Data Exchange Protocols and the Mobility as a Service (MaaS) framework to facilitate seamless data interoperability through well-defined data standards across the transport ecosystem. This creates a multimodal network that benefits citizens, transport operators, businesses, and government bodies alike.
            </p>
          </div>
          <div className="introduction__objects">
            <h3>Objectives of Transport Stack</h3>
            <div className="introduction__objects-data row">
              <div className="col-md-3 d-flex pe-3 ps-3">
                <img src={link} alt="link arrow" className="link-arrow" />
                <p>
                  Create a Unified Transport Ecosystem through secure data
                  highways
                </p>
              </div>
              <div className="col-md-3 d-flex pe-3 ps-3">
                <img src={link} alt="link arrow" className="link-arrow" />
                <p>
                  Unlock and Harness Transit Data of Delhi’s Residents for
                  evolvement of Delhi into Smart City
                </p>
              </div>
              <div className="col-md-3 d-flex pe-3 ps-3">
                <img src={link} alt="link arrow" className="link-arrow" />
                <p>Foster Innovation in the Ecosystem through Open APIs</p>
              </div>
              <div className="col-md-3 d-flex pe-3 ps-3">
                <img src={link} alt="link arrow" className="link-arrow" />
                <p>
                  Improve Commuter Mobility and streamline their travel
                  experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="aboutUs__benefits">
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className="aboutUs__benefits-title d-flex justify-content-center align-items-center">
              <h2>How everyone benefits from Transport Stack</h2>
            </div>
          </div>
          <div className="aboutUs__benefits-cards">
            <CarouselComponent desktopItems="4" mobileItems="1" infinite={false}>
              {benefitsData.map((item, index) => {
                return (
                  <Card key={item.name}>
                    <Card.Body>
                      <Card.Title>
                        <img
                          src={item.img}
                          alt={item.img}
                          className="card_img"
                        />
                        {item.name}
                      </Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                    </Card.Body>
                  </Card>
                );
              })}
            </CarouselComponent>
          </div>
        </div>
      </div>
      <div className="key-principles container">
        {/* <img
          src={keyPart}
          alt="transport key parts"
          className="key-principles__img"
        /> */}
        <VideoPlayer videoUrl='https://dts-portal-assets.s3.ap-south-1.amazonaws.com/Transport+Stack_Launch.mp4' width={videoDimensions.width} height={videoDimensions.height} />
      </div>
      <div className="aboutUs__road-map container mb-5"></div>
      <div className="council-members" style={{ display: 'none' }}>
        <div className="container">
          <h2 className="council-members__title">
            Members of Governing Council
          </h2>
          <CarouselComponent desktopItems="4">
            {councilData.map((item, index) => {
              return (
                <div
                  key={item.name}
                  className="d-flex flex-column align-items-center  panel-members__card"
                >
                  <img
                    src={memberLogo}
                    className="council-members__img"
                    alt={item.name}
                  />
                  <p className="council-members__name">{item.name}</p>
                  <p className="council-members__role">{item.role}</p>
                </div>
              );
            })}
          </CarouselComponent>
        </div>
      </div>
      <div className="panel-members" style={{ display: 'none' }}>
        <div className="container">
          <h2 className="panel-members__title">Members of Governing panel.</h2>
          <div className="row d-flex justify-content-center ">
            <CarouselComponent desktopItems="4">
              {panelData.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="d-flex flex-column align-items-center panel-members__card"
                  >
                    <img
                      src={memberLogo}
                      className="panel-members__img"
                      alt={item.name}
                    />
                    <p className="panel-members__name">{item.name}</p>
                    <p className="panel-members__role">{item.role}</p>
                  </div>
                );
              })}
            </CarouselComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
