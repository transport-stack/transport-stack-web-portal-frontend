import React, { useEffect, useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import GraphNotificationCard from "../../../../components/admin/GraphNotificationCard";
import StackedBar from "../../../../components/admin/charts/StackedBar";
import {
  getUserDashboardMetrics,
  getBreakdownDataRequestApi,
  getBreakdownServiceRequestApi,
  getTypeServiceRequestApi,
  getTypeDataRequestApi,
} from "../../../../services/apiservices";
import "../../../../assets/styles/reportManagementDashboard.scss";
import "../../../../assets/styles/formcomponent.scss";

const RequestManagementDashboard = () => {
  const listcontent = useRef(null);
  const dashboardNotificationList = [
    {
      id: 1,
      name: "Total Requests ​",
      key: "totalRequests",
      value: 0,
    },
    {
      id: 2,
      name: "Approved Requests​",
      key: "approvedRequestsPercentage",
      value: 0,
    },
    {
      id: 3,
      name: "Average time for approval ​",
      key: "avgDaysToApprove",
      value: "0 days",
    },
  ];
  // const approvalTimeData = {
  //   id: 1,
  //   name: "Average time for approval ​",
  //   key: "dataProviders",
  //   value: 0,
  // };
  const [selectedYearDrop, setSelectedYearDrop] = useState([]);
  const [apiErrors, setApiErrors] = useState({
    breakdownDataRequest: "",
    breakdownServiceRequest: "",
    servicePurpose: "",
    dataPurpose: "",
  });
  const [dashboardData, setDashboardData] = useState(dashboardNotificationList);
  // const [approvalTime, setApprovalTime] = useState(approvalTimeData);
  const [breakdownDataRequest, setBreakdownDataRequest] = useState([]);
  const [breakdownServiceRequest, setBreakdownServiceRequest] = useState([]);
  const [purposeCategoryServiceRequest, setPurposeCategoryServiceRequest] =
    useState([]);
  const [purposeCategoryDataRequest, setPurposeCategoryDataRequest] = useState(
    []
  );
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const previousFiveYears = [];
    for (let i = 0; i < 5 && currentYear - i > 2023; i++) {
      previousFiveYears.push({
        label: currentYear - i,
        value: i + 1,
      });
    }
    previousFiveYears.unshift({ label: "All", value: 0 });
    setSelectedYearDrop(previousFiveYears);
  }, []);

  useEffect(() => {
    if (selectedYearDrop.length > 0) {
      const allYears = selectedYearDrop
        .filter((item) => item.label !== "All")
        .map((item) => item.label);
      setValue("selectedYear", "All");
      callMetricsDataForYears(allYears);
      callBreakdownDataRequestApiForYears(allYears);
      callBreakdownServiceRequestApiForYears(allYears);
      callTypeServiceRequestApiForYears(allYears);
      callTypeDataRequestApiForYears(allYears);
      window.scrollTo({
        top: listcontent.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [selectedYearDrop]);

  const callMetricsData = (year) => {
    let path = "api/report/request-management-dashboard/metrics?year=" + year;
    const getData = async () => {
      return await getUserDashboardMetrics(path);
    };
    getData()
      .then((res) => {
        if (res?.body) {
          let data = [];
          dashboardNotificationList.forEach((element, i) => {
            let obj = {
              id: i,
              name: element.name,
              value: notificationList(element.key, res),
            };
            data.push(obj);
          });
          setDashboardData(data);
        }
      })
      .catch((error) => {
        setDashboardData(dashboardNotificationList);
        console.log(error);
      });
  };

  const callMetricsDataForYears = (years) => {
    let aggregatedData = {};

    const fetchAllData = async () => {
      const promises = years.map((year) => {
        let path = `api/report/request-management-dashboard/metrics?year=${year}`;
        return getUserDashboardMetrics(path);
      });
      try {
        const results = await Promise.all(promises);
        results.forEach((res) => {
          if (res?.body) {
            dashboardNotificationList.forEach((element) => {
              const key = element.key;
              const value = Number(res.body?.[key]) || 0;

              if (!aggregatedData[key]) {
                aggregatedData[key] = {
                  name: element.name,
                  value: 0,
                };
              }
              aggregatedData[key].value += value;
            });
          }
        });
        const data = Object.keys(aggregatedData).map((key, i) => {
          const rawValue = Number(aggregatedData[key].value) || 0;
          const formattedValue = notificationList(key, {
            body: { [key]: rawValue },
          });
          return {
            id: i,
            name: aggregatedData[key].name,
            value: formattedValue,
          };
        });
        setDashboardData(data);
      } catch (error) {
        setDashboardData(dashboardNotificationList);
        console.log(error);
      }
    };
    fetchAllData();
  };

  const notificationList = (e, res) => {
    if (e == "avgDaysToApprove")
      return res.body[e] + (res.body[e] > 1 ? " days" : " day");
    else return res.body[e];
  };

  // const callAverageApprovalTimeApi = (year) => {
  //   const getAverageApprovalTimeData = async () => {
  //     return await getAverageApprovalTimeApi("year=" + year);
  //   };
  //   getAverageApprovalTimeData()
  //     .then((res) => {
  //       setApprovalTime({
  //         name: "Average time for approval",
  //         value: res,
  //       });
  //     })
  //     .catch((error) => {
  //       setApprovalTime(approvalTimeData);
  //       console.log(error);
  //     });
  // };

  //Breakdown of total data requests
  const callBreakdownDataRequestApi = (year) => {
    const getBreakdownDataRequestData = async () => {
      return await getBreakdownDataRequestApi("year=" + year);
    };
    getBreakdownDataRequestData()
      .then((res) => {
        let array = [];
        res?.forEach((element) => {
          array.push({
            name: element.transportMode,
            Approved: element.approved,
            Rejected: element.rejected,
            Pending: element.pending,
          });
        });
        setBreakdownDataRequest(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          breakdownDataRequest: "",
        }));
      })
      .catch((error) => {
        setBreakdownDataRequest([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          breakdownDataRequest: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callBreakdownDataRequestApiForYears = async (years) => {
    const aggregatedMap = new Map();

    try {
      const promises = years.map((year) =>
        getBreakdownDataRequestApi("year=" + year)
      );
      const results = await Promise.all(promises);

      results.forEach((res) => {
        res?.forEach((item) => {
          const mode = item.transportMode;
          const approved = Number(item.approved) || 0;
          const rejected = Number(item.rejected) || 0;
          const pending = Number(item.pending) || 0;

          if (!aggregatedMap.has(mode)) {
            aggregatedMap.set(mode, {
              name: mode,
              Approved: 0,
              Rejected: 0,
              Pending: 0,
            });
          }

          const current = aggregatedMap.get(mode);
          aggregatedMap.set(mode, {
            ...current,
            Approved: current.Approved + approved,
            Rejected: current.Rejected + rejected,
            Pending: current.Pending + pending,
          });
        });
      });

      const finalArray = Array.from(aggregatedMap.values());
      setBreakdownDataRequest(finalArray);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        breakdownDataRequest: "",
      }));
    } catch (error) {
      setBreakdownDataRequest([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        breakdownDataRequest:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      }));
    }
  };

  //Breakdown of total service requests
  const callBreakdownServiceRequestApi = (year) => {
    const getBreakdownServiceRequestData = async () => {
      return await getBreakdownServiceRequestApi("year=" + year);
    };
    getBreakdownServiceRequestData()
      .then((res) => {
        let array = [];
        res?.forEach((element) => {
          array.push({
            name: element.transportMode,
            Approved: element.approved,
            Rejected: element.rejected,
            Pending: element.pending,
          });
        });
        setBreakdownServiceRequest(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          breakdownServiceRequest: "",
        }));
      })
      .catch((error) => {
        setBreakdownServiceRequest([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          breakdownServiceRequest: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callBreakdownServiceRequestApiForYears = async (years) => {
    const aggregatedMap = new Map();

    try {
      const promises = years.map((year) =>
        getBreakdownServiceRequestApi("year=" + year)
      );
      const results = await Promise.all(promises);

      results.forEach((res) => {
        res?.forEach((item) => {
          const mode = item.transportMode;
          const approved = Number(item.approved) || 0;
          const rejected = Number(item.rejected) || 0;
          const pending = Number(item.pending) || 0;

          if (!aggregatedMap.has(mode)) {
            aggregatedMap.set(mode, {
              name: mode,
              Approved: 0,
              Rejected: 0,
              Pending: 0,
            });
          }

          const current = aggregatedMap.get(mode);
          aggregatedMap.set(mode, {
            ...current,
            Approved: current.Approved + approved,
            Rejected: current.Rejected + rejected,
            Pending: current.Pending + pending,
          });
        });
      });

      const finalArray = Array.from(aggregatedMap.values());
      setBreakdownServiceRequest(finalArray);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        breakdownServiceRequest: "",
      }));
    } catch (error) {
      setBreakdownServiceRequest([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        breakdownServiceRequest:
          error?.response?.data?.message || error.message || "Data error",
      }));
    }
  };

  //Purpose category for service requests
  const callTypeServiceRequestApi = (year) => {
    const getTypeServiceRequestData = async () => {
      return await getTypeServiceRequestApi("year=" + year);
    };
    getTypeServiceRequestData()
      .then((res) => {
        let array = [];
        res?.forEach((element) => {
          array.push({
            name: element.transportMode,
            Commercial: element.commercial,
            Research: element.research,
            Academic: element.nonCommercial,
            Other: element.other,
          });
        });
        setPurposeCategoryServiceRequest(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          servicePurpose: "",
        }));
      })
      .catch((error) => {
        setPurposeCategoryServiceRequest([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          servicePurpose: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callTypeServiceRequestApiForYears = async (years) => {
    const aggregatedMap = new Map();
    try {
      const promises = years.map((year) =>
        getTypeServiceRequestApi("year=" + year)
      );
      const results = await Promise.all(promises);
      results.forEach((res) => {
        res?.forEach((item) => {
          const mode = item.transportMode;
          const commercial = Number(item.commercial) || 0;
          const research = Number(item.research) || 0;
          const academic = Number(item.nonCommercial) || 0;
          const other = Number(item.other) || 0;
          if (!aggregatedMap.has(mode)) {
            aggregatedMap.set(mode, {
              name: mode,
              Commercial: 0,
              Research: 0,
              Academic: 0,
              Other: 0,
            });
          }
          const current = aggregatedMap.get(mode);
          aggregatedMap.set(mode, {
            name: mode,
            Commercial: current.Commercial + commercial,
            Research: current.Research + research,
            Academic: current.Academic + academic,
            Other: current.Other + other,
          });
        });
      });
      const finalArray = Array.from(aggregatedMap.values());
      setPurposeCategoryServiceRequest(finalArray);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        servicePurpose: "",
      }));
    } catch (error) {
      setPurposeCategoryServiceRequest([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        servicePurpose:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      }));
    }
  };

  //Purpose category for data requests
  const callTypeDataRequestApi = (year) => {
    const getTypeDataRequestData = async () => {
      return await getTypeDataRequestApi("year=" + year);
    };
    getTypeDataRequestData()
      .then((res) => {
        let array = [];
        res?.forEach((element) => {
          array.push({
            name: element.transportMode,
            Commercial: element.commercial,
            Research: element.research,
            Academic: element.nonCommercial,
            Other: element.other,
          });
        });
        setPurposeCategoryDataRequest(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          dataPurpose: "",
        }));
      })
      .catch((error) => {
        setPurposeCategoryDataRequest([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          dataPurpose: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callTypeDataRequestApiForYears = async (years) => {
    const aggregatedMap = new Map();

    try {
      const promises = years.map((year) =>
        getTypeDataRequestApi("year=" + year)
      );
      const results = await Promise.all(promises);

      results.forEach((res) => {
        res?.forEach((item) => {
          const mode = item.transportMode;
          const commercial = Number(item.commercial) || 0;
          const research = Number(item.research) || 0;
          const academic = Number(item.nonCommercial) || 0;
          const other = Number(item.other) || 0;

          if (!aggregatedMap.has(mode)) {
            aggregatedMap.set(mode, {
              name: mode,
              Commercial: 0,
              Research: 0,
              Academic: 0,
              Other: 0,
            });
          }

          const current = aggregatedMap.get(mode);
          aggregatedMap.set(mode, {
            ...current,
            Commercial: current.Commercial + commercial,
            Research: current.Research + research,
            Academic: current.Academic + academic,
            Other: current.Other + other,
          });
        });
      });

      const finalArray = Array.from(aggregatedMap.values());
      setPurposeCategoryDataRequest(finalArray);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        dataPurpose: "",
      }));
    } catch (error) {
      setPurposeCategoryDataRequest([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        dataPurpose:
          error?.response?.data?.message || error.message || "Data load failed",
      }));
    }
  };

  const handleSelectedYearChange = (event) => {
    if (event.target.value === "All") {
      const allYears = selectedYearDrop
        .filter((item) => item.label !== "All")
        .map((item) => item.label);
      callMetricsDataForYears(allYears);
      callBreakdownDataRequestApiForYears(allYears);
      callBreakdownServiceRequestApiForYears(allYears);
      callTypeServiceRequestApiForYears(allYears);
      callTypeDataRequestApiForYears(allYears);
    } else {
      callMetricsData(event.target.value);
      callBreakdownDataRequestApi(event.target.value);
      callBreakdownServiceRequestApi(event.target.value);
      callTypeServiceRequestApi(event.target.value);
      callTypeDataRequestApi(event.target.value);
      // callAverageApprovalTimeApi(event.target.value);
    }
  };

  return (
    <div ref={listcontent} className="mb-5">
      <div className="row year_drop">
        <div className="col-3 pe-0">
          <div className="formComponent">
            <Form>
              <FloatingLabel controlId="selectedYear" label="Year" className="">
                <Form.Select
                  aria-label="Year"
                  name="selectedYear"
                  className={
                    errors.selectedYear ? "is-invalid-border-only" : ""
                  }
                  {...register("selectedYear", {})}
                  onChange={handleSelectedYearChange}
                >
                  <option value="">Select</option>
                  {selectedYearDrop?.length > 0 &&
                    selectedYearDrop.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                </Form.Select>
              </FloatingLabel>
            </Form>
          </div>
        </div>
      </div>
      <div className="row">
        {dashboardData.map((item) => {
          return (
            <div key={item.id} className="col-4 pe-0">
              <GraphNotificationCard data={item}></GraphNotificationCard>
            </div>
          );
        })}
        {/* <div className="col-4 pe-0">
          <GraphNotificationCard data={approvalTime}></GraphNotificationCard>
        </div> */}
      </div>
      <div className="row">
        <div className="col-6 pe-0">
          <div className="bar_chart">
            <p className="bar_chart_title">
              Breakdown of total data requests​​
            </p>
            {breakdownDataRequest?.length > 0 ? (
              <StackedBar data={breakdownDataRequest}></StackedBar>
            ) : (
              <p className="empty">
                {apiErrors.breakdownDataRequest?.length > 0
                  ? apiErrors.breakdownDataRequest
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-6 pe-0">
          <div className="bar_chart">
            <p className="bar_chart_title">Type of use for data request ​​​</p>
            {purposeCategoryDataRequest?.length > 0 ? (
              <StackedBar data={purposeCategoryDataRequest}></StackedBar>
            ) : (
              <p className="empty">
                {apiErrors.dataPurpose?.length > 0
                  ? apiErrors.dataPurpose
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-6 pe-0">
          <div className="line_chart">
            <p className="line_chart_title">
              Breakdown of total service requests​​
            </p>
            {breakdownDataRequest?.length > 0 ? (
              <StackedBar data={breakdownServiceRequest}></StackedBar>
            ) : (
              <p className="empty">
                {apiErrors.breakdownServiceRequest?.length > 0
                  ? apiErrors.breakdownServiceRequest
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-6 pe-0">
          <div className="line_chart">
            <p className="line_chart_title">
              Type of use for service request ​​
            </p>
            {purposeCategoryServiceRequest?.length > 0 ? (
              <StackedBar data={purposeCategoryServiceRequest}></StackedBar>
            ) : (
              <p className="empty">
                {apiErrors.servicePurpose?.length > 0
                  ? apiErrors.servicePurpose
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestManagementDashboard;
