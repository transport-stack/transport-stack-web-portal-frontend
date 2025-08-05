import React from "react";
import { createBrowserRouter, Link, Navigate, Outlet, RouterProvider } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import LayoutComponent from "../layouts/LayoutComponent";
import AdminLayoutComponent from "../layouts/AdminLayoutComponent";
import { ProtectedRoute } from "./ProtectedRoute.js";
import ProtectedAdminRoute from "./ProtectedAdminRoute.js";
import { useSelector } from "react-redux";

const DataServiceNavigation = React.lazy(() =>
  import("../pages/user/dataservice/DataServiceNavigation.js")
);
const ViewHelpQuery = React.lazy(() =>
  import("../pages/admin/ViewHelpQuery.js")
);
const ViewDocument = React.lazy(() =>
  import("../pages/admin/document/ViewDocument.js")
);
const CreateDocument = React.lazy(() =>
  import("../pages/admin/document/CreateDocument.js")
);
const EditDocument = React.lazy(() =>
  import("../pages/admin/document/EditDocument.js")
);
const EditDataSet = React.lazy(() =>
  import("../pages/admin/datasets/EditDataSet.js")
);
const EditService = React.lazy(() =>
  import("../pages/admin/service/EditService.js")
);
const AddDataSet = React.lazy(() =>
  import("../pages/admin/datasets/AddDataSet.js")
);
const ServiceListingManagement = React.lazy(() =>
  import("../pages/admin/service/ServiceListingManagement.js")
);
const DataListingManagement = React.lazy(() =>
  import("../pages/admin/datasets/DataListingManagement.js")
);
const EmailVerification = React.lazy(() =>
  import("../pages/user/authentication/EmailVerification.js")
);
const MobileVerification = React.lazy(() =>
  import("../pages/user/authentication/MobileVerification.js")
);
const Resources = React.lazy(() => import("../pages/user/Resources.js"));
const Media = React.lazy(() => import("../pages/user/media/Media.js"));
const UnlockingTransportData = React.lazy(() =>
  import("../pages/user/media/articles/UnlockingTransportData.js")
);
const HowToJoin = React.lazy(() => import("../pages/user/HowToJoin.js"));
const AboutUs = React.lazy(() => import("../pages/user/AboutUs.js"));
const InnovationChallenge = React.lazy(() => import("../pages/user/InnovationChallenge.js"));
const CookiePolicy = React.lazy(() => import("../pages/user/legal/CookiePolicy.js"));
const PolicyDocument = React.lazy(() => import("../pages/user/legal/PolicyDocument.js"));
const TermsOfUse = React.lazy(() => import("../pages/user/legal/TermsOfUse.js"));
const SignIn = React.lazy(() => import("../pages/user/authentication/SignIn.js"));
const Register = React.lazy(() => import("../pages/user/authentication/Register.js"));
const DataService = React.lazy(() => import("../pages/user/dataservice/DataService.js"));
const DataDetails = React.lazy(() => import("../pages/user/datacatalogue/DataDetails.js"));
const ServiceDetails = React.lazy(() => import("../pages/user/servicecatalogue/ServiceDetails.js"));
const Account = React.lazy(() => import("../pages/user/account/Account.js"));
const Settings = React.lazy(() => import("../pages/user/account/Settings.js"));
const MyNotifications = React.lazy(() => import("../pages/user/account/MyNotifications.js"));
const ChangePassword = React.lazy(() => import("../pages/user/account/ChangePassword.js"));
const PaymentSuccess = React.lazy(() => import("../pages/user/account/PaymentSuccess.js"));
const PageNotFound = React.lazy(() => import("../pages/PageNotFound.js"));
const UserSupport = React.lazy(() =>
  import("../pages/user/resources/UserSupport.js")
);
const MarketingResource = React.lazy(() =>
  import("../pages/user/resources/MarketingResource.js")
);
const BoardingPolicy = React.lazy(() =>
  import("../pages/user/resources/BoardingPolicy.js")
);
const TechResource = React.lazy(() =>
  import("../pages/user/resources/TechResource.js")
);
const Miscellaneous = React.lazy(() =>
  import("../pages/user/resources/Miscellaneous.js")
);
const ResetPassword = React.lazy(() =>
  import("../pages/user/authentication/ResetPassword.js")
);
const ForgotPassword = React.lazy(() =>
  import("../pages/user/authentication/ForgotPassword.js")
);
const HelpSupport = React.lazy(() => import("../pages/user/HelpSupport.js"));
const MyProfile = React.lazy(() => import("../pages/user/account/MyProfile.js"));
const MySubscriptionAndRequestBase = React.lazy(() =>
  import("../pages/user/account/MySubscriptionAndRequestBase.js")
);
const AdminSignIn = React.lazy(() => import("../pages/admin/SignIn.js"));
const AdminManagement = React.lazy(() =>
  import("../pages/admin/adminmanagement/AdminManagement.js")
);
const AddAdmin = React.lazy(() =>
  import("../pages/admin/adminmanagement/AddAdmin.js")
);
const ViewAdmin = React.lazy(() =>
  import("../pages/admin/adminmanagement/ViewAdmin.js")
);
const EditAdmin = React.lazy(() =>
  import("../pages/admin/adminmanagement/EditAdmin.js")
);

