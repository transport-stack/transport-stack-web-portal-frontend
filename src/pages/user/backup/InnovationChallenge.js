import React from "react";
import Card from "react-bootstrap/Card";
import Breadcrumb from "../../components/user/ui/Breadcrumb/Breadcrumb";
import BannerTitle from "../../components/user/ui/BannerTitle/BannerTitle";
import CarouselComponent from "../../components/common/ui/carousel/CarouselComponent";
import AddSeo from "../../utils/AddSeo";
import Accordion from "react-bootstrap/Accordion";
import "../../assets/styles/howToJoin.scss";
import "../../assets/styles/innovationChallenge.scss";
import "../../assets/styles/accordioncomponent.scss";
import FITTLogo from "../../assets/images/FFIT_simple_logo.png";
import ButtonComponent from "../../components/common/ui/button/ButtonComponent";
import dtc from "../../assets/images/DTC-logo.svg";
import delhimetrorail from "../../assets/images/delhi_metro_logo.png";
import DIMTS from "../../assets/images/DIMTS.svg";
import Chartr from "../../assets/images/usecase-new-2.png";
import MeitY from "../../assets/images/MeitY.png";
import iCreate from "../../assets/images/iCreate-logo-registered.png";
import IITMIC from "../../assets/images/IITMIC.png";
import THub from "../../assets/images/THub-logo.png";
import check_mark from "../../assets/images/check-mark-svgrepo-com.svg";
import rules_svgrepo from "../../assets/images/rules-svgrepo-com.svg";
import user_profile from "../../assets/images/user-profile-svgrepo-com.svg";
import document_svgrepo from "../../assets/images/document-svgrepo-com.svg";
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
    { title: "Pitch Day &", title2: "Award ceremony", date: 'Last week of Jan 2025', image: timeline5 },
  ]

  const onClickDownload = () => {
    window.open('https://drive.google.com/file/d/10ZkHEMyrAw7YmNiM50gJXWrR4Iqj_w20/view?usp=sharing', '_blank');
  };

  const handleRegisterClick = () => {
    window.open('https://forms.gle/ZLswKVVfCBchAuPDA');
  }

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
        {/* <div className='innovation__register'>
          <ButtonComponent type="primaryBlue" onClick={handleRegisterClick}>Register Now</ButtonComponent>
          <p className='innovation-title'>Registration closes on December 15, 2024, 23:59 Hours IST </p>
          <p className='innovation-subtitle'>Don't miss the deadline—submit your entries today!</p>
        </div> */}
        <div className='innovation__highlights'>
          <h2 className="section-container__heading">Program Highlights</h2>
          <div className="rounded-container">
            {highlights.map((item) => {
              return (
                <div key={item.name} className='rounded-item'>
                  <div className='circle-item'>
                    <img src={item.image} alt='highlights' />
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
                    <img src={item.image} alt='timeline' />
                    <div className='dashed-line'></div>
                    <p>{item.title}
                      <br /> {item.title2}
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
                  <div className="card" >
                    <div className="card_header">
                      <span className="card_round">{index + 1}</span>
                      <span className="card_text">{theme.title}</span></div>
                    <div
                      className="card_body"
                      dangerouslySetInnerHTML={{ __html: theme.description }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="innovation__guidelines  section-container mt-5">
          <h2 className="section-container__heading">
            Round wise details
          </h2>
          <div className="row m-0">
            <div className="col-md-12 section-content p-0">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={user_profile} alt="" className="card_img" />
                    <span>Who can apply?</span>
                  </Card.Title>
                  <div className="card-text">
                    <div className="apply-container">
                      <div className="apply-item">
                        <p>Startups, academia, and researchers </p>
                      </div>
                      <div className="apply-item">
                        <p>Open to residents of India/ Japan</p>
                      </div>
                      <div className="apply-item">
                        <p>Teams can have up to five members</p>
                      </div>
                      <div className="apply-item">
                        <p>Each-individual must register in only one team</p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6 section-content p-0 pe-4 d-flex align-items-stretch" id="Expectation_content">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={document_svgrepo} alt="" className="card_img" />
                    <span>Round-wise Output Expectations</span>
                  </Card.Title>
                  <div className="card-text">
                    <div>
                      <ul className="mb-0">
                        <li className="description">
                          <strong>Round 1:</strong> Submit a detailed idea
                          proposal and initial pitch deck, highlighting the
                          problem, proposed solution, impact and team profile
                          (Refer to the detailed round 1 submission guidelines
                          provided below)
                        </li>
                        <li className="description">
                          <strong>Round 2:</strong> Deliver a refined pitch deck
                          with enhanced techno-functional details, including
                          prototype design or wireframes
                        </li>
                        <li className="description">
                          <strong>Round 3:</strong> Present a comprehensive
                          final pitch, including a functional prototype and a
                          well-defined plan for adoption by target stakeholder
                          groups
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6 section-content p-0 d-flex align-items-stretch">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={rules_svgrepo} alt="" className="card_img" />
                    <span>Round 1 - Submission Guidelines</span>
                  </Card.Title>
                  <div className="card-text">
                    <p className="pb-2">
                      Please ensure your submission addresses the following key
                      areas:
                    </p>
                    <ul className="mb-0">
                      <li className="description">
                        <strong>Problem & Market Overview:</strong> Describe the
                        mobility challenge, market gap or problem your solution
                        tackles, providing industry context and market insights
                      </li>
                      <li className="description">
                        <strong>Solution & its USPs:</strong> Summarize your
                        solution, highlighting its unique selling points (USPs),
                        technology, and innovative features
                      </li>
                      <li className="description">
                        <strong>Impact & SDG Alignment:</strong> Explain the
                        stakeholders impacted, type and scale of expected impact
                        and how your solution aligns with Sustainable
                        Development Goals (SDGs)
                      </li>
                      <li className="description">
                        <strong>Supporting Documents:</strong> Submit a pitch
                        deck (PPT/PDF) and any additional materials to support
                        your submission (max 10 MB).
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-12 section-content p-0">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <img src={check_mark} alt="" className="card_img" />
                    <span>Evaluation Criteria</span>
                  </Card.Title>
                  <div className="card-text">
                    <div className="mb-0 evaluation-criteria">
                      <div className="description">
                        <p><strong>Innovative</strong></p>
                        <span> Uniqueness of the solution and use of new-gen technologies</span>
                      </div>
                      <div className="description">
                        <p><strong>Impactful</strong> </p>
                        <span> Visibility on value for different stakeholder group, estimate on potential impact, and alignment with SDGs</span>
                      </div>
                      <div className="description">
                        <p><strong>Practical</strong></p>
                        <span> Solution feasibility,
                          implementation plan, and approach to drive stakeholder
                          adoption</span>
                      </div>
                      <div className="description">
                        <p><strong>Scalable</strong></p>
                        <span> Clear solution roadmap, and
                          replicable model across cities</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center mt-4 download">
          <p className="me-2">
            For more details:
          </p>
          <ButtonComponent
            type="primaryBlue"
            onClick={() => onClickDownload()}
            className="pe-5 ps-5"
          >
            Click to Download
          </ButtonComponent>
        </div>
        <div className="innovation__register mt-4" style={{ position: "inherit" }}>
          <p className='innovation-title'>Registrations closed. </p>
          <p className='innovation-subtitle'>Selected participants will be contacted soon with the next steps.</p>
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
                        style={{ "maxHeight": "300px" }}
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
        <section className="innovation__accordion--section">
          <h2 className="innovation__accordion--heading">FAQ's</h2>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span className="dot">1</span>We are not sure our idea fits into one of the themes for the
                Transport Stack Open Innovation Challenge. Should we still
                apply?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  Yes, you should still apply if your idea addresses
                  transportation or mobility challenges, even if it doesn’t
                  directly fit into one of the predefined themes. The{" "}
                  <b>Transportation Stack Open Innovation Challenge</b>{" "}
                  encourages innovative and creative solutions across various
                  aspects of transportation. If your idea demonstrates potential
                  to improve mobility, reduce congestion, enhance
                  sustainability, or solve related issues, it may still be
                  considered. Ensure that your application clearly outlines the
                  impact and relevance of your solution.
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <span className="dot">2</span>Can we include links with our
                applications?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  All submissions must be self-contained and submitted in
                  accepted formats such as PPT or PDF. Any additional materials
                  or supporting information can be included in the annexures.
                  Ensure that your application provides all necessary details
                  within the submitted documents, fully representing your
                  solution in compliance with the challenge's guidelines on
                  originality, data usage, and intellectual property.
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <span className="dot">3</span>Is there any Application Fee?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  No, there is no application fee for participating in the
                  Transportation Stack Open Innovation Challenge. The challenge
                  is open to all eligible participants without any charges for
                  submission. Our goal is to encourage widespread participation
                  from startups, innovators, and researchers by providing a
                  platform to showcase their solutions and ideas without
                  financial barriers. We invite you to focus on developing
                  impactful transportation solutions, and all stages of the
                  challenge are free to enter.
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <span className="dot">4</span>If selected, what can I expect in
                terms of help for my team or startup?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  If selected, your team or startup can expect comprehensive
                  support, including:
                </p>
                <ol className="mb-0">
                  <li>
                    <b>Workshops and Mentorship: </b>
                    Access to hands-on workshops, 1:1 mentorship session from
                    experts, to refine your solution and develop your business
                    model.
                  </li>
                  <li>
                    <b>Incubation and Funding Opportunities: </b>
                    Potential for incubation at FITT IIT Delhi and access to
                    financial grants for prototyping and PoC development.
                  </li>
                  <li>
                    <b>Networking and Exposure: </b>
                    Opportunities to network with industry leaders,
                    policymakers, and investors.
                  </li>
                  <li>
                    <b>Resources: </b>
                    Cloud credits and tools to support product development
                  </li>
                </ol>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                <span className="dot">5</span>We have more than one idea. Can we
                submit more than one application?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  No, you cannot submit more than one application. Each team is
                  allowed to submit only one application for the Transportation
                  Stack Open Innovation Challenge. We encourage you to focus on
                  your strongest idea and develop it thoroughly for submission.
                  Ensure that the chosen idea aligns with the problem statements
                  and is presented clearly to increase your chances of being
                  shortlisted.
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                <span className="dot">6</span>We have a great idea but are not
                technical. Can we still apply?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  Yes, you can still apply even if your team is not technical.
                  The Transportation Stack Open Innovation Challenge welcomes
                  diverse teams, and if selected, you will receive access to
                  mentorship, workshops, and technical support to help refine
                  your idea and develop it into a viable solution. Additionally,
                  the challenge encourages collaboration, so you may also
                  partner with technical experts or advisors during the program
                  to bring your idea to life.
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="6">
              <Accordion.Header>
                <span className="dot">7</span>Are there more specific dates
                available for the events?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  Some of the dates will be specified as we get closer to the
                  milestones and will be communicated to the shortlisted
                  participants directly.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </section>
        <div>
          <h3 className="fw-bold text-center mb-4">🏆 Winners</h3>
          {winnerList.map((winner, index) => (
            <WinnerCard key={index} {...winner} />
          ))}
        </div>
      </div>
    </div >
  );
};

export default InnovationChallenge;
