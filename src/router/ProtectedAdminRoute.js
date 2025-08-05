import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/admin/Header";
import Footer from "../components/admin/Footer";
import Loader from "../layouts/Loader";
import "../assets/styles/adminLayout.scss";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import AdminManagementActiveIcon from '../assets/images/adminTabIcons/Admin-active.svg';
import AdminManagementInActiveIcon from '../assets/images/adminTabIcons/Admin-inactive.svg';
import UserManagementActiveIcon from '../assets/images/adminTabIcons/User_management1.png';
import UserManagementInActiveIcon from '../assets/images/adminTabIcons/User_management2.png';
import DataServiceManagementActiveIcon from '../assets/images/adminTabIcons/Datasets_service_managment1.png';
import DataServiceManagementInActiveIcon from '../assets/images/adminTabIcons/Datasets_service_managment2.png';
import RequestManagementActiveIcon from '../assets/images/adminTabIcons/Request_Managment1.png';
import RequestManagementInActiveIcon from '../assets/images/adminTabIcons/Request_Managment2.png';
import DocumentManagementActiveIcon from '../assets/images/adminTabIcons/Document_Management1.png';
import DocumentManagementInActiveIcon from '../assets/images/adminTabIcons/Document_Management2.png';
import ReportsManagementActiveIcon from '../assets/images/adminTabIcons/Reports_Management1.png';
import ReportsManagementInActiveIcon from '../assets/images/adminTabIcons/Reports_management2.png';
import HelpSupportActiveIcon from '../assets/images/adminTabIcons/Help_Support1.png';
import HelpSupportInActiveIcon from '../assets/images/adminTabIcons/Help_Support2.png';
import { useSelector } from "react-redux";