const PendingRequests = React.lazy(() =>
  import("../pages/admin/adminmanagement/PendingRequests.js")
);

const ViewPendingRequest = React.lazy(() =>
  import("../pages/admin/adminmanagement/ViewRequest.js")
);


const UserManagement = React.lazy(() =>
  import("../pages/admin/usermanagement/UserManagement.js")
);
const AddUser = React.lazy(() =>
  import("../pages/admin/usermanagement/AddUser.js")
);
const ViewUser = React.lazy(() =>
  import("../pages/admin/usermanagement/ViewUser.js")
);
const DataSetsRequestManagement = React.lazy(() =>
  import("../pages/admin/datasetsrequest/DataSetsRequestManagement.js")
);
const ServiceRequestManagement = React.lazy(() =>
  import("../pages/admin/servicesetsrequest/ServiceRequestManagement.js")
);
const ServiceRequestManagementDetails = React.lazy(() => import("../pages/admin/servicesetsrequest/ServiceRequestManagementDetails.js"))
const DataSetsRequestManagementDetails = React.lazy(() => import("../pages/admin/datasetsrequest/DataSetsRequestManagementDetails.js"))
const RegistrationRequestManagement = React.lazy(() =>
  import("../pages/admin/registrationrequest/RegistrationRequestManagement.js")
);
const DataSetsUpdateRequestManagement = React.lazy(() =>
  import("../pages/admin/datasetsrequest/DataSetsUpdateRequestManagement.js")
);
const DataSetsUpdateRequestManagementDetails = React.lazy(() =>
  import("../pages/admin/datasetsrequest/DataSetsUpdateRequestManagementDetails.js")
);
const ServiceUpdateRequestManagement = React.lazy(() =>
  import("../pages/admin/servicesetsrequest/ServiceUpdateRequestManagement.js")
);
const ServiceUpdateRequestManagementDetails = React.lazy(() =>
  import("../pages/admin/servicesetsrequest/ServiceUpdateRequestManagementDetails.js")
);

