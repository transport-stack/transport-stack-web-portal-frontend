import React, {useEffect} from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import {getApiDoc} from "../../services/apiservices";

const SwaggerComponent = () => {

  const [swaggerSpec, setSwaggerSpec] = React.useState(null);

  useEffect(() => {
    const fetchSwaggerSpec = async () => {
      return getApiDoc();
    }
    fetchSwaggerSpec().then(response => {
      response.servers = [
        { url: "http://13.233.123.19", description: "QA API Server" },
      ];
      setSwaggerSpec(response);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return <SwaggerUI spec={swaggerSpec} />;
};

export default SwaggerComponent;