const ProtectedAdminRoute = () => {
    const { isAuthenticated, role } = useSelector((state) => state.auth.admin);
    let navigate = useNavigate();
    const { pathname } = useLocation();
    const pathnames = pathname.split("/");
    let defaultTab = '';
    if (pathnames.length > 3) {
        defaultTab = pathnames[2];
    } else {
        defaultTab = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
    }
    const [defaultKey, setDefaultKey] = useState(defaultTab);

    const superAdminHeaderTabs = [
        {
            name: "Admin Management",
            key: "adminmanagement",
            iconInactive: AdminManagementActiveIcon,
            iconActive: AdminManagementInActiveIcon,
        },
        {
            name: "User Management",
            key: "usermanagement",
            iconInactive: UserManagementActiveIcon,
            iconActive: UserManagementInActiveIcon,
        },
        {
            name: "Data Sets/ Service Management",
            key: "dataservicemanagement",
            iconInactive: DataServiceManagementActiveIcon,
            iconActive: DataServiceManagementInActiveIcon,
        },
        {
            name: "Request Management",
            key: "requestmanagement",
            iconInactive: RequestManagementActiveIcon,
            iconActive: RequestManagementInActiveIcon,
        },
        {
            name: "Document Management",
            key: "documentmanagement",
            iconInactive: DocumentManagementActiveIcon,
            iconActive: DocumentManagementInActiveIcon,
        },
        {
            name: "Reports Management",
            key: "reportsmanagement",
            iconInactive: ReportsManagementActiveIcon,
            iconActive: ReportsManagementInActiveIcon,
        },
        {
            name: "Help & Support",
            key: "helpsupport",
            iconInactive: HelpSupportActiveIcon,
            iconActive: HelpSupportInActiveIcon,
        },
    ];
    const adminHeaderTabs = [
        {
            name: "User Management",
            key: "usermanagement",
            iconInactive: UserManagementActiveIcon,
            iconActive: UserManagementInActiveIcon,
        },
        {
            name: "Data Sets/ Service Management",
            key: "dataservicemanagement",
            iconInactive: DataServiceManagementActiveIcon,
            iconActive: DataServiceManagementInActiveIcon,
        },
        {
            name: "Request Management",
            key: "requestmanagement",
            iconInactive: RequestManagementActiveIcon,
            iconActive: RequestManagementInActiveIcon,
        },
        {
            name: "Document Management",
            key: "documentmanagement",
            iconInactive: DocumentManagementActiveIcon,
            iconActive: DocumentManagementInActiveIcon,
        },
        {
            name: "Reports Management",
            key: "reportsmanagement",
            iconInactive: ReportsManagementActiveIcon,
            iconActive: ReportsManagementInActiveIcon,
        },
        {
            name: "Help & Support",
            key: "helpsupport",
            iconInactive: HelpSupportActiveIcon,
            iconActive: HelpSupportInActiveIcon,
        },
    ];
    const dataProviderHeaderTabs = [
        {
            name: "Data Sets/ Service Management",
            key: "dataservicemanagement",
            iconInactive: DataServiceManagementActiveIcon,
            iconActive: DataServiceManagementInActiveIcon,
        },
        {
            name: "Request Management",
            key: "requestmanagement",
            iconInactive: RequestManagementActiveIcon,
            iconActive: RequestManagementInActiveIcon,
        },
        {
          name: "Reports Management",
          key: "reportsmanagement",
          iconInactive: ReportsManagementActiveIcon,
          iconActive: ReportsManagementInActiveIcon,
        },
    ];

    const onSelectTab = (tabName) => {
        setDefaultKey(tabName);
        if (tabName === 'dataservicemanagement') {
            navigate('/admin/dataservicemanagement/datasetlisting')
        } else if (tabName === 'requestmanagement') {
            navigate('/admin/requestmanagement/datasetsrequestmanagement')
        }
        else if (tabName === 'reportsmanagement') {
            navigate('/admin/reportsmanagement/dashboards/usermanagementdashboard')
        } else {
            navigate("/admin/" + tabName);
        }
    };

    useEffect(() => {
        if (defaultKey === 'datasetlisting') {
            navigate('/admin/dataservicemanagement/datasetlisting')
        }   
    }, [defaultKey]);

    useEffect(() => {
        if (pathname.includes("usermanagement") && !pathname.includes("usermanagementdashboard")) {
            setDefaultKey("usermanagement");
        }
        if (pathname.includes("adminmanagement") && !role.includes('ROLE_SUPER_ADMIN')) {
            navigate('/admin/signin')
        }
        if (role?.includes('ROLE_DATA_PROVIDER')) {
          if(
            !pathname.includes("requestmanagement")  &&
            !pathname.includes("dataservicemanagement") &&
            !pathname.includes("reportsmanagement") &&
            !pathname.includes("notifications")
          ) {
                navigate('/admin/signin')
          }
        }
        if(pathname.includes('notifications'))setDefaultKey('')
    }, [pathname]);

    // Check if the user is authenticated
    if (!isAuthenticated) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/admin/signin" />;
    }
    // If authenticated, render the child routes
    return (
        <div>
            <Header />
            <main className="Main">
                <Suspense fallback={<Loader />}>
                    <ScrollRestoration />

                    <div className="admin-tabs container">
                        <Nav
                            variant="pills"
                            activeKey={defaultKey}
                            className={role?.includes('ROLE_SUPER_ADMIN')?"d-flex justify-content-between main-tabs":"main-tabs"}
                        >
                            {role?.includes('ROLE_SUPER_ADMIN') &&
                                superAdminHeaderTabs.map((item, index) => {
                                    return (
                                        <Nav.Item key={item.key}>
                                            <Nav.Link
                                                eventKey={item.key}
                                                onClick={() => onSelectTab(item.key)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    {defaultKey === item.key ? (
                                                        <Image
                                                            src={item.iconInactive}
                                                            alt={item.name}
                                                            fluid
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={item.iconActive}
                                                            alt={item.name}
                                                            fluid
                                                        />
                                                    )}
                                                    <p id={item.key==='dataservicemanagement'?'long_text':''} className="nav-link_name admin_names">{item.name}</p>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })
                            }

                            {role?.includes('ROLE_ADMIN') &&
                                adminHeaderTabs.map((item, index) => {
                                    return (
                                        <Nav.Item key={item.key}>
                                            <Nav.Link
                                                eventKey={item.key}
                                                onClick={() => onSelectTab(item.key)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    {defaultKey === item.key ? (
                                                        <Image
                                                            src={item.iconInactive}
                                                            alt={item.name}
                                                            fluid
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={item.iconActive}
                                                            alt={item.name}
                                                            fluid
                                                        />
                                                    )}
                                                    <p className="nav-link_name">{item.name}</p>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })
                            }

                            {role?.includes('ROLE_DATA_PROVIDER') &&
                                dataProviderHeaderTabs.map((item, index) => {
                                    return (
                                        <Nav.Item key={item.key}>
                                            <Nav.Link
                                                eventKey={item.key}
                                                onClick={() => onSelectTab(item.key)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    {defaultKey === item.key ? (
                                                        <Image
                                                            src={item.iconInactive}
                                                            alt={item.name}
                                                            fluid
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={item.iconActive}
                                                            alt={item.name}
                                                            fluid
                                                        />
                                                    )}
                                                    <p className="nav-link_name">{item.name}</p>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })
                            }
                        </Nav>
                        <Outlet />
                    </div>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default ProtectedAdminRoute
