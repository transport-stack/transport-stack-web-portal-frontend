import React, { useEffect, useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import GraphNotificationCard from "../../../../components/admin/GraphNotificationCard";
import PieCharts from "../../../../components/admin/charts/PieCharts";
import LineCharts from "../../../../components/admin/charts/LineCharts";
import {
  getUserDashboardMetrics,
  getUserDashboardPieChartApi,
  getUserDashboardLineChartApi,
} from "../../../../services/apiservices";
import "../../../../assets/styles/reportManagementDashboard.scss";
import "../../../../assets/styles/formcomponent.scss";

const UserManagementDashboard = () => {
  const dashboardNotificationList = [
    {
      id: 1,
      name: "Total Registered Users",
      key: "totalActiveUsers",
      value: 0,
    },
    {
      id: 2,
      name: "Users availing datasets",
      key: "usersAvailedDatasets",
      value: 0,
    },
    {
      id: 3,
      name: "Users availing services",
      key: "usersAvailedServices",
      value: 0,
    },
  ];
  const listContent = useRef(null);
  const [selectedYearDrop, setSelectedYearDrop] = useState([]);
  const [dashboardData, setDashboardData] = useState(dashboardNotificationList);
  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [apiErrors, setApiErrors] = useState({ pie: "", line: "" });
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
      callMetricsDataForyears(allYears);
      callPieChartDataForYears(allYears);
      callLineChartDataForYears(allYears);

      window.scrollTo({
        top: listContent.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [selectedYearDrop]);

  const callMetricsDataForyears = async (years) => {
    try {
      let aggregationMap = {};
      for (const year of years) {
        const path = `api/report/user-dashboard/metrics?year=${year}`;
        const res = await getUserDashboardMetrics(path);

        if (res) {
          dashboardNotificationList.forEach(({ name, key }) => {
            const metricValue = res[key] || 0;
            if (!aggregationMap[name]) {
              aggregationMap[name] = { name, value: 0 };
            }

            aggregationMap[name].value += metricValue;
          });
        }
      }
      const aggregatedData = Object.values(aggregationMap);
      setDashboardData(aggregatedData);
    } catch (error) {
      setDashboardData(dashboardNotificationList);
      console.log(error);
    }
  };

  const callMetricsData = (year) => {
    let path = "api/report/user-dashboard/metrics?year=" + year;
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

  const callPieChartDataForYears = async (years) => {
    try {
      const aggregationMap = {};

      for (const yr of years) {
        const res = await getUserDashboardPieChartApi(`year=${yr}`);

        if (Array.isArray(res)) {
          res.forEach((ele) => {
            const orgType = ele.organizationTypeName;
            const count = ele.activeUserCount || 0;

            if (!aggregationMap[orgType]) {
              aggregationMap[orgType] = { name: orgType, value: 0 };
            }

            aggregationMap[orgType].value += count;
          });
        }
      }

      const aggregatedArray = Object.values(aggregationMap);
      const hasData = aggregatedArray.some((item) => item.value > 0);
      setPieChartData(hasData ? aggregatedArray : []);
    } catch (error) {
      setPieChartData([]);
      console.log(error);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        pie: error?.response?.data?.message || error?.message,
      }));
    }
  };

  const callPieChartData = (year) => {
    const getPieChartData = async () => {
      return await getUserDashboardPieChartApi("year=" + year);
    };
    getPieChartData()
      .then((res) => {
        if (res?.length > 0) {
          let array = [];
          let dataStatus = false;
          res.forEach((ele) => {
            if (ele.activeUserCount > 0) dataStatus = true;
            array.push({
              name: ele.organizationTypeName,
              value: ele.activeUserCount,
            });
          });
          dataStatus ? setPieChartData(array) : setPieChartData([]);
        } else setPieChartData([]);
      })
      .catch((error) => {
        setPieChartData([]);
        console.log(error);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          pie: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const callLineChartDataForYears = async (years) => {
    try {
      const monthYearMap = {};
      for (const yr of years) {
        const res = await getUserDashboardLineChartApi(`year=${yr}`);
        if (res) {
          Object.values(res).forEach((item) => {
            const month = item.monthName.substring(0, 3); // "Jan"
            const key = `${month} ${yr.toString().slice(-2)}`; // "Jan 24"
            monthYearMap[key] = (monthYearMap[key] || 0) + item.count;
          });
        }
      }
      const allKeys = Object.keys(monthYearMap).sort((a, b) => {
        // Optional: sort chronologically, if needed
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
      // Sort by actual date (important for cumulative)
      finalArray.sort((a, b) => {
        const parseDate = (str) => {
          const [month, year] = str.split(" ");
          return new Date(`1 ${month} 20${year}`);
        };
        return parseDate(a.name) - parseDate(b.name);
      });
      const slicedData = finalArray.slice(-12);
      setLineChartData(slicedData);
      setApiErrors((prevErrors) => ({ ...prevErrors, line: "" }));
    } catch (error) {
      setTotalCount(0);
      setLineChartData([]);
      setApiErrors((prevErrors) => ({
        ...prevErrors,
        line: error?.response?.data?.message || error?.message || "Chart Error",
      }));
    }
  };

  const callLineChartData = (year) => {
    const getLineChartData = async () => {
      return await getUserDashboardLineChartApi("year=" + year);
    };
    getLineChartData()
      .then((res) => {
        let array = [];
        let count = 0;
        Object.values(res).forEach((key) => {
          array.push({
            name: key.monthName.substring(0, 3),
            count: key.count,
          });
          count += key.count;
        });
        setTotalCount(count);
        setLineChartData(array);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          line: "",
        }));
      })
      .catch((error) => {
        setTotalCount(0);
        setLineChartData([]);
        setApiErrors((prevErrors) => ({
          ...prevErrors,
          line: error?.response?.data
            ? error?.response?.data.message
            : error?.message,
        }));
      });
  };

  const handleSelectedYearChange = (event) => {
    if (event.target.value === "All") {
      const allYears = selectedYearDrop
        .filter((item) => item.label !== "All")
        .map((item) => item.label);
      callMetricsDataForyears(allYears);
      callPieChartDataForYears(allYears);
      callLineChartDataForYears(allYears);
    } else {
      callMetricsData(event.target.value);
      callPieChartData(event.target.value);
      callLineChartData(event.target.value);
    }
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
      <div className="row">
        <div className="col-4 pe-0">
          <div className="pie_chart">
            <p className="pie_chart_title">Users by Type​</p>
            {pieChartData?.length > 0 ? (
              <PieCharts data={pieChartData}></PieCharts>
            ) : (
              <p className="empty">
                {apiErrors.pie?.length > 0
                  ? apiErrors.pie
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
        <div className="col-8 pe-0">
          <div className="line_chart">
            <div className="d-flex justify-content-between">
              <p className="line_chart_title">Registrations Trends​</p>
            </div>
            {lineChartData?.length > 0 ? (
              <LineCharts
                data={lineChartData}
                yAxisName={"Total Number of Registrations"}
              ></LineCharts>
            ) : (
              <p className="empty">
                {apiErrors.line?.length > 0
                  ? apiErrors.line
                  : "No data available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;