const RequestManagement = React.lazy(() => import("../pages/admin/RequestManagement.js"));
const DataServiceManagement = React.lazy(() => import("../pages/admin/DataServiceManagement.js"));
const DocumentManagement = React.lazy(() => import("../pages/admin/DocumentManagement.js"));
const ReportsManagement = React.lazy(() => import("../pages/admin/reportManagement/ReportsManagement.js"));
const HelpAndSupport = React.lazy(() => import("../pages/admin/HelpSupport.js"));
const AddService = React.lazy(() => import("../pages/admin/service/AddService.js"));
const ViewDataSet = React.lazy(() => import("../pages/admin/datasets/ViewDataSet.js"));
const ViewService = React.lazy(() => import("../pages/admin/service/ViewService.js"));
const Dashboard = React.lazy(() => import("../pages/admin/reportManagement/dashboard/Dashboard.js"));
const ViewReports = React.lazy(() => import("../pages/admin/reportManagement/ViewReports.js"));
const AuditLogs = React.lazy(() => import("../pages/admin/reportManagement/AuditLogs.js"));
const UserManagementDashboard = React.lazy(() => import("../pages/admin/reportManagement/dashboard/UserManagementDashboard.js"));
const DataCatalogueDashboard = React.lazy(() => import("../pages/admin/reportManagement/dashboard/DataCatalogueDashboard.js"));
const ServiceCatalogueDashboard = React.lazy(() => import("../pages/admin/reportManagement/dashboard/ServiceCatalogueDashboard.js"));
const RequestManagementDashboard = React.lazy(() => import("../pages/admin/reportManagement/dashboard/RequestManagementDashboard.js"));
const HelpSupportDashboard = React.lazy(() => import("../pages/admin/reportManagement/dashboard/HelpSupportDashboard.js"));
const UserActivityDashboard = React.lazy(() => import("../pages/admin/reportManagement/dashboard/UserActivityDashboard.js"));
const UseCasesDashboard = React.lazy(() => import("../pages/admin/reportManagement/dashboard/UseCasesDashboard.js"));

const SwaggerDocument = React.lazy(() => import("../pages/others/SwaggerDocument.js"));

