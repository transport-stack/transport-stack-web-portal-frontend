import React, { Suspense, useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useReactGa from "../hooks/useReactGa";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import SearchBar from "../components/user/SearchBar";
import Loader from "./Loader";

const LayoutComponent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [legalPage, setLegalPage] = useState(false);
  const userData = useSelector((state) => state.auth.user);
  useReactGa();
  useEffect(() => {
    if (userData.profile?.id) {
      const data = {
        id: userData.profile?.id,
        accessToken: userData.accessToken
      };
      dispatch({ type: "checkNewNotificationStatus", payload: data });
    }
    let path = location.pathname;
    if (
      path === "/termsofuse" ||
      path === "/cookiepolicy" ||
      path === "/privacypolicy"
    )
      setLegalPage(true);
    else setLegalPage(false);
  }, [location]);

  return (
    <div>
      <Header />
      {legalPage ? null : <SearchBar />}
      <main className="Main">
        <Suspense fallback={<Loader />}>
          <ScrollRestoration />
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default LayoutComponent;