import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import useCheckMobileScreen from "../../hooks/useCheckMobileScreen";
import ButtonComponent from "../common/ui/button/ButtonComponent.js";
import HamburgerMenu from "./HamburgerMenu";
import ProfileMenu from "./ProfileMenu";
import "../../assets/styles/header.scss";
import Profile from "../../assets/images/profile-svgrepo-com1.png";
import Subscriptions from "../../assets/images/magazines-svgrepo-com1.png";
import Requests from "../../assets/images/cloud-sun-svgrepo-com1.png";
import Notifications from "../../assets/images/notifications-svgrepo-com1.png";
import Settings from "../../assets/images/Page-11.png";
import SignOut from "../../assets/images/sign-out-svgrepo-com1.png";
import Polygon from "../../assets/images/Polygon.png";
import burger from "../../assets/images/menu-burger.png";
import NCT_seal from "../../assets/images/delhi_logo.svg";
import transportStackLogo from "../../assets/images/ts-logo-updated.png";
import bell from "../../assets/images/bell.png";
// import logo from "../../assets/images/logo.png";


const Header = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, profile, accessToken } = useSelector((state) => state.auth.user);
    const { newNotification } = useSelector((state) => state.notifications);
    const [profileName, setProfileName] = useState('');
    const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const mobileScreenSize = useCheckMobileScreen();
    const menuList = [
        { name: "Home", path: "/" },
        { name: "About us", path: "/aboutus" },
        { name: "Data & Services", path: "/data-services" },
        { name: "Resources", path: "/resources" },
        { name: "Innovation Challenge", path: "/innovationchallenge" },
        { name: "Media", path: "/media" },
        { name: "Help & Support", path: "/help-support" },
    ];
    const ProfileList = [
        { name: "My Profile", icon: Profile, path: "/account/myprofile" },
        { name: "My Subscriptions", icon: Subscriptions, path: "/account/mysubscriptions" },
        { name: "My Requests", icon: Requests, path: "/account/myrequests" },
        { name: "My Notifications", icon: Notifications, path: "/account/mynotifications" },
        { name: "Settings", icon: Settings, path: "/account/settings" },
        { name: "Sign Out", icon: SignOut, path: "" },
    ];

    const handleSignout = () => {
        dispatch({ type: 'auth/userLogoutRequest', payload: { accessToken: accessToken } })
    }

    const onChangePage = () => {
        localStorage.removeItem('dataService-tab-key');
    }

    useEffect(() => {
        let profileText = '';
        if (profile?.firstName) {
            if (profile?.lastName) {
                profileText = profile?.firstName[0]?.toUpperCase() + profile?.lastName[0]?.toUpperCase();
            } else {
                profileText = profile?.firstName[0]?.toUpperCase() + profile?.firstName[1]?.toUpperCase()
            }
        } else if (profile?.username) {
            profileText = profile?.username[0]?.toUpperCase() + profile?.username[1]?.toUpperCase()
        }
        setProfileName(profileText);
    }, [profile])

    return (
        <header className="header-content">
            <span className='header_logos d-flex'>
                <img src={NCT_seal} className="NCT_seal img" alt="NCT seal logo" />
                <NavLink to="/" >
                    <img src={transportStackLogo} className="transportStackLogo img" alt="transport Stack logo" />
                </NavLink>
            </span>
            {/* <NavLink to="/" className='logo'>
                <img src={logo} className="logo img" alt="header logo" />
            </NavLink> */}
            {/* <NavLink to="/" className='transportStackLogo'>
                <img src={transportStackLogo} className="transportStackLogo img" alt="transport Stack logo" />
            </NavLink> */}
            
            <nav className="HeaderNav header-list">
                <ul className="text-base list-none d-flex justify-between list-unstyled" onClick={() => onChangePage()}>
                    {menuList.map((item) => {
                        return (
                            <li key={item.name} className="p-3">
                                <NavLink to={item.path}>
                                    {item.name}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            <div className="d-flex align-items-center">
                {isAuthenticated ? (
                    <div className="ps-3 userName-header">
                        <div className="d-flex float-right align-items-center">
                            {newNotification ? <span className="bell-indicator"></span> : ''}
                            <span
                                className="d-flex align-items-center justify-content-center pe-3"
                                id="bell-container"
                                onClick={() => {
                                    navigate("/account/mynotifications");
                                }}
                            >
                                <img
                                    src={bell}
                                    className="bell-icon cursor-pointer"
                                    alt="notification bell icon"
                                />
                            </span>
                            {mobileScreenSize ? (
                                <span
                                    className="d-flex align-items-center cursor-pointer userName justify-content-center"
                                    onClick={() => {
                                        setShowProfileMenu(true);
                                    }}
                                >
                                    {profileName}
                                    <img
                                        src={Polygon}
                                        className="ms-2"
                                        alt="down arrow for username"
                                    />
                                </span>
                            ) : (
                                <DropdownButton title={profileName} className="user-drop">
                                    {ProfileList.map((item, index) => {
                                        return (
                                            item.name.toLowerCase() === 'sign out' ?
                                                (<Dropdown.Item key={item.name} onClick={() => handleSignout()}> 
                                                    <img src={item.icon} alt={item.name} /> 
                                                    <span>{item.name}</span> 
                                                </Dropdown.Item>) :
                                                (<Dropdown.Item key={item.name} onClick={() => navigate(item.path)}>
                                                    <img src={item.icon} alt={item.name} />
                                                    {item.name}
                                                </Dropdown.Item>)
                                        );
                                    })}
                                </DropdownButton>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column" id="login-btn">
                        <ButtonComponent type='primaryBlue' onClick={() => { navigate('signin') }} className='mb-2'>Sign in</ButtonComponent>
                        <ButtonComponent type='primaryWhite' onClick={() => { navigate('register') }}>Register</ButtonComponent>
                    </div>
                )}
                <div className="hamburger-icon ps-3">
                    <img
                        src={burger}
                        className="max-w-28 cursor-pointer max-h-28"
                        onClick={() => {
                            setShowHamburgerMenu(true);
                        }}
                        alt="hamburger-icon"
                    />
                </div>
            </div>
            {showHamburgerMenu ? (
                <HamburgerMenu
                    setShowHamburgerMenu={setShowHamburgerMenu}
                    userLogged={isAuthenticated}
                ></HamburgerMenu>
            ) : null}
            {showProfileMenu ? (
                <ProfileMenu setProfileMenu={setShowProfileMenu}></ProfileMenu>
            ) : null}
        </header>
    );
};
export default Header;