const Routes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth.user);
  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <LayoutComponent />,
      children: [
        {
          index: true,
          element: <HomePage />,
          name: "Home",
        },
        {
          path: "help-support",
          element: <HelpSupport />,
          name: "HelpSupport",
          handle: {
            crumb: () => {
              return (
                <>
                  <Link to="/">Home</Link>
                  <span>Help & Support</span>
                </>
              );
            },
          },
        },
        {
          path: "aboutus",
          element: <AboutUs />,
          name: "About us",
          handle: {
            crumb: () => {
              return (
                <>
                  <Link to="/">Home</Link>
                  <span>About us</span>
                </>
              );
            },
          },
        },
        {
          path: "resources",
          element: <Outlet />,
          name: "Resources",
          children: [
            {
              index: true,
              element: <Resources />,
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <span>Resources</span>
                    </>
                  );
                },
              },
            },
            {
              path: "usersupport",
              element: <UserSupport />,
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <Link to="/resources">Resources</Link>
                      <span>User Support</span>
                    </>
                  );
                },
              },
            },
            {
              path: "marketingresource",
              element: <MarketingResource />,
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <Link to="/resources">Resources</Link>
                      <span>Marketing Resources</span>
                    </>
                  );
                },
              },
            },
            {
              path: "boardingpolicy",
              element: <BoardingPolicy />,
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <Link to="/resources">Resources</Link>
                      <span>Onboarding Policies</span>
                    </>
                  );
                },
              },
            },
            {
              path: "techresource",
              element: <TechResource />,
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <Link to="/resources">Resources</Link>
                      <span>Technical Resources</span>
                    </>
                  );
                },
              },
            },
            {
              path: "miscellaneous",
              element: <Miscellaneous />,
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <Link to="/resources">Resources</Link>
                      <span>Miscellaneous</span>
                    </>
                  );
                },
              },
            },
          ],
        },
        {
          path: "innovationchallenge",
          element: <InnovationChallenge />,
          name: "InnovationChallenge",
          handle: {
            crumb: () => {
              return (
                <>
                  <Link to="/">Home</Link>
                  <span>Innovation Challenge</span>
                </>
              );
            },
          },
        },
        {
          path: "howtojoin",
          element: <HowToJoin />,
          name: "HowToJoin",
          handle: {
            crumb: () => {
              return (
                <>
                  <Link to="/">Home</Link>
                  <span>How to join</span>
                </>
              );
            },
          },
        },
        {
          path: "media",
          element: <Outlet />,
          name: "Media",
          children: [
            {
              index: true,
              element: <Media />,
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <span>Media</span>
                    </>
                  );
                },
              },
            },
            // {
            //   path: "articles",
            //   element: <Outlet />,
            //   children: [
            //     {
            //       path: "unlocking-transport-data",
            //       element: <UnlockingTransportData />,
            //       handle: {
            //         crumb: () => {
            //           return (
            //             <>
            //               <Link to="/">Home</Link>
            //               <Link to="/media">Media</Link>
            //               <span>Unlocking Transport Data: Pioneering Smart City Innovations</span>
            //             </>
            //           );
            //         },
            //       },
            //     },
            //   ]
            // },

          ]
        },
        {
          path: "data-services",
          element: <Outlet />,
          name: "Data and Service",
          children: [
            {
              index: true,
              element: <DataService />,
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <span>Data & Services</span>
                    </>
                  );
                },
              },
            },
            {
              path: "datadetails/:id",
              element: <DataDetails />,
              name: "Data Details",
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <Link to="/data-services">Data & Services</Link>
                      <span></span>
                    </>
                  );
                },
              },
            },
            {
              path: "servicedetails/:id",
              element: <ServiceDetails />,
              name: "Service Details",
              handle: {
                crumb: () => {
                  return (
                    <>
                      <Link to="/">Home</Link>
                      <Link to="/data-services">Data & Services</Link>
                      <span></span>
                    </>
                  );
                },
              },
            },
          ],
        },
        {
          path: "cookiepolicy",
          element: <CookiePolicy />,
          name: "Cookie Policy",
        },
        {
          path: "privacypolicy",
          element: <PolicyDocument />,
          name: "Policy Document",
        },
        {
          path: "termsofuse",
          element: <TermsOfUse />,
          name: "Terms of use",
        },
      ],
    },

    {
      path: "forgotpassword",
      element: <ForgotPassword />,
      name: "ForgotPassword",
    },
    {
      path: "forgot-password-email-verification",
      element: <EmailVerification />,
      name: "Forgot Password Verification",
    },
    {
      path: "forgot-password-mobile-verification",
      element: <MobileVerification />,
      name: "Forgot Password Verification",
    },
    {
      path: "resetpassword",
      element: <ResetPassword />,
      name: "Reset Password",
    },
    {
      path: "changepassword",
      element: <ChangePassword />,
      name: "ForgotPassword",
    },
    {
      path: "signin",
      element: !isAuthenticated ? <SignIn /> : <DataServiceNavigation />,
      name: "signin",
    },
    {
      path: "register",
      element: !isAuthenticated ? <Register /> : <Navigate to={"/"} />,
      name: "register",
    },
    {
      path: "emailverification",
      element: <EmailVerification />,
      name: "emailVerification",
    },
    {
      path: "mobileverification",
      element: <MobileVerification />,
      name: "mobileVerification",
    },

    {
      path: "paymentstatus",
      element: <PaymentSuccess />,
      name: "PaymentStatus",
    },
    {
      path: "*",
      element: <PageNotFound />,
      name: "NotFound",
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "account",
          element: <Account />,
          name: "Account",
          children: [
            {
              path: "mysubscriptions",
              element: <MySubscriptionAndRequestBase />,
              name: "MySubscriptions",
            },
            {
              path: "myrequests",
              element: <MySubscriptionAndRequestBase />,
              name: "MyRequests",
            },
            {
              path: "myprofile",
              element: <MyProfile />,
              name: "MyProfile",
            },
            {
              path: "settings",
              element: <Settings />,
              name: "Settings",
            },
            {
              path: "mynotifications",
              element: <MyNotifications />,
              name: "MyNotifications",
            },
          ],
        },
      ],
    },
  ];

  // Define routes accessible only to Admin non-authenticated users
  const routesForAdminNotAuthenticatedOnly = [
    {
      path: "admin",
      element: <AdminLayoutComponent hideHeaderPaths={[
        "/admin/signin",
        "/admin/forgotpassword",
        "/admin/resetpassword",
        "/admin/forgot-password-email-verification",
        "/admin/forgot-password-mobile-verification"
      ]} />,
      name: "Admin",
      children: [
        {
          path: "signin",
          element: <AdminSignIn />,
          name: "AdminSignin",
        },
        {
          path: "forgotpassword",
          element: <ForgotPassword />,
          name: "ForgotPassword",
        },
        {
          path: "forgot-password-email-verification",
          element: <EmailVerification />,
          name: "Forgot Password email Verification",
        },
        {
          path: "forgot-password-mobile-verification",
          element: <MobileVerification />,
          name: "Forgot Password mobile Verification",
        },
        {
          path: "resetpassword",
          element: <ResetPassword />,
          name: "Reset Password",
        },
        // {
        //   path: "changepassword",
        //   element: <ChangePassword />,
        //   name: "ForgotPassword",
        // },
        {
          path: "cookiepolicy",
          element: <CookiePolicy />,
          name: "Cookie Policy",
        },
        {
          path: "privacypolicy",
          element: <PolicyDocument />,
          name: "Policy Document",
        },
        {
          path: "termsofuse",
          element: <TermsOfUse />,
          name: "Terms of use",
        },
      ],
    },
  ];


  //Define routes accessible only to Admin authenticated users
  const routesForAdminAuthenticatedOnly = [
    {
      path: "admin",
      element: <ProtectedAdminRoute />, // Wrap the component in ProtectedRoute
      name: "Admin",
      children: [
        {
          path: "adminmanagement",
          element: <Outlet />,
          name: "AdminManagement",
          children: [
            {
              index: true,
              element: <AdminManagement />,
            },
            {
              path: "createnewadmin",
              element: <AddAdmin />,
              name: "Add Admin User"
            },
            {
              path: "viewadmin/:id",
              element: <ViewAdmin />,
              name: "View Admin User"
            },
            {
              path: "editadmin/:id",
              element: <EditAdmin />,
              name: "Edit Admin User"
            },
            {
              path: "pendingrequests/:id",
              element: <PendingRequests />,
              name: "Pending Requests"
            },
            {
              path: "viewpendingrequest/:userid/:id/:entityname",
              element: <ViewPendingRequest />,
              name: "View Requests"
            }

          ]
        },
        {
          path: "usermanagement",
          element: <Outlet />,
          name: "UserManagement",
          children: [
            {
              index: true,
              element: <UserManagement />,
            },
            {
              path: "createnewuser",
              element: <AddUser />,
              name: "Add New User"
            },
            {
              path: "viewuser/:id",
              element: <ViewUser />,
              name: "View User"
            }

          ]
        },
        {
          path: "requestmanagement",
          element: <RequestManagement />,
          name: "Request Management",
          children: [
            {
              path: "datasetsrequestmanagement",
              element: <DataSetsRequestManagement />,
              name: "Data Sets Request Management",
            },
            {
              path: "servicerequestmanagement",
              element: <ServiceRequestManagement />,
              name: "Service Request Management",
            },
            {
              path: "viewdatasetrequest/:id",
              element: <DataSetsRequestManagementDetails />,
              name: "Dataset Request Details",
            },
            {
              path: "viewservicesetrequest/:id",
              element: <ServiceRequestManagementDetails />,
              name: "Service Request Details",
            },
            {
              path: "registrationrequestmanagement",
              element: <RegistrationRequestManagement />,
              name: "Registration Request Management",
            },
            {
              path: "datasetsupdaterequestmanagement",
              element: <DataSetsUpdateRequestManagement />,
              name: "Data Sets Update Request Management",
            },
            {
              path: "viewdatasetupdaterequest/:id",
              element: <DataSetsUpdateRequestManagementDetails />,
              name: "Dataset Update Request Details",
            },
            {
              path: "serviceupdaterequestmanagement",
              element: <ServiceUpdateRequestManagement />,
              name: "Service Update Request Management",
            },
            {
              path: "viewservicesetupdaterequest/:id",
              element: <ServiceUpdateRequestManagementDetails />,
              name: "Service Update Request Details",
            },
          ],
        },
        {
          path: "dataservicemanagement",
          element: <DataServiceManagement />,
          name: "Data and Service Management",
          children: [
            {
              path: "datasetlisting",
              element: <DataListingManagement />,
              name: "Dataset Lisiting",
            },
            {
              path: "servicelisting",
              element: <ServiceListingManagement />,
              name: "Service Lisiting",
            },
            {
              path: "createnewdataset",
              element: <AddDataSet />,
              name: "Add New Dataset",
            },
            {
              path: "viewdataset/:id",
              element: <ViewDataSet />,
              name: "Dataset Lisiting",
            },
            {
              path: "viewserviceset/:id",
              element: <ViewService />,
              name: "Dataset Lisiting",
            },
            {
              path: "createnewservice",
              element: <AddService />,
              name: "Add New Service",
            },
            {
              path: "editdataset/:id",
              element: <EditDataSet />,
              name: "Edit Data Set",
            },
            {
              path: "editservice/:id",
              element: <EditService />,
              name: "Edit service Set",
            },
          ],
        },
        {
          path: "documentmanagement",
          element: <Outlet />,
          name: "Document Management",
          children: [
            {
              index: true,
              element: <DocumentManagement />,
            },
            {
              path: "viewdocument/:id",
              element: <ViewDocument />,
              name: "View Document",
            },
            {
              path: "createdocument",
              element: <CreateDocument />,
              name: "Create Document",
            },
            {
              path: "editdocument/:id",
              element: <EditDocument />,
              name: "Edit Document",
            }
          ],
        },
        {
          path: "reportsmanagement",
          element: <ReportsManagement />,
          name: "Reports Management",
          children: [
            {
              path: "dashboards",
              element: <Dashboard />,
              name: "Dashboard",
              children: [
                {
                  path: "usermanagementdashboard",
                  element: <UserManagementDashboard />,
                  name: "user management dashboard",
                },
                {
                  path: "datacataloguedashboard",
                  element: <DataCatalogueDashboard />,
                  name: "data catalogue dashboard",
                },
                {
                  path: "servicecataloguedashboard",
                  element: <ServiceCatalogueDashboard />,
                  name: "service catalogue dashboard",
                },
                {
                  path: "requestmanagementdashboard",
                  element: <RequestManagementDashboard />,
                  name: "request management dashboard",
                },
                {
                  path: "helpsupportdashboard",
                  element: <HelpSupportDashboard />,
                  name: "Help & Support Dashboard",
                },
                {
                  path: "useractivitydashboard",
                  element: <UserActivityDashboard />,
                  name: "User Activity Dashboard",
                },
                {
                  path: "usecases",
                  element: <UseCasesDashboard />,
                  name: "Use Cases Dashboard",
                },
              ]
            },
            {
              path: "viewreports",
              element: <ViewReports />,
              name: "View Reports",
            },
            {
              path: "auditlogs",
              element: <AuditLogs />,
              name: "Audit Logs",
            },
          ]
        },
        {
          path: "helpsupport",
          element: <Outlet />,
          name: "Help and Support",
          children: [
            {
              index: true,
              element: <HelpAndSupport />,
            },
            {
              path: "viewhelpandsupport/:id",
              element: <ViewHelpQuery />,
              name: "View Help and Support",
            }
          ],
        },
        {
          path: "notifications",
          element: <MyNotifications />,
          name: "my notifications",
        },
      ],
    },
  ];

  // Conditionally add the Swagger route if env is QA
  if (process.env.REACT_APP_ENV === "qa") {
    routesForPublic.push({
      path: "/swagger",
      element: <SwaggerDocument />,
      name: "Swagger",
    });
  }

  // Combine and conditionally include routes based on authentication status
  const approuter = createBrowserRouter([
    ...routesForPublic,
    ...routesForAdminNotAuthenticatedOnly,
    ...routesForAuthenticatedOnly,
    ...routesForAdminAuthenticatedOnly,
  ]);
  return <RouterProvider router={approuter} />;
};

export default Routes;
