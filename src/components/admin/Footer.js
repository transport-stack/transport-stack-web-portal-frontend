import React from "react";
import FooterLogo from "../../assets/images/transportStackWhite.png";
import { NavLink } from "react-router-dom";
import "../../assets/styles/footer.scss";

const Footer = () => {

    const legal = [
        { name: "Terms of Use", path: "./termsofuse" },
        { name: "Cookie Policy", path: "./cookiepolicy" },
        { name: "Privacy Policy", path: "./privacypolicy" },
    ];

    return (
        <footer>
            <div className="Footer-2 min-h-[380px] p-5 pb-0 text-white">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5 d-flex align-items-center content-1" id="mobile-view">
                            <img src={FooterLogo} alt="footer Logo" className="footer-Logo" />
                        </div>
                        <div className="col-md-7 col-sm-12 pe-0 content-2">
                            <div className="d-flex justify-content-end" id="footer-links">
                                <div className="legal-list" style={{ marginRight: "96px" }}>
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
