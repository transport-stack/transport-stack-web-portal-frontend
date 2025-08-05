import React from "react";
import "./ButtonComponent.scss";
const ButtonComponent = ({ children, onClick, type, className='', ...props }) => {
    return (
        <button
            onClick={onClick}
            {...props}
            className={type ? "buttonComponent " + className + " " + type : "buttonComponent " + className}
        >
            {children}
        </button>
    );
};

export default ButtonComponent;
