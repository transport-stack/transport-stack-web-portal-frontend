import React, { Suspense, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../layouts/Loader.js";
const DataServiceManagement = () => {
  let defaultTab = '';
  let tab = '';
  let subTabs = [
    {
      name: "Data Listing Management",
      key: "datasetlisting",
    },
    {
      name: "Service Listing Management",
      key: "servicelisting",
    },
  ];
  let navigate = useNavigate();
  const { pathname } = useLocation();
  const pathnames = pathname.split('/');
  if (pathnames.length > 3) {
    defaultTab = pathnames[3];
  } else {
    defaultTab = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
  }
  
  if (defaultTab === 'dataservicemanagement' || defaultTab === 'createnewdataset' || defaultTab === 'editdataset' || defaultTab === 'viewdataset') {
    tab = 'datasetlisting'
  } else if (defaultTab === 'createnewservice' || defaultTab === 'viewserviceset' || defaultTab === 'editserviceset') {
    tab = 'servicelisting'
  } else {
    tab = defaultTab;
  }
  
  const [defaultKey, setDefaultKey] = useState(tab);
  
  useEffect(() => {
    if (defaultKey === 'createnewdataset') {
      navigate('/admin/dataservicemanagement/createnewdataset')
    } else if (defaultKey === 'createnewservice') {
      navigate('/admin/dataservicemanagement/createnewservice')
    }
  }, [defaultKey]);
  
  const onSelectTab = (tabName) => {
    setDefaultKey(tabName);
    navigate("/admin/dataservicemanagement/" + tabName);
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

export default DataServiceManagement;