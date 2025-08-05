import React, { useEffect, useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import GraphNotificationCard from "../../../../components/admin/GraphNotificationCard";
import LineCharts from "../../../../components/admin/charts/LineCharts";
import BarCharts from "../../../../components/admin/charts/BarCharts";
import VerticalBarChart from "../../../../components/admin/charts/VerticalBarChart";
import {
  getUserDashboardMetrics,
  getDatasetAvailedTypeDataApi,
  getDatasetAvailedTrendDataApi,
  getTopDatasetDownloadApi,
  getTopDatasetSubscribedApi,
} from "../../../../services/apiservices";
import "../../../../assets/styles/reportManagementDashboard.scss";
import "../../../../assets/styles/formcomponent.scss";

const DataCatalogueDashboard = () => {
  const dashboardNotificationList = [
    {
      id: 1,
      name: "Total Datasets",
      key: "totalDatasets",
      value: 0,
    },
    {
      id: 2,
      name: "Datasets Availed",
      key: "datasetsAvailed",
      value: 0,
    },
    {
      id: 3,
      name: "Data Providers",
      key: "dataProviders",
      value: 0,
    },
  ];
  const listContent = useRef(null);
  const [selectedYearDrop, setSelectedYearDrop] = useState([]);
  const [dashboardData, setDashboardData] = useState(dashboardNotificationList);
  const [trendDataSet, setTrendDataSet] = useState([]);
  const [availedTypeDataSet, setAvailedTypeDataSet] = useState([]);
  const [topDatasetDownloaded, setTopDatasetDownloaded] = useState([]);
  const [topDatasetSubscribed, setTopDatasetSubscribed] = useState([]);
  // const barChartData = [
  //   {
  //     name: "Metro",
  //     Available: 10,
  //     Availed: 5,
  //   },
  //   {
  //     name: "Bus",
  //     Available: 15,
  //     Availed: 5,
  //   },
  //   {
  //     name: "Parking",
  //     Available: 20,
  //     Availed: 5,
  //   },
  // ];
  // const lineChartData = [
  //   {
  //     name: "Jan",
  //     count: 10,
  //   },
  //   {
  //     name: "Feb",
  //     count: 25,
  //   },
  //   {
  //     name: "Mar",
  //     count: 30,
  //   },
  //   {
  //     name: "Apr",
  //     count: 55,
  //   },
  //   {
  //     name: "May",
  //     count: 65,
  //   },
  //   {
  //     name: "Jun",
  //     count: 45,
  //   },
  //   {
  //     name: "Jul",
  //     count: 50,
  //   },
  //   {
  //     name: "Aug",
  //     count: 60,
  //   },
  //   {
  //     name: "Sep",
  //     count: 65,
  //   },
  //   {
  //     name: "Oct",
  //     count: 75,
  //   },
  //   {
  //     name: "Nov",
  //     count: 80,
  //   },
  //   {
  //     name: "Dec",
  //     count: 90,
  //   },
  // ];
  // const topDatasetDownloaded = [
  //   {
  //     name: "CMCBL Bus Static Data",
  //     UsersSubscribed: 30,
  //   },
  //   {
  //     name: "CMCBL Fare info for buses",
  //     UsersSubscribed: 25,
  //   },
  //   {
  //     name: "DTC & DIMTS Fare info for buses",
  //     UsersSubscribed: 25,
  //   },
  // ];
  // const topDatasetSubscribed = [
  //   {
  //     name: "Passenger Count from Origin to Destination for DMRC Metro",
  //     UsersSubscribed: 30,
  //   },
  //   {
  //     name: "Passenger Count from Origin to Destination for NMRC Metro",
  //     UsersSubscribed: 25,
  //   },
  //   {
  //     name: "MCD Parking spot availability",
  //     UsersSubscribed: 25,
  //   },
  // ];
  const [apiErrors, setApiErrors] = useState({
    metric: "",
    type: "",
    trend: "",
    download: "",
    subscribe: "",
  });
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
      callMetricsDataForyears(allYears);
      callDatasetAvailedTrendDataApiForyears(allYears);
      callDatasetAvailedDataForYears(allYears);
      callTopDatasetDownloadForYears(allYears);
      callTopDatasetSubscribedApiForYears(allYears);
      window.scrollTo({
        top: listContent.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [selectedYearDrop]);

  const handleSelectedYearChange = (event) => {
    if (event.target.value === "All") {
      const allYears = selectedYearDrop
        .filter((item) => item.label !== "All")
        .map((item) => item.label);
      callMetricsDataForyears(allYears);
      callDatasetAvailedTrendDataApiForyears(allYears);
      callDatasetAvailedDataForYears(allYears);
      callTopDatasetDownloadForYears(allYears);
      callTopDatasetSubscribedApiForYears(allYears);
    } else {
      callMetricsData(event.target.value);
      callDatasetAvailedTrendDataApi(event.target.value);
      callDatasetAvailedData(event.target.value);
      callTopDatasetDownload(event.target.value);
      callTopDatasetSubscribedApi(event.target.value);
    }
  };

  const callMetricsData = (year) => {
    let path = "api/report/data-catalogue-dashboard/metrics?year=" + year;
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
              value: res.body[element.key],
            };
            data.push(obj);
          });
          setDashboardData(data);
        }
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          metric: "",
        }));
      })
      .catch((error) => {
        setDashboardData(dashboardNotificationList);
        console.log(error);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          metric: error?.response?.data
            ? error?.response?.data.error
            : error?.message,
        }));
      });
  };

  const callMetricsDataForyears = async (years) => {
    const sumMap = dashboardNotificationList.reduce((acc, { key }) => {
      acc[key] = 0;
      return acc;
    }, {});
    try {
      for (const yr of years) {
        const path = `api/report/data-catalogue-dashboard/metrics?year=${yr}`;
        const res = await getUserDashboardMetrics(path);

        if (res?.body) {
          dashboardNotificationList.forEach(({ key }) => {
            sumMap[key] += Number(res.body[key]) || 0;
          });
        } else {
          console.warn(`No response body for year ${yr}`, res);
        }
      }
      const aggregated = dashboardNotificationList.map(
        ({ name, key }, idx) => ({
          id: idx,
          name,
          value: sumMap[key],
        })
      );

      setDashboardData(aggregated);
      setApiErrors((prev) => ({ ...prev, metric: "" }));
    } catch (error) {
      console.error("Error fetching multi-year metrics:", error);
      setDashboardData(dashboardNotificationList);
      setApiErrors((prev) => ({
        ...prev,
        metric: error.response?.data?.error || error.message,
      }));
    }
  };

  //Datasets availed by type​​ api
  const callDatasetAvailedData = (year) => {
    const getDatasetAvailedData = async () => {
      return await getDatasetAvailedTypeDataApi("year=" + year);
    };
    getDatasetAvailedData()
      .then((res) => {
        let array = [];
        Object.values(res).forEach((key) => {
          array.push({
            name: key.transportMode,
            Available: key.available,
            Availed: key.availed,
          });
        });
        setAvailedTypeDataSet(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          type: "",
        }));
      })
      .catch((error) => {
        setAvailedTypeDataSet([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          type: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callDatasetAvailedDataForYears = (years) => {
    const requests = years.map((year) =>
      getDatasetAvailedTypeDataApi("year=" + year)
        .then((res) =>
          Object.values(res).map((entry) => ({
            transportMode: entry.transportMode,
            Available: entry.available,
            Availed: entry.availed,
          }))
        )
        .catch((error) => {
          throw {
            year,
            message: error?.response?.data?.message || error?.message,
          };
        })
    );

    Promise.allSettled(requests).then((results) => {
      const combinedData = {};
      const apiErrors = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          result.value.forEach((item) => {
            const key = item.transportMode;
            if (!combinedData[key]) {
              combinedData[key] = {
                name: key,
                Available: 0,
                Availed: 0,
              };
            }
            combinedData[key].Available += item.Available;
            combinedData[key].Availed += item.Availed;
          });
        } else {
          apiErrors[years[index]] = result.reason.message;
        }
      });

      setAvailedTypeDataSet(Object.values(combinedData));
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        type: Object.keys(apiErrors).length ? apiErrors : "",
      }));
    });
  };

  const callDatasetAvailedTrendDataApi = (year) => {
    const getDatasetAvailedTrendData = async () => {
      return await getDatasetAvailedTrendDataApi("year=" + year);
    };
    getDatasetAvailedTrendData()
      .then((res) => {
        let array = [];
        Object.values(res).forEach((key) => {
          array.push({
            name: key.monthName.substring(0, 3),
            count: key.count,
          });
        });
        setTrendDataSet(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          trend: "",
        }));
      })
      .catch((error) => {
        setTrendDataSet([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          trend: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callDatasetAvailedTrendDataApiForyears = async (years) => {
    try {
      const monthYearMap = {};

      for (const year of years) {
        try {
          const res = await getDatasetAvailedTrendDataApi(`year=${year}`);
          if (res) {
            Object.values(res).forEach((entry) => {
              const month = entry.monthName.substring(0, 3); // "Jan"
              const key = `${month} ${year.toString().slice(-2)}`; // "Jan 24"
              monthYearMap[key] = (monthYearMap[key] || 0) + entry.count;
            });
          }
        } catch (error) {
          // Capture per-year error
          setApiErrors((prevErrors) => ({
            ...prevErrors,
            trend: {
              ...(typeof prevErrors.trend === "object" ? prevErrors.trend : {}),
              [year]: error?.response?.data?.message || error?.message,
            },
          }));
        }
      }

      const allKeys = Object.keys(monthYearMap).sort((a, b) => {
        const [monthA, yearA] = a.split(" ");
        const [monthB, yearB] = b.split(" ");
        const dateA = new Date(`01 ${monthA} 20${yearA}`);
        const dateB = new Date(`01 ${monthB} 20${yearB}`);
        return dateA - dateB;
      });

      const finalArray = allKeys.map((key) => ({
        name: key,
        count: monthYearMap[key],
      }));

      // Optional: limit to last 12 months
      const slicedData = finalArray.slice(-12);

      setTrendDataSet(slicedData);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        trend: "",
      }));
    } catch (error) {
      setTrendDataSet([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        trend:
          error?.response?.data?.message ||
          error?.message ||
          "Trend chart error",
      }));
    }
  };

  const callTopDatasetDownload = (year) => {
    const getTopDatasetDownload = async () => {
      return await getTopDatasetDownloadApi("year=" + year);
    };
    getTopDatasetDownload()
      .then((res) => {
        let array = [];
        res?.forEach((element) => {
          array.push({
            name: element[0],
            UsersSubscribed: element[1],
          });
        });
        setTopDatasetDownloaded(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          download: "",
        }));
      })
      .catch((error) => {
        setTopDatasetDownloaded([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          download: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callTopDatasetDownloadForYears = (years) => {
    const requests = years.map((year) =>
      getTopDatasetDownloadApi("year=" + year)
        .then((res) =>
          res?.map((entry) => ({
            name: entry[0],
            UsersSubscribed: entry[1],
          }))
        )
        .catch((error) => {
          throw {
            year,
            message: error?.response?.data?.message || error?.message,
          };
        })
    );

    Promise.allSettled(requests).then((results) => {
      const combinedDownloads = {};
      const apiErrors = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          result.value.forEach(({ name, UsersSubscribed }) => {
            if (!combinedDownloads[name]) {
              combinedDownloads[name] = {
                name,
                UsersSubscribed: 0,
              };
            }
            combinedDownloads[name].UsersSubscribed += UsersSubscribed;
          });
        } else {
          apiErrors[years[index]] = result.reason.message;
        }
      });

      setTopDatasetDownloaded(Object.values(combinedDownloads));
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        download: Object.keys(apiErrors).length ? apiErrors : "",
      }));
    });
  };
  const callTopDatasetSubscribedApi = (year) => {
    const getTopDatasetSubscribedData = async () => {
      return await getTopDatasetSubscribedApi("year=" + year);
    };
    getTopDatasetSubscribedData()
      .then((res) => {
        let array = [];
        res?.forEach((element) => {
          array.push({
            name: element[0],
            UsersSubscribed: element[1],
          });
        });
        setTopDatasetSubscribed(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          subscribe: "",
        }));
      })
      .catch((error) => {
        setTopDatasetSubscribed([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          subscribe: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callTopDatasetSubscribedApiForYears = (years) => {
    const requests = years.map((year) =>
      getTopDatasetSubscribedApi("year=" + year)
        .then((res) =>
          res?.map((entry) => ({
            name: entry[0],
            UsersSubscribed: entry[1],
          }))
        )
        .catch((error) => {
          throw {
            year,
            message: error?.response?.data?.message || error?.message,
          };
        })
    );

    Promise.allSettled(requests).then((results) => {
      const combinedSubscriptions = {};
      const apiErrors = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          result.value.forEach(({ name, UsersSubscribed }) => {
            if (!combinedSubscriptions[name]) {
              combinedSubscriptions[name] = {
                name,
                UsersSubscribed: 0,
              };
            }
            combinedSubscriptions[name].UsersSubscribed += UsersSubscribed;
          });
        } else {
          apiErrors[years[index]] = result.reason.message;
        }
      });

      setTopDatasetSubscribed(Object.values(combinedSubscriptions));
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        subscribe: Object.keys(apiErrors).length ? apiErrors : "",
      }));
    });
  };

  return (
    <div ref={listContent} className="mb-5">
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
      {apiErrors.metric?.length > 0 ? (
        <p className="is-invalid-border-only mt-3">{apiErrors.metric}</p>
      ) : null}
      <div className="row">
        <div className="col-6 pe-0">
          <div className="bar_chart">
            <p className="bar_chart_title">Datasets availed by type​​</p>
            {availedTypeDataSet?.length > 0 ? (
              <BarCharts data={availedTypeDataSet}></BarCharts>
            ) : (
              <p className="empty">
                {apiErrors.type?.length > 0
                  ? apiErrors.type
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-6 pe-0">
          <div className="line_chart">
            <p className="line_chart_title">Trend of datasets availed​</p>
            {trendDataSet?.length > 0 ? (
              <LineCharts data={trendDataSet}></LineCharts>
            ) : (
              <p className="empty">
                {apiErrors.trend?.length > 0
                  ? apiErrors.trend
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-6 pe-0">
          <div className="bar_chart">
            <p className="bar_chart_title">Top datasets downloaded ​​</p>
            {topDatasetDownloaded?.length > 0 ? (
              <VerticalBarChart
                data={topDatasetDownloaded}
                xAxisName={"No. of downloads"}
              ></VerticalBarChart>
            ) : (
              <p className="empty">
                {apiErrors.download?.length > 0
                  ? apiErrors.download
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-6 pe-0">
          <div className="bar_chart">
            <p className="bar_chart_title">Top datasets subscribed ​​</p>
            {topDatasetSubscribed?.length > 0 ? (
              <VerticalBarChart
                data={topDatasetSubscribed}
                xAxisName={"No. of subscribes"}
              ></VerticalBarChart>
            ) : (
              <p className="empty">
                {apiErrors.subscribe?.length > 0
                  ? apiErrors.subscribe
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCatalogueDashboard;
