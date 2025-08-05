import React from "react";
import Breadcrumb from "../../components/user/ui/Breadcrumb/Breadcrumb";
import BannerTitle from "../../components/user/ui/BannerTitle/BannerTitle";
import CarouselComponent from "../../components/common/ui/carousel/CarouselComponent";
import AddSeo from "../../utils/AddSeo";
import "../../assets/styles/howToJoin.scss";
import "../../assets/styles/innovationChallenge.scss";
import "../../assets/styles/accordioncomponent.scss";
import FITTLogo from "../../assets/images/FFIT_simple_logo.png";
import dtc from "../../assets/images/DTC-logo.svg";
import delhimetrorail from "../../assets/images/delhi_metro_logo.png";
import DIMTS from "../../assets/images/DIMTS.svg";
import Chartr from "../../assets/images/usecase-new-2.png";
import MeitY from "../../assets/images/MeitY.png";
import iCreate from "../../assets/images/iCreate-logo-registered.png";
import IITMIC from "../../assets/images/IITMIC.png";
import THub from "../../assets/images/THub-logo.png";
import InnovationBanner from '../../assets/images/innovation-banner.png';
import highlights1 from '../../assets/images/highlights1.svg';
import highlights2 from '../../assets/images/highlights4.svg';
import highlights3 from '../../assets/images/highlights3.svg';
import highlights4 from '../../assets/images/highlights5.svg';
import highlights5 from '../../assets/images/highlights2.svg';
import timeline1 from '../../assets/images/timeline1.svg';
import timeline2 from '../../assets/images/timeline2.svg';
import timeline3 from '../../assets/images/timeline3.svg';
import timeline4 from '../../assets/images/timeline4.svg';
import timeline5 from '../../assets/images/timeline5.svg';

import BravecoreLogo from '../../assets/images/winners/bravecore-logo.jpeg';
import SaathiLogo from '../../assets/images/winners/saathi-logo.jpeg';
import NuverseLogo from '../../assets/images/winners/nuverse-logo.jpeg';
import PapliLogo from '../../assets/images/winners/papli-logo.png';
import TransitIntelligenceLogo from '../../assets/images/winners/transit-intelligence-logo.jpeg';
import WinnerCard from "../../components/user/ui/winner-list/WinnerCard";

