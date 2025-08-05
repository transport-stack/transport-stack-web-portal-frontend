import React from 'react'
import { Spinner } from "react-bootstrap";
import "./LoaderComponent.scss";

const FallbackLoader = () => {
    return (
        <div className="overlay">
            <Spinner animation="border" variant="dark" />
            <div className="overlay-text">Loading...</div>
        </div>
    )
}

export default FallbackLoader
