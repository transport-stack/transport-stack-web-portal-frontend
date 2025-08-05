import { useEffect } from "react";

const ViewReportsColumn = (name) => {
  const columns = {
    "User Report": [
      {
        Header: "User ID",
        accessor: "sequenceId",
      },
      {
        Header: "User Name",
        accessor: "email",
      },
      {
        Header: "Organization Name",
        accessor: "organizationName",
      },
      {
        Header: "Type of Organization",
        accessor: "organizationType",
      },
      {
        Header: "Country",
        accessor: "country",
      },
      {
        Header: "Registration Date",
        accessor: "registrationDate",
      },
      {
        Header: "Data Download",
        accessor: "isDataDownloaded",
      },
      {
        Header: "Data Subscribe",
        accessor: "isDataSubscribed",
      },
      {
        Header: "No. of Data Downloads",
        accessor: "numberOfDataDownloaded",
      },
      {
        Header: "No. of Data Subscribed",
        accessor: "numberOfDataSubscribed",
      },
      {
        Header: "Service Subscribe",
        accessor: "isServiceSubscribed",
      },
      {
        Header: "No. of Service Subscribed",
        accessor: "numberOfServiceSubscribed",
      },
      {
        Header: "Last Activity Date",
        accessor: "userActivityAt",
      },
      {
        Header: "Total Amount Paid",
        accessor: "totalAmountPaid",
      },
      {
        Header: "No. of Subscription Expiring soon",
        accessor: "numberOfSubscriptionsExpiring",
      },
      {
        Header: "No. of Paid Subscription Expiring soon",
        accessor: "numberOfPaidSubscriptionsExpiring",
      },
      {
        Header: "Delete Profile Request",
        accessor: "isSoftDeleted",
      },
      {
        Header: "Activate / Deactivate Access Status",
        accessor: "isAccountActive",
      },
    ],
    "Data Set Report": [
      {
        Header: "Dataset ID",
        accessor: "sequenceId",
      },
      {
        Header: "Dataset Title",
        accessor: "dataSetTitle",
      },
      {
        Header: "Type of Data",
        accessor: "typeOfData",
      },
      {
        Header: "Transport Mode",
        accessor: "transportMode",
      },
      {
        Header: "Ancillary Service",
        accessor: "ancillaryService",
      },
      {
        Header: "Data Provider",
        accessor: "dataProvider",
      },
      {
        Header: "Data Access Type",
        accessor: "dataAccessType",
      },
      {
        Header: "File Format",
        accessor: "fileFormat",
      },
      {
        Header: "Update Frequency",
        accessor: "updateFrequency",
      },
      {
        Header: "Charging Model",
        accessor: "chargingModel",
      },
      {
        Header: "Default Fee",
        accessor: "defaultFee",
      },
      {
        Header: "Date Published",
        accessor: "datePublished",
      },
      {
        Header: "Latest Version",
        accessor: "latestVersion",
      },
      {
        Header: "Last Updated On",
        accessor: "lastUpdatedOn",
      },
      {
        Header: "No. of Downloads",
        accessor: "totalDownloads",
      },
      {
        Header: "No. of Subscriptions",
        accessor: "totalSubscriptions",
      },
      {
        Header: "Total revenue generated",
        accessor: "totalRevenueGenerated",
      },
    ],
    "Service Report": [
      {
        Header: "Service ID",
        accessor: "sequenceId",
      },
      {
        Header: "Service Title",
        accessor: "name",
      },
      {
        Header: "Type of Service",
        accessor: "serviceType",
      },
      {
        Header: "Transport Mode",
        accessor: "transportMode",
      },
      {
        Header: "Ancillary Service",
        accessor: "ancillaryService",
      },
      {
        Header: "Service Provider",
        accessor: "serviceProvider",
      },
      // {
      //   Header: "Service Access Type",
      //   accessor: "",
      // },
      {
        Header: "Charging Model",
        accessor: "chargingModel",
      },
      {
        Header: "Default Fee",
        accessor: "defaultFee",
      },
      {
        Header: "Date Published",
        accessor: "datePublished",
      },
      {
        Header: "Latest Version",
        accessor: "version",
      },
      {
        Header: "Last Updated On",
        accessor: "lastUpdatedOn",
      },
      {
        Header: "No. of Subscriptions",
        accessor: "totalSubscription",
      },
      {
        Header: "Total revenue generated",
        accessor: "totalRevenueGenerated",
      },
    ],
    "Document Report": [
      {
        Header: "Document ID",
        accessor: "sequenceId",
      },
      {
        Header: "Document Title",
        accessor: "title",
      },
      {
        Header: "Document Category",
        accessor: "category",
      },
      {
        Header: "Published On",
        accessor: "publishedOn",
      },
      {
        Header: "Latest version",
        accessor: "versions",
      },
      {
        Header: "Last Modified Date",
        accessor: "lastModifiedDate",
      },
    ],
    "Data Request Report": [
      {
        Header: "Request No.",
        accessor: "sequenceId",
      },
      {
        Header: "User Email Id",
        accessor: "userEmailId",
      },
      {
        Header: "Organization",
        accessor: "organizationName",
      },
      {
        Header: "Type of Organization",
        accessor: "organizationType",
      },
      {
        Header: "Data Set ID",
        accessor: "dataSetId",
      },
      {
        Header: "Dataset Title",
        accessor: "dataSetTitle",
      },
      {
        Header: "Request Date",
        accessor: "requestDate",
      },
      {
        Header: "Purpose",
        accessor: "requestPurpose",
      },
      {
        Header: "Type of Use",
        accessor: "typeOfUse",
      },
      {
        Header: "Subscription Model",
        accessor: "subscriptionModel",
      },
      {
        Header: "Fee Change by Admin",
        accessor: "feeChangeByAdmin",
      },
      {
        Header: "Reason for Fee Change",
        accessor: "reasonForFeeChange",
      },
      {
        Header: "Default Fee",
        accessor: "defaultFeeAmount",
      },
      {
        Header: "User Assigned Fee",
        accessor: "modifiedFeeAmount",
      },
    ],
    "Service Request Report": [
      {
        Header: "Request No.",
        accessor: "sequenceId",
      },
      {
        Header: "User Email Id",
        accessor: "userEmailId",
      },
      {
        Header: "Organization",
        accessor: "organizationName",
      },
      {
        Header: "Type of Organization",
        accessor: "organizationType",
      },
      {
        Header: "Service ID",
        accessor: "serviceId",
      },
      {
        Header: "Service Title",
        accessor: "serviceTitle",
      },
      {
        Header: "Request Date",
        accessor: "requestDate",
      },
      {
        Header: "Purpose",
        accessor: "requestPurpose",
      },
      {
        Header: "Type of Use",
        accessor: "typeOfUse",
      },
      {
        Header: "Subscription Model",
        accessor: "subscriptionModel",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Fee Change by Admin",
        accessor: "feeChangeByAdmin",
      },
      {
        Header: "Reason for Fee Change",
        accessor: "reasonForFeeChange",
      },
      {
        Header: "Default Fee",
        accessor: "defaultFee",
      },
      {
        Header: "User Assigned Fee",
        accessor: "modifiedFee",
      },
    ],
    "Help & Support Report": [
      {
        Header: "Query No.",
        accessor: "sequenceId",
      },
      {
        Header: "User Email Id",
        accessor: "email",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
      {
        Header: "Submission Date",
        accessor: "submissionDate",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Remarks at the time of closure",
        accessor: "remarks",
      },
      {
        Header: "Last updated On",
        accessor: "lastUpdatedOn",
      },
    ],
  };

  return columns[name] || []; // Return an empty array if 'name' is not found
};

export default ViewReportsColumn;
