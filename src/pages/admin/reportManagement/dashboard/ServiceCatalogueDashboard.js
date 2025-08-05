import React, { useEffect, useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import GraphNotificationCard from "../../../../components/admin/GraphNotificationCard";
import LineCharts from "../../../../components/admin/charts/LineCharts";
import SimpleBarChart from "../../../../components/admin/charts/SimpleBarChart";
import VerticalBarChart from "../../../../components/admin/charts/VerticalBarChart";
import {
  getUserDashboardMetrics,
  getServiceCountModelApi,
  getServiceTopSubscribedApi,
  getSevicesAvailedApi,
} from "../../../../services/apiservices";
import "../../../../assets/styles/reportManagementDashboard.scss";
import "../../../../assets/styles/formcomponent.scss";

const ServiceCatalogueDashboard = () => {
  const listcontent = useRef(null);
  const dashboardNotificationList = [
    {
      id: 1,
      name: "Total Services",
      key: "totalServices",
      value: 0,
    },
    {
      id: 2,
      name: "Services Availed",
      key: "servicesAvailed",
      value: 0,
    },
    {
      id: 3,
      name: "Unique Services types",
      key: "uniqueServicesTypes",
      value: 0,
    },
  ];
  const [selectedYearDrop, setSelectedYearDrop] = useState([]);
  const [dashboardData, setDashboardData] = useState(dashboardNotificationList);
  const [apiErrors, setApiErrors] = useState({
    topSubscribed: "",
    modelCount: "",
    trendAvailed: "",
  });
  const [modelCountData, setModelCountData] = useState([]);
  const [topSubscribed, setTopSubscribed] = useState([]);
  const [trendAvailed, setTrendAvailed] = useState([]);
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const months = [
    { name: "Jan", key: 1 },
    { name: "Feb", key: 2 },
    { name: "Mar", key: 3 },
    { name: "Apr", key: 4 },
    { name: "May", key: 5 },
    { name: "Jun", key: 6 },
    { name: "Jul", key: 7 },
    { name: "Aug", key: 8 },
    { name: "Sep", key: 9 },
    { name: "Oct", key: 10 },
    { name: "Nov", key: 11 },
    { name: "Dec", key: 12 },
  ];

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
      callCountModelApiForYears(allYears);
      callTopSubscribedApiForYears(allYears);
      callSevicesAvailedApiForYears(allYears);
      window.scrollTo({
        top: listcontent.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [selectedYearDrop]);

  const callMetricsData = (year) => {
    let path = "api/report/service-catalogue-dashboard/metrics?year=" + year;
    const getData = async () => {
      return await getUserDashboardMetrics(path);
    };
    getData()
      .then((res) => {
        if (res) {
          let data = [];
          dashboardNotificationList.forEach((element, i) => {
            let obj = {
              id: i,
              name: element.name,
              value: res[element.key],
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
    const aggregatedData = {};

    const fetchAllYears = async () => {
      try {
        for (let year of years) {
          const path = `api/report/service-catalogue-dashboard/metrics?year=${year}`;
          const res = await getUserDashboardMetrics(path);
          if (res) {
            dashboardNotificationList.forEach((element) => {
              const key = element.key;
              const name = element.name;
              const value = res[key] || 0;
              if (!aggregatedData[key]) {
                aggregatedData[key] = { name, value: 0 };
              }
              aggregatedData[key].value += value;
            });
          }
        }
        const resultData = Object.keys(aggregatedData).map((key, i) => ({
          id: i,
          name: aggregatedData[key].name,
          value: aggregatedData[key].value,
        }));
        setDashboardData(resultData);
      } catch (error) {
        setDashboardData(dashboardNotificationList);
        console.log(error);
      }
    };
    fetchAllYears();
  };

  const callCountModelApi = (year) => {
    setModelCountData([]);
    const getCountModelData = async () => {
      return await getServiceCountModelApi("year=" + year);
    };
    getCountModelData()
      .then((res) => {
        if (res.length > 0) {
          let array = [];
          res.forEach((element) => {
            array.push({
              name: element?.charging_model,
              services: element?.total_services,
            });
          });

          const hasNonZero = array.some((item) => item.services > 0);
          setModelCountData(hasNonZero ? array : []);
          setApiErrors((prevErrors) => ({
            ...prevErrors,
            modelCount: "",
          }));
        }
      })
      .catch((error) => {
        setModelCountData([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          line: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callCountModelApiForYears = async (years) => {
    const aggregatedMap = new Map();

    try {
      const promises = years.map((year) =>
        getServiceCountModelApi("year=" + year)
      );
      const results = await Promise.all(promises);
      results.forEach((res) => {
        if (Array.isArray(res)) {
          res.forEach((item) => {
            const model = item?.charging_model;
            const services = Number(item?.total_services) || 0;
            if (aggregatedMap.has(model)) {
              aggregatedMap.set(model, aggregatedMap.get(model) + services);
            } else {
              aggregatedMap.set(model, services);
            }
          });
        }
      });
      const finalArray = Array.from(aggregatedMap.entries()).map(
        ([name, services]) => ({
          name,
          services,
        })
      );
      setModelCountData(finalArray);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        modelCount: "",
      }));
    } catch (error) {
      setModelCountData([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        modelCount: error?.response?.data?.message || error.message,
      }));
    }
  };

  const callTopSubscribedApi = (year) => {
    const getTopSubscribedData = async () => {
      return await getServiceTopSubscribedApi("year=" + year);
    };
    getTopSubscribedData()
      .then((res) => {
        let array = [];
        res.forEach((element) => {
          array.push({
            name: element.dataSetTitle,
            UsersSubscribed: element.totalSubscribe,
          });
        });
        setTopSubscribed(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          topSubscribed: "",
        }));
      })
      .catch((error) => {
        setTopSubscribed([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          topSubscribed: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callTopSubscribedApiForYears = async (years) => {
    const aggregatedMap = new Map();
    try {
      const promises = years.map((year) =>
        getServiceTopSubscribedApi("year=" + year)
      );
      const results = await Promise.all(promises);

      results.forEach((res) => {
        if (Array.isArray(res)) {
          res.forEach((item) => {
            const title = item.dataSetTitle;
            const count = Number(item.totalSubscribe) || 0;

            if (aggregatedMap.has(title)) {
              aggregatedMap.set(title, aggregatedMap.get(title) + count);
            } else {
              aggregatedMap.set(title, count);
            }
          });
        }
      });

      const aggregatedArray = Array.from(aggregatedMap.entries()).map(
        ([name, UsersSubscribed]) => ({
          name,
          UsersSubscribed,
        })
      );

      setTopSubscribed(aggregatedArray);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        topSubscribed: "",
      }));
    } catch (error) {
      setTopSubscribed([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        topSubscribed: error?.response?.data?.message || error.message,
      }));
    }
  };

  const callSevicesAvailedApi = (year) => {
    const getSevicesAvailedData = async () => {
      return await getSevicesAvailedApi("year=" + year);
    };
    getSevicesAvailedData()
      .then((res) => {
        let array = [];
        Object.values(res).forEach((key) => {
          array.push({
            name: key.monthName.substring(0, 3),
            count: key.count,
          });
        });
        setTrendAvailed(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          trendAvailed: "",
        }));
      })
      .catch((error) => {
        setTrendAvailed([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          trendAvailed: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callSevicesAvailedApiForYears = async (years) => {
    try {
      const monthYearMap = {};
      for (const yr of years) {
        const res = await getSevicesAvailedApi(`year=${yr}`);
        if (res) {
          Object.values(res).forEach((item) => {
            const month = item.monthName.substring(0, 3); // e.g., Jan
            const key = `${month} ${yr.toString().slice(-2)}`; // e.g., Jan 24
            monthYearMap[key] = (monthYearMap[key] || 0) + item.count;
          });
        }
      }

      const allKeys = Object.keys(monthYearMap).sort((a, b) => {
        const [monthA, yearA] = a.split(" ");
        const [monthB, yearB] = b.split(" ");
        const dateA = new Date(`1 ${monthA} 20${yearA}`);
        const dateB = new Date(`1 ${monthB} 20${yearB}`);
        return dateA - dateB;
      });

      const finalArray = allKeys.map((key) => ({
        name: key,
        count: monthYearMap[key],
      }));

      const slicedData = finalArray.slice(-12); // Optional: keep latest 12 entries
      setTrendAvailed(slicedData);

      setApiErrors((prevErrors) => ({
        ...prevErrors,
        trendAvailed: "",
      }));
    } catch (error) {
      setTrendAvailed([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        trendAvailed:
          error?.response?.data?.message || error.message || "Chart error",
      }));
    }
  };

  const handleSelectedYearChange = (event) => {
    if (event.target.value === "All") {
      const allYears = selectedYearDrop
        .filter((item) => item.label !== "All")
        .map((item) => item.label);
      callMetricsDataForYears(allYears);
      callCountModelApiForYears(allYears);
      callTopSubscribedApiForYears(allYears);
      callSevicesAvailedApiForYears(allYears);
    } else {
      callMetricsData(event.target.value);
      callCountModelApi(event.target.value);
      callTopSubscribedApi(event.target.value);
      callSevicesAvailedApi(event.target.value);
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
      </div>
      <div className="row">
        <div className="col-4 pe-0">
          <div className="bar_chart">
            <p className="bar_chart_title">Services by charging model​​​</p>
            {modelCountData?.length > 0 ? (
              <SimpleBarChart data={modelCountData}></SimpleBarChart>
            ) : (
              <p className="empty">
                {apiErrors.modelCount?.length > 0
                  ? apiErrors.modelCount
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-4 pe-0">
          <div className="bar_chart">
            <p className="bar_chart_title">Top services subscribed ​​</p>
            {topSubscribed?.length > 0 ? (
              <VerticalBarChart data={topSubscribed}></VerticalBarChart>
            ) : (
              <p className="empty">
                {apiErrors.topSubscribed?.length > 0
                  ? apiErrors.modelCount
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-4 pe-0">
          <div className="line_chart">
            <p className="line_chart_title">Trend of services availed​</p>
            {trendAvailed?.length > 0 ? (
              <LineCharts data={trendAvailed}></LineCharts>
            ) : (
              <p className="empty">
                {apiErrors.trendAvailed?.length > 0
                  ? apiErrors.modelCount
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCatalogueDashboard;