const InnovationChallenge = () => {

  const partners = [
    { name: "MeitY", roundedlogo: 'false', img: MeitY },
    { name: "FITT", roundedlogo: 'false', img: FITTLogo },
    { name: "dtc", roundedlogo: 'true', img: dtc },
    { name: "delhimetrorail", roundedlogo: 'false', img: delhimetrorail },
    { name: "DIMTS", roundedlogo: 'true', img: DIMTS },
    { name: "Chartr", roundedlogo: 'true', img: Chartr },
    { name: "iCreate", roundedlogo: 'false', img: iCreate },
    { name: "IITMadras", roundedlogo: 'false', img: IITMIC },
    { name: "THub", roundedlogo: 'false', img: THub },
  ];

  const winnerList = [
    {
      teamName: "Bravecore Private Limited",
      description: "Bravecore will undertake the development of Smart Cop, an AI powered robotic system which undertakes " +
        "monitoring to detect & report infractions, improving passenger safety and enhancing overall commuter experience. " +
        "The autonomous robot moves on a ceiling mounted powered track and leverages the power of computer vision, to emulate a " +
        "security personnel on patrol.",
      logo: BravecoreLogo
    },
    {
      teamName: "Carnot Research Private Limited",
      description: "Carnot Research will develop SAATHI - 'System for Accessible and Adaptive Transportation Harnessing Inclusivity', " +
        "a NLP based multilingual conversational AI agent, to aid citizens across linguistic groups & tourists navigate public transport " +
        "easily by offering route guidance, navigation assistance, raising safety SoS alerts, etc. With capabilities of 'Text to Speech’ " +
        "& ‘Speech to Text’, along with information on available accessibility infrastructure (e.g., ramps, elevators), " +
        "it will also enable enhanced journeys for specially abled.",
      logo: SaathiLogo
    },
    {
      teamName: "Nuverse",
      description: "Nuverse will undertake the development of an AI-powered, video-based health data platform for measuring " +
        "wide range of biomarkers such as Haemoglobin, BP, etc. using smartphones. This will be leveraged for health monitoring " +
        "of drivers to identify early signs of fatigue, stress, or other health risks, and undertake active intervention to " +
        "ensure enhanced wellbeing of drivers & safer travel for commuters.",
      logo: NuverseLogo
    },
    {
      teamName: "Papli Labs Private Limited",
      description: "Papli envisages development of a virtual digital copy of roads, leveraging feed collected by 4G dashcams " +
        "mounted in commercial vehicles. The data will be leveraged for driving smart road analytics & traffic intelligence " +
        "for cities & highways, including undertaking demand analytics such as identification of overcrowded / underused bus " +
        "routes, detection of traffic rule violations, identification of road hazards like potholes or waterlogging to " +
        "ensure safe transit and maintenance.",
      logo: PapliLogo
    },
    {
      teamName: "Transit Intelligence",
      description: "Transit Intelligence will support bus operators with service analytics, network planning, optimised bus " +
        "and charger scheduling services to enhance efficiency of operations. It will also create optimized, route-specific " +
        "bus and crew schedules, factoring multiple parameters such as headway, trip time, and operational parameters to make " +
        "bus services more demand responsive and cost-efficient.",
      logo: TransitIntelligenceLogo
    }
  ];

  const themes = [
    {
      title: "AI-Driven Smart Mobility Enhancements",
      description:
        "Improve public transport adoption with AI-driven network planning, <b>dynamic scheduling & better people movement data</b> for efficiency and reliability",
    },
    {
      title: "Sustainable Urban Commute: Green moves for brighter future",
      description:
        "Promote greener transport modes through <b>loyalty programs, gamification, and carbon credit scores</b> to reduce air pollution and overall environmental impact",
    },
    {
      title: "Next generation accessibility: Inclusive cities of the future",
      description:
        "Increase accessibility using <b>LLMs, AR navigation, and gender-sensitive services</b> that cater to <b>special needs, language barriers, and gender inclusivity</b> in transport systems.",
    },
    {
      title: "Safe Transit: Enhancing Security, Ensuring Trust",
      description:
        "Improve transport safety by leveraging <b>SOS services, route safety indexes, and accident data</b> to address security issues and disruptions",
    },
    {
      title: "Urban Data & Marketplaces: Unlocking art of the possible ",
      description:
        "<b>Leverage transport data and create interoperable systems for new data generation</b>, improving infrastructure like cameras and mobile details",
    },
    {
      title: "Decongestion: Smart Moves for Smooth Traffic",
      description:
        "Use <b>data and predictive intelligence to improve traffic flow, reduce congestion</b>, and enhance urban mobility efficiency",
    },
    {
      title: "Rethink Movement: Micro-mobility’s macro impact  ",
      description:
        "Enhance <b>E-rickshaw/E-auto services with route optimization, digital booking, and shared last-mile options</b> for better accessibility and operational efficiency",
    },
    {
      title: "Unlocking Value of Non-Farebox Possibilities",
      description:
        "Generate non-farebox revenue by optimizing traditional categories like <b>advertising and leveraging data and digital technology</b> for new opportunities",
    },
    {
      title: "Redefining Industries with Cross-Sector Data Synergy",
      description:
        "Leverage <b>transport data to drive innovation across industries</b> healthcare, insurance, automotive, driving seamless smart city <b>solutions beyond traditional industry borders</b>",
    },
    {
      title: "Driver Performance: Excellence Digital nudges for safer streets",
      description:
        "Enhance <b>driver recruitment, management, and performance</b> with digital nudges and behavioral analytics for better feedback and coordination",
    },
  ];

  const highlights = [
    { name: "Total Grant upto USD 100K for top ideas", image: highlights1 },
    { name: "Incubation support by FITT@IIT Delhi for winners", image: highlights2 },
    { name: "Cloud Credits for Proof of Concept (PoC)", image: highlights3 },
    { name: "Workshops/ Mentorship for top participants", image: highlights4 },
    { name: "Branding and Promotion on key platforms", image: highlights5 },
  ];

  const timeline = [
    { title: "Registration ", title2: "Opens", date: '7th Nov 2024', image: timeline1 },
    { title: "Round 1 Idea ", title2: "Submission Deadline", date: '15th Dec 2024', image: timeline2 },
    { title: "Workshop & Round 2 ", title2: "Screening", date: 'Dec 2024', image: timeline3 },
    { title: "Advanced Workshop & ", title2: "Final submission", date: 'Jan 2025', image: timeline4 },
    { title: "Pitch Day &", title2: "Award ceremony", date: '3rd Feb 2025', image: timeline5 },
  ];

  return (
    <div className="innovation">
      <AddSeo
        title="Open Innovation Challenge : Delhi Transport Stack"
        description="Innovate for a smarter Delhi! Participate in the Delhi Transport Stack Innovation Challenge. Develop solutions using Transport Stack data and win funding to revolutionize public transport."
        keywords="Delhi Transport Stack Innovation Challenge, MaaS Innovation Challenge, Delhi Public Transport Innovation, Smart Mobility Challenge India, Transport Tech Startup Competition, Delhi Transport Ecosystem"
      />

      <div className="innovation-header">
        <div className="container">
          <div>
            <Breadcrumb />
            <BannerTitle title="Open Innovation Challenge"></BannerTitle>
          </div>
          <div className="row m-0">
            <div className="col-sm-12 col-md-5 ps-0 pe-4 details_picture">
              <img
                src={InnovationBanner}
                alt="innovation banner"
                className="innovation-banner"
              />
            </div>
            <div className="col-sm-12 col-md-7 pe-0 ps-4 details_description">
              <div className='innovation__introduction'>
                <p className="innovation__introduction-heading">
                  The Transport Stack Open Innovation Challenge aims to facilitate data-driven transformative solutions in key areas like last mile connectivity, AI-driven smart mobility, sustainable urban commute, inclusive cities, transit safety, smart traffic management, and micro-mobility optimization to penetrate the modal share of multi-modal transport.
                  <br /><br />
                  <span className='bold-text'>Startups, academia,</span> and <span className='bold-text'>researchers</span> are invited to participate for addressing key mobility challenges, by proposing innovative solutions, turning them into functional prototype, and test the value proposition with a proof-of-concept implementation in Delhi Transport Ecosystem.
                  <br /><br />
                  It is orchestrated by <span className='bold-text'>Japan International Cooperation Agency (JICA)</span> in collaboration with Transport Department (GNCTD) and Public Transport authorities in Delhi.<span className='bold-text'> Foundation for Innovation and Technology Transfer (FITT) - IIT Delhi</span> is the organizing and incubation partner, with <span className='bold-text'>Boston Consulting Group (BCG)</span> as the knowledge partner, bringing deep industry insights and expertise to the challenge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="innovation__content container">
        <div className='innovation__highlights'>
          <h2 className="section-container__heading">Program Highlights</h2>
          <div className="rounded-container">
            {highlights.map((item) => {
              return (
                <div key={item.name} className='rounded-item'>
                  <div className='circle-item'>
                    <img src={item.image} alt='highlights'/>
                    <span>{item.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className='innovation__timeline'>
          <h2 className="section-container__heading">Program Timeline</h2>
          <div className="timeline-container">
            {
              timeline.map((item) => {
                return (
                  <div className="timeline-item" key={item.title}>
                    <img src={item.image} alt='timeline'/>
                    <div className='dashed-line'></div>
                    <p>{item.title}
                      <br/> {item.title2}
                    </p>
                    <span>{item.date}</span>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className="innovation__themes  section-container">
          <h2 className="section-container__heading">
            Themes for the challenge
          </h2>
          <div className="d-flex flex-wrap mt-4">
            {themes.map((theme, index) => {
              return (
                <div className="card_content" key={index}>
                  <div className="card">
                    <div className="card_header">
                      <span className="card_round">{index + 1}</span>
                      <span className="card_text">{theme.title}</span></div>
                    <div
                      className="card_body"
                      dangerouslySetInnerHTML={{__html: theme.description}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <h2 className="section-container__heading mb-4">🏆 Winners</h2>
          {winnerList.map((winner, index) => (
            <WinnerCard key={index} {...winner} />
          ))}
        </div>

        <div className="innovation__partners section-container">
          <h2 className="section-container__heading">Partners</h2>
          <div className="innovation__partners-cards">
            <CarouselComponent
              partialVisible="true"
              desktopItems="3"
              mobileItems="1"
              autoplay={true}
            >
              {partners.map((partner) => {
                return (
                  <div key={partner.name} className="carousel-item active">
                    <div className={partner.roundedlogo === 'true' ? "partner_logos rounded-logo" : "partner_logos"}>
                      <img
                        src={partner.img}
                        className="img-fluid"
                        alt={partner.name}
                        draggable="false"
                        style={{"maxHeight": "300px"}}
                      />
                    </div>
                  </div>
                );
              })}
            </CarouselComponent>
          </div>
          <p className="pt-3">
            For any further information about the program or specific queries,
            please contact us at{" "}
            <span id="mail_id">transportstack_oic@fitt-iitd.in</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InnovationChallenge;
