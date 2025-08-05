import React, { Suspense, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Loader from "../../../../layouts/Loader.js";
import "../../../../assets/styles/dashboard.scss";
import UserManagementActiveIcon from "../../../../assets/images/adminTabIcons/userManagementDbrdActive.png";
import UserManagementInActiveIcon from "../../../../assets/images/adminTabIcons/userManagementDbrdInactive.png";
import serviceCatalogueActiveIcon from "../../../../assets/images/adminTabIcons/serviceCatelogDbrdActive.png";
import serviceCatalogueInActiveIcon from "../../../../assets/images/adminTabIcons/serviceCatelogDbrdInactive.png";
import dataCatalogueActiveIcon from "../../../../assets/images/adminTabIcons/dataCatelogDbrdActive.png";
import dataCatalogueInActiveIcon from "../../../../assets/images/adminTabIcons/dataCatelogDbrdInactive.png";
import requestManagementActiveIcon from "../../../../assets/images/adminTabIcons/requestMngDbrdActive.png";
import requestManagementInActiveIcon from "../../../../assets/images/adminTabIcons/requestMngDbrdInactive.png";
import helpSupportActiveIcon from "../../../../assets/images/adminTabIcons/helpSupportDbrdActive.png";
import helpSupportInActiveIcon from "../../../../assets/images/adminTabIcons/helpSupportDbrdInactive.png";
import useCasesActiveIcon from "../../../../assets/images/adminTabIcons/useCasesActive.png";
import useCasesInActiveIcon from "../../../../assets/images/adminTabIcons/useCasesInactive.png";

const Dashboard = () => {
  let navigate = useNavigate();
  const { pathname } = useLocation();
  const defaultTab = pathname.slice(
    pathname.lastIndexOf("/") + 1,
    pathname.length
  );
  const [defaultKey, setDefaultKey] = useState(defaultTab);
  let subTabs = [
    {
      name: "User Management Dashboard",
      key: "usermanagementdashboard",
      iconInactive: UserManagementInActiveIcon,
      iconActive: UserManagementActiveIcon,
    },
    {
      name: "Data Catalogue Dashboard",
      key: "datacataloguedashboard",
      iconInactive: dataCatalogueInActiveIcon,
      iconActive: dataCatalogueActiveIcon,
    },
    {
      name: "Service Catalogue Dashboard",
      key: "servicecataloguedashboard",
      iconInactive: serviceCatalogueInActiveIcon,
      iconActive: serviceCatalogueActiveIcon,
    },
    {
      name: "Request Management Dashboard",
      key: "requestmanagementdashboard",
      iconInactive: requestManagementInActiveIcon,
      iconActive: requestManagementActiveIcon,
    },
    {
      name: "Help & Support Dashboard",
      key: "helpsupportdashboard",
      iconInactive: helpSupportInActiveIcon,
      iconActive: helpSupportActiveIcon,
    },
    // {
    //   name: "User Activity Dashboard",
    //   key: "useractivitydashboard",
    //   iconInactive: UserManagementActiveIcon,
    //   iconActive: UserManagementInActiveIcon,
    // },
    {
      name: "Use-cases",
      key: "usecases",
      iconInactive: useCasesInActiveIcon,
      iconActive: useCasesActiveIcon,
    },
  ];
  
  useEffect(() => {
    if (defaultKey === "reportsmanagement")
      navigate("/admin/reportsmanagement/dashboards/usermanagementdashboard");
  }, [defaultKey]);

  const onSelectTab = (tabName) => {
    setDefaultKey(tabName);
    navigate("/admin/reportsmanagement/dashboards/" + tabName);
  };
  
  return (
    <div className="dashboard">
      <Suspense fallback={<Loader />}>
        <div className="d-flex">
          <Nav variant="pills" activeKey={defaultKey} className="sub-tabs">
            {subTabs.map((item, index) => {
              return (
                <Nav.Item key={item.key}>
                  <Nav.Link
                    eventKey={item.key}
                    onClick={() => onSelectTab(item.key)}
                    className="d-flex"
                  >
                    <div className="d-flex align-items-center">
                      <span className="dashboard_outer_image">
                        {defaultKey === item.key ? (
                          <Image src={item.iconActive} alt={item.name} fluid />
                        ) : (
                          <Image
                            src={item.iconInactive}
                            alt={item.name}
                            fluid
                          />
                        )}
                      </span>
                      <p className="nav-link_name">{item.name}</p>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
          <div className="outlet">
            <Outlet />
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Dashboard;
