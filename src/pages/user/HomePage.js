import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShimmerPostList } from 'react-shimmer-effects';
import useCheckMobileScreen from '../../hooks/useCheckMobileScreen';
import AddSeo from '../../utils/AddSeo';
import CarouselComponent from '../../components/common/ui/carousel/CarouselComponent';
import ButtonComponent from '../../components/common/ui/button/ButtonComponent';
import Product from "../../components/user/Product";
import { getFeaturedProducts } from '../../services/apiservices';
import '../../assets/styles/homepage.scss';
import PartnerLogo1 from '../../assets/images/DTC-logo.svg';
import PartnerLogo2 from '../../assets/images/DIMTS.svg';
import PartnerLogo3 from '../../assets/images/DM-Logo-new.png';
import PartnerLogo4 from '../../assets/images/IIITD.svg';
import PartnerLogo5 from '../../assets/images/JICA.svg';
import UsecaseLogo1 from '../../assets/images/usecase-new-1.png';
import UsecaseLogo2 from '../../assets/images/usecase-new-2.png';
import UsecaseLogo3 from '../../assets/images/tummoc-logo.svg';
import doubleQuotes from '../../assets/images/doubleQuotes.png';

const HomePage = () => {
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();
  const [productData, setProductData] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const partners = [
    { name: "jica", img: PartnerLogo5, link: "https://www.jica.go.jp/english/about/dx/jicadx/dxlab/" },
    { name: "delhimetrorail", img: PartnerLogo3, link: "https://www.delhimetrorail.com/" },
    { name: "dtc", img: PartnerLogo1, link: "https://dtc.delhi.gov.in/" },
    { name: "dimtc", img: PartnerLogo2, link: "https://www.dimts.in/" },
    { name: "csm", img: PartnerLogo4, link: "https://csm.iiitd.ac.in/" },

  ];
  const usecases = [
    { name: "One Delhi", img: UsecaseLogo1, link: "https://play.google.com/store/apps/details?id=com.delhitransport.onedelhi&amp;hl=en_IN" },
    { name: "Chartr", img: UsecaseLogo2, link: "https://play.google.com/store/apps/details?id=in.chartr.transit&amp;hl=en_IN" },
    { name: "Tummoc", img: UsecaseLogo3, link: "https://play.google.com/store/apps/details?id=org.transhelp.bykerr&amp;hl=en_IN" },
  ];

  const testimonials = [
    // {
    //   id: 1,
    //   name: "Mr. Kailash Gahlot",
    //   designation: "Honorable Minister of Transport,",
    //   organization:'Govt. of NCT of Delhi',
    //   testimonial: "Delhi has always been at the forefront of driving innovation in public transport with initiatives such as One Delhi App, Switch Delhi Platform among others. We are proud to launch the Delhi Transport Stack in partnership with JICA as a world-class sustainable transport ecosystem that will serve millions of people and position Delhi among the top 10 cities worldwide for mobility. At its core lies data to power future of mobility, and harness its full potential.",
    // },
    {
      id: 2,
      name: "Mr. Prashant Goyal",
      designation: "Principal Secretary Cum Commissioner,",
      organization: 'Transport Department',
      testimonial: "Delhi Transport Stack marks a significant milestone in serving our 20+ million citizens in Delhi by bringing the best of transport services coupled with data, innovation and partnership. We are excited at the impact it will bring to stakeholders through integrated, efficient and convenient mobility offerings while taking care of data security and compliance. We are committed to the success of Delhi Transport Stack by driving adoption across broader ecosystem i.e. citizens, government agencies, transport operators and startups.",
    },
    {
      id: 3,
      name: "Mr. Takuro Takeuchi",
      designation: "Chief Representative,",
      organization: 'JICA India',
      testimonial: "As one of the largest bilateral development partners with more than 60 years of presence in India, JICA has been actively involved in shaping the country’s mobility landscape, including the ever-growing success of the Delhi Metro. We are now taking a seminal step by launching the Transport Stack initiated in Delhi thus enriching the Japan-India partnership in this digital age.",
    },
    {
      id: 4,
      name: "Ms. Shilpa Shinde",
      designation: "Former Managing Director,",
      organization: 'Delhi Transport Corporation',
      testimonial: "DTC is undergoing its digital transformation journey to enhance our operations and provide better experience to the citizens of Delhi. The introduction of India’s first BeckN protocol-powered bus ticketing developed at the intersection of Transport Stack and ONDC, marks a significant milestone, as it provisions the pre-booking bus tickets, paving the way for integrated ticketing system. The transport operations analytics and dashboard developed under the ambit of Transport Stack represents a significant milestone in Delhi’s bus operations.",
    },
    {
      id: 5,
      name: "Dr. Amit Kumar Jain",
      designation: "Director Operations & Services,",
      organization: 'Delhi Metro Rail Corporation',
      testimonial: "Delhi Metro is at the heart of city’s mobility ecosystem. We extend our complete support to the Transport Stack initiative and have already provided data for development of innovative services for citizens such as Journey planner, integrated ticketing that enables seamless transitions between different modes of transport. We recognize the potential of the Transport Stack to drive innovation and look forward to further collaboration to enhance the citizen experience while gaining insights to improve our overall operations.",
    },
    {
      id: 6,
      name: "Mr. Rakesh Jain",
      designation: "Chief Executive Officer,",
      organization: 'Delhi Integrated Multi-Modal Transit System Limited',
      testimonial: "DIMTS has always been committed to fostering a multi-modal transport ecosystem. We are excited to be part of the inception journey of Transport Stack, a one-of-its-kind initiative in India. Data-driven innovation will shape the future of mobility, and it is crucial for all stakeholders to work together to build a smarter mobility ecosystem. Sharing data across different modes and operators will benefit all stakeholders in their endeavor to provide a safe, reliable, and efficient public transport.",
    },
  ];


  const onClickProduct = (id, type) => {
    if (type === 'DataSet') {
      navigate("data-services/datadetails/" + id);
    } else if (type === 'ServiceSet') {
      navigate("data-services/servicedetails/" + id);
    }
  };

  const getCardsData = (params) => {
    let data = [];
    const fetchCardData = async () => {
      return getFeaturedProducts(params);
    };
    fetchCardData()
      .then((response) => {
        response?.forEach((element) => {
          let provider = [];
          element?.dataProviders?.forEach((e) => {
            provider.push(e.name);
          });
          let searchTags = (element?.resourceSearchTags || [])
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag)
            .slice(0, 3);
          let obj = {
            id: element?.resourceId,
            name: element?.resourceTitle,
            description: element?.resourceDescription,
            ovalCardData: searchTags,
            sub_name:
              element?.providerNames ? element?.providerNames : "",
            titleName:
              element?.resourceTitle + element?.providerNames
                ? " - " + element?.providerNames
                : "",
            type: element?.resourceType,
          };
          data.push(obj);
          setProductData(data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  useEffect(() => {
    let params = "page=0&size=5&sortBy=publishedDate&sortDir=desc";
    getCardsData(params);
  }, [])
  return (
    <div>
      <AddSeo title="Delhi Transport Stack" description="A Digital Public Infrastructure designed to enable next-generation citizen mobility, this initiative aims to seamlessly integrate transportation services and drive the evolution of future mobility solutions, offering a more connected experience" keywords="Transport Stack, Digital Public Infrastructure, MaaS, Mobility as a Service, Smart City, Urban Mobility, Public Transportation, Data Interoperability, API Integration, Digital Transformation" />
      <div className='home-banner'>
        <div className='home-banner__background'>
        </div>
        <div className='home-banner__caption'>
          <h1 className='home-banner__heading'>Welcome to Delhi Transport Stack</h1>
          <p className='home-banner__text'>
            <span>The Transport Department of the Government of the National Capital Territory of Delhi (GNCTD) has introduced the Transport Stack, a Digital Public Infrastructure designed to enable next-generation citizen mobility. This initiative aims to seamlessly integrate transportation services and drive the evolution of future mobility solutions, offering a more connected experience</span>
          </p>
          <div className='button-container'>
            <ButtonComponent type='secondaryWhite' onClick={() => { navigate('aboutus') }}>Know More</ButtonComponent>
          </div>
        </div>
      </div>
      <div className='benefits section-container'>
        <div className='benefits__info'>
          <h2 className='benefits__info--heading'>How everyone benefits from Transport Stack</h2>
          <p className='benefits__info--subheading'>Citizens</p>
          <p className='benefits__info--text'>Experience the convenience of seamlessly integrated journey planning along with access to real-time bus information. From purchasing integrated tickets to leveraging Park & Ride services, elevate your travel experience and enhance your satisfaction with every trip</p>

          <p className='benefits__info--subheading'>Transport Operators</p>
          <p className='benefits__info--text'>Harness the data of diverse customer segments across different transportation modes to
            generate insights and enhance your operational planning and efficiency</p>

          <p className='benefits__info--subheading'>Businesses</p>
          <p className='benefits__info--text'>Utilize our open APIs to expedite app development and launch. Leverage AI/ML to extract
            actionable insights from Transport Stack data, accelerating innovation and reducing
            cost-to-market.</p>

          <p className='benefits__info--subheading'>Government</p>
          <p className='benefits__info--text'>Drive sustainability with reduced vehicular emissions and utilize transport data to
            effectively manage traffic congestion. Enhance transport planning capabilities and
            improve
            disaster response and recovery efforts through data-driven insights</p>
          <div className='button-container justify-content-start'>
            <ButtonComponent type='secondaryWhite' onClick={() => { navigate('howtojoin') }}>How to Join</ButtonComponent>
          </div>
        </div>
        <div className='benefits__img'>
          <p className='benefits__img--text'>Empowering <span className='benefits__img--subtext'>our ecosystem</span></p>
        </div>
      </div>
      <div className='featured-products section-container'>
        <h2 className='section-container__heading'>Featured Products</h2>
        {productData.length > 0 ? <CarouselComponent desktopItems="3" mobileItems="1"
          scrollingStatus={setIsScrolling} autoplay={true}>
          {productData.map((item) => {
            return (
              <div key={item.id} className="p-0 data_cards">
                <Product
                  data={item}
                  onClick={() => {
                    if (!isScrolling) {
                      onClickProduct(item.id, item.type);
                    }
                  }}
                ></Product>
              </div>
            );
          })}
        </CarouselComponent> :
          <ShimmerPostList
            postStyle="STYLE_FOUR"
            col={isMobile ? 1 : 3}
            row={1}
            gap={30}
            imageHeight={180}
          />}
      </div>
      <div className='partners section-container'>
        <h2 className='section-container__heading'>Our Partners</h2>
        <CarouselComponent partialVisible="true" autoplay={true}>
          {partners.map((partner) => {
            return (
              <div key={partner.name} className="carousel-item active">
                <a href={partner.link} target="blank">
                  <img
                    src={partner.img}
                    className="img-fluid"
                    alt={partner.name}
                    draggable="false"
                    style={{ "maxHeight": '239px' }}
                  />
                </a>
              </div>
            );
          })}
        </CarouselComponent>
      </div>
      <div className='usecase section-container'>
        <h2 className='section-container__heading'><span>Discover the Partner Applications here</span></h2>
        <CarouselComponent partialVisible="true" autoplay={true}>
          {usecases.map((usecase) => {
            return (
              <div key={usecase.name} className="carousel-item active">
                <a href={usecase.link} target="blank">
                  <img
                    src={usecase.img}
                    className="img-fluid"
                    alt={usecase.name}
                    draggable="false"
                  />
                  <span>{usecase.name}</span>
                </a>
              </div>
            );
          })}
        </CarouselComponent>
      </div>
      <div className='letshear section-container'>
        <h2 className='section-container__heading'>Let's hear about Transport Stack</h2>
        <CarouselComponent desktopItems='2' mobileItems='1' autoplay={true}>
          {testimonials.map((element) => {
            return (
              <div
                key={element.id}
                className="user-container carousel-item active flex-column align-items-center"
              >
                <div className="user-detail">
                  <span className="user-name">{element.name}</span>
                  <span className="user-profile">
                    {element.designation}<br />
                    {element.organization}
                  </span>
                </div>
                <div className='d-flex double_quotes'>
                  <hr className='horizontal_line' />
                  <img
                    src={doubleQuotes}
                    className="img-fluid"
                    alt="double quotes icon"
                    draggable="false"
                  />
                  <hr className="horizontal_line" />
                </div>
                <span className="user-profile text-center">
                  {element.testimonial}
                </span>
              </div>
            );
          })}

        </CarouselComponent>
      </div >
    </div >
  )
}

export default HomePage
