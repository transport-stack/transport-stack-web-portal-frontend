import React from "react";
import FooterLogo from "../../assets/images/transportStackWhite.png";
import pdf from "../../assets/images/pdf-img.png";
import FacebookIcon from "../../assets/images/facebook-icon.svg";
import LinkedinIcon from "../../assets/images/linkedin-icon.svg";
import TwitterIcon from "../../assets/images/twitter-Icons.svg";
import InstagramIcon from "../../assets/images/instagram-icon.svg";
import { NavLink } from "react-router-dom";
import "../../assets/styles/footer.scss";

const Footer = () => {
  const links = [
    { name: "About Us", path: "/aboutus" },
    { name: "Data & Services", path: "/data-services" },
    { name: "How to Join", path: "/howtojoin" },
    { name: "Resources", path: "/resources" },
    { name: "Media", path: "/media" },
    { name: "Help & Support", path: "/help-support" },
  ];
  const legal = [
    { name: "Terms of Use", path: "/termsofuse" },
    { name: "Cookie Policy", path: "/cookiepolicy" },
    { name: "Privacy Policy", path: "/privacypolicy" },
  ];
  const social = [
    { name: "facebook", icon: FacebookIcon, link: "#" },
    { name: "linkedin", icon: LinkedinIcon, link: "#" },
    { name: "twitter", icon: TwitterIcon, link: "#" },
    { name: "instagram", icon: InstagramIcon, link: "#" },
  ];

  const handleDownload = () => {
    window.open('https://dts-portal-assets.s3.ap-south-1.amazonaws.com/Transport+Stack+JICA+BCG.pdf', '_blank');
  }

  return (
    <footer>
      <div className="Footer-1  p-5 text-white">
        <div className="d-flex container">
          <img src={pdf} alt="pdf Logo" className="w-44 h-auto" />
          <div className="ps-3">
            <p className="mb-2">Transport Stack Concept Note</p>
            <button className="button-secondary" onClick={handleDownload}>Download</button>
          </div>
        </div>
      </div>
      <div className="Footer-2 min-h-[380px] p-5 pb-0 text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-5 d-flex align-items-center content-1" id="mobile-view">
              <img src={FooterLogo} alt="footer Logo" className="footer-Logo" />
            </div>
            <div className="col-md-7 col-sm-12 pe-0 content-2">
              <div className="d-flex justify-content-evenly" id="footer-links">
                <div className="links-list" id="mobile-view">
                  <p className="text-sm fw-bold">Links</p>
                  <ul className="list-unstyled">
                    {links.map((item, index) => {
                      return (
                        <li key={item.name} className="text-[13px] py-1">
                          <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="legal-list">
                  <p className="text-sm fw-bold">Legal</p>
                  <ul className="list-unstyled">
                    {legal.map((item, index) => {
                      return (
                        <li key={item.name} className="text-[13px] py-1">
                          <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-4 mb-8 " id="mobile-view"></hr>
          <div className="d-flex justify-content-end pt-3 pb-0" id="copyRight">
            <p className="font-sm footer-text">
              This website is managed by <a href="https://transport.delhi.gov.in/" target="blank">Transport Department, Government of National
                Capital Territory of Delhi</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
