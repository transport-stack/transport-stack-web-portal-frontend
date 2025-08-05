import React, { Suspense, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../layouts/Loader.js";

const ReportsManagement = () => {
  let navigate = useNavigate();
  const { pathname } = useLocation();
  const defaultTab = pathname.slice(
    pathname.lastIndexOf("/") + 1,
    pathname.length
  );
  const [defaultKey, setDefaultKey] = useState(defaultTab);
  let subTabs = [
    {
      name: "Dashboards",
      key: "dashboards",
    },
    {
      name: "View Reports",
      key: "viewreports",
    },
    {
      name: "Audit Logs",
      key: "auditlogs",
    },
  ];

  useEffect(() => {
    if (defaultKey === "reportsmanagement")
      navigate("/admin/reportsmanagement/dashboards/usermanagementdashboard");
    else if(pathname.includes('dashboards'))setDefaultKey('dashboards')
  }, [defaultKey]);

  const onSelectTab = (tabName) => {
    setDefaultKey(tabName);
    if(tabName==='dashboards')navigate("/admin/reportsmanagement/" + 'dashboards/usermanagementdashboard');
    else navigate("/admin/reportsmanagement/" + tabName);
  };

  
  return (
    <Suspense fallback={<Loader />}>
      <div className="container">
        <Nav variant="pills" activeKey={defaultKey} className="sub-tabs">
          {subTabs.map((item, index) => {
            return (
              <Nav.Item key={item.key}>
                <Nav.Link
                  eventKey={item.key}
                  onClick={() => onSelectTab(item.key)}
                >
                  <div className="d-flex align-items-center">
                    <p className="nav-link_name">{item.name}</p>
                  </div>
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
        <Outlet />
      </div>
    </Suspense>
  );
};

export default ReportsManagement;
