import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
if (['development', 'qa'].includes(process.env.REACT_APP_ENV)) {
    const metaTag = document.createElement("meta");
    metaTag.name = "robots";
    metaTag.content = "noindex";
    document.head.appendChild(metaTag);
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

