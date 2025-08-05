import { useEffect } from "react";
import { useSelector } from "react-redux";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";
const useReactGa = () => {
  const { cookiesMeasureStatus } = useSelector((state) => state.cookies);
  const location = useLocation();
  const trackingRoutes = [
    { path: "/", title: "home" },
    { path: "/aboutus", title: "About us" },
    { path: "/data-services", title: "Data and Services" },
    { path: "/data-services/datadetails", title: "Data details" },
    { path: "/data-services/servicedetails", title: "Service details" },
    { path: "/howtojoin", title: "How to Join" },
    { path: "/resources", title: "Resources" },
    { path: "/innovationchallenge", title: "Innovation Challenge" },
    { path: "/resources/boardingpolicy", title: "Onboarding Policies" },
    { path: "/resources/marketingresource", title: "Marketing Resources" },
    { path: "/resources/techresource", title: "Technical Resources" },
    { path: "/resources/usersupport", title: "User Support" },
    { path: "/media", title: "Media" },
    { path: "/help-support", title: "Help & Support" },
    { path: "/signin", title: "Signin" },
    { path: "/register", title: "Register" },
    { path: "/forgotpassword", title: "Forgot password" },
    { path: "/termsofuse", title: "Terms of use" },
    { path: "/cookiepolicy", title: "Cookie Policy" },
    { path: "/privacypolicy", title: "Privacy Policy" },
  ];
  useEffect(() => {
    trackingRoutes.forEach((element) => {
      if (
        (location.pathname === element.path ||
          location.pathname.includes("datadetails") ||
          location.pathname.includes("servicedetails")) &&
        cookiesMeasureStatus &&
        !location.pathname.includes("admin")
      ) {
        ReactGA.send({
          hitType: "pageview",
          page: location.pathname,
          title: element.title,
        });
      }
    });
  }, [location]);
};

export default useReactGa;
