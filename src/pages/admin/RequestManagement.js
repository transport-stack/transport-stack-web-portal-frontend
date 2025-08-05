import React, { Suspense, useState } from "react";
import { Nav } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../layouts/Loader.js";
import {useSelector} from "react-redux";

const RequestManagement = () => {
  let defaultTab = '';
  let tab = '';
  let subTabs = [
    {
      name: "Data Sets Request",
      key: "datasetsrequestmanagement",
    },
    {
      name: "Service Request",
      key: "servicerequestmanagement",
    },
    {
      name: "Registration Request",
      key: "registrationrequestmanagement",
    },
    {
      name: "Data Sets Update Request",
      key: "datasetsupdaterequestmanagement",
    },
    {
      name: "Service Update Request",
      key: "serviceupdaterequestmanagement",
    },
  ];

  let navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useSelector((state) => state.auth.admin);

  const pathnames = pathname.split('/');
  if (pathnames.length > 3) {
    defaultTab = pathnames[3];
  } else {
    defaultTab = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
  }

  if (defaultTab === 'viewdatasetrequest') {
    tab = 'datasetsrequestmanagement'
  } else if (defaultTab === 'viewservicesetrequest') {
    tab = 'servicerequestmanagement'
  } else {
    tab = defaultTab;
  }

  const [defaultKey, setDefaultKey] = useState(tab);

  const onSelectTab = (tabName) => {
    setDefaultKey(tabName);
    navigate("/admin/requestmanagement/" + tabName);
  };

  const filteredSubTabs = role.includes('ROLE_SUPER_ADMIN')
    ? subTabs
    : subTabs.filter(
      tab => tab.key !== "datasetsupdaterequestmanagement" && tab.key !== "serviceupdaterequestmanagement"
    );

  return (
    <Suspense fallback={<Loader />}>
      <div className="container">
        <Nav variant="pills" activeKey={defaultKey} className="sub-tabs">
          {role && filteredSubTabs.map((item, index) => {
            return (
              <Nav.Item key={item.key}>
                <Nav.Link
                  eventKey={item.key}
                  onClick={() => onSelectTab(item.key)}
                >
                  <div className="d-flex align-items-center">
                    <p className="nav-link_name">
                      {item.name}
                      {role.includes('ROLE_SUPER_ADMIN') && <br />}
                      {" Management"}
                    </p>
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

export default RequestManagement;
