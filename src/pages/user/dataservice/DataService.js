import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Breadcrumb from "../../../components/user/ui/Breadcrumb/Breadcrumb";
import useCheckMobileScreen from "../../../hooks/useCheckMobileScreen";
import DataCatalogue from "../datacatalogue/DataCatalogue";
import ServiceCatalogue from "../servicecatalogue/ServiceCatalogue";
import BannerTitle from "../../../components/user/ui/BannerTitle/BannerTitle";
import AddSeo from "../../../utils/AddSeo";
import "../../../assets/styles/dataservice.scss";

const DataService = () => {
  const isMobile = useCheckMobileScreen();
  const [tabKey, setTabKey] = useState(
    localStorage.getItem("dataService-tab-key")
      ? localStorage.getItem("dataService-tab-key")
      : "data"
  );
  const [bannerName, setBannerName] = useState(
    localStorage.getItem("dataService-tab-key")
      ? localStorage.getItem("dataService-tab-key") + "banner"
      : "data" + "banner"
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onClickTab = (e) => {
    setBannerName(e + "banner");
    setTabKey(e)
    localStorage.setItem("dataService-tab-key", e);
  };

  return (
    <div className={"dataservice " + bannerName}>
      <AddSeo
        title="Data & Services : Delhi Transport Stack"
        description="Unlock Delhi's Transport Data & Services. Explore APIs, open data sets, and services for seamless integration and innovation."
        keywords="Delhi Transport Data, Transport Data API, Open Data, Data Services, API Integration, Data Sharing, Data Standards, Transport Stack Data, Mobility Data, Public Transport Data, Real-time Data, Historical Data, Data Analytics, Data Visualization"
      />
      <div className="dataservice__banner">
        <div className="container">
          {isMobile ? null : <Breadcrumb />}
          <BannerTitle title='Data & Services'></BannerTitle>
        </div>
      </div>
      <div className="dataservice__btns container">
        <Tabs
          defaultActiveKey={tabKey}
          onSelect={(e) => {
            onClickTab(e);
          }}
        >
          <Tab eventKey="data" title="Data">
            {tabKey === 'data' ? <DataCatalogue></DataCatalogue> : null}
          </Tab>
          <Tab eventKey="services" title="Services">
            {tabKey === 'services' ? <ServiceCatalogue></ServiceCatalogue> : null}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default DataService;
