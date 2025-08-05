import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "../components/admin/Header";
import Footer from "../components/admin/Footer";
import Loader from "./Loader";
import "../assets/styles/adminLayout.scss";

const AdminLayoutComponent = ({ hideHeaderPaths = [] }) => {
  const { pathname } = useLocation();

  return (
    <div>
      {!hideHeaderPaths.includes(pathname) && <Header />}
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

AdminLayoutComponent.propTypes = {
  hideHeaderPaths: PropTypes.arrayOf(PropTypes.string),
};

export default AdminLayoutComponent;
