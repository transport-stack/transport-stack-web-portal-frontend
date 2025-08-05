import React from "react";
import { Spinner } from "react-bootstrap";
import "./LoaderComponent.scss";
import { useSelector } from "react-redux";

const LoaderComponent = () => {
  const activeRequests = useSelector((state) => state.loader.activeRequests);
  if (activeRequests === 0) return null;
  return (
    <div className="overlay">
      <Spinner animation="border" variant="dark" />
      {/* <div className="overlay-text">Loading...</div> */}
    </div>
  );
};

export default LoaderComponent;
