import React, { useEffect, useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import GraphNotificationCard from "../../../../components/admin/GraphNotificationCard";
import BarWithLineChart from "../../../../components/admin/charts/BarWithLineChart";
import {
  getUserDashboardMetrics,
  getBreakdownDataApi,
} from "../../../../services/apiservices";
import "../../../../assets/styles/reportManagementDashboard.scss";
import "../../../../assets/styles/formcomponent.scss";

const HelpSupportDashboard = () => {
  const listcontent = useRef(null);
  const dashboardNotificationList = [
    {
      id: 1,
      name: "Total Support Tickets",
      key: "Total Support Tickets",
      value: 0,
    },
    {
      id: 2,
      name: "% Resolved",
      key: "% Resolved",
      value: 0,
    },
    {
      id: 3,
      name: "Resolution Rate as per SLA",
      key: "Resolution rate As Per SLA",
      value: 0,
    },
    {
      id: 4,
      name: "Average Time taken to resolve",
      key: "Avg Time Taken To resolve",
      value: "0 days",
    },
  ];
  const [dashboardData, setDashboardData] = useState(dashboardNotificationList);
  const [selectedYearDrop, setSelectedYearDrop] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [apiErrors, setApiErrors] = useState("");
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
      callBreakdownDataForYears(allYears);
      window.scrollTo({
        top: listcontent.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [selectedYearDrop]);

  const callMetricsDataForyears = async (years) => {
    const aggregationMap = new Map();
    let totalResolvedEstimate = 0;
    let totalTickets = 0;
  
    for (const year of years) {
      const path = `api/help-support/get-analytics?year=${year}`;
      await getUserDashboardMetrics(path)
        .then((res) => {
          const data = res[0] || {};
          dashboardNotificationList.forEach((element) => {
            const key = element.key;
            const rawValue = parseFloat(data[key]) || 0;
  
            // Skip adding % Resolved to avoid invalid aggregation
            if (key === "% Resolved") return;
  
            const prev = aggregationMap.get(key) || 0;
            aggregationMap.set(key, prev + rawValue);
  
            // Estimate Resolved Count if key is 'Total Support Tickets'
            if (key === "Total Support Tickets") {
              totalTickets += rawValue;
              const pctResolved = parseFloat(data["% Resolved"]) || 0;
              totalResolvedEstimate += (pctResolved / 100) * rawValue;
            }
          });
        })
        .catch((error) => {
          console.error(`Error fetching data for year ${year}:`, error);
        });
    }
  
    // Derive % Resolved properly from estimates
    const finalResolvedPct = totalTickets ? (totalResolvedEstimate / totalTickets) * 100 : 0;
  
    const aggregatedData = dashboardNotificationList.map((element, i) => {
      const key = element.key;
      let value;
      
      if (key === "% Resolved") {
        value = finalResolvedPct.toFixed(2); // or use your formatter
      } else {
        const rawValue = aggregationMap.get(key) || 0;
        value = notificationList(key, [{ [key]: rawValue }]); // your original formatting
      }
  
      return {
        id: i,
        name: element.name,
        value: value,
      };
    });
  
    setDashboardData(aggregatedData);
  };

  const callMetricsData = (year) => {
    let path = "api/help-support/get-analytics?year=" + year;
    const getData = async () => {
      return await getUserDashboardMetrics(path);
    };
    getData()
      .then((res) => {
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
      })
      .catch((error) => {
        setDashboardData(dashboardNotificationList);
        console.log(error);
      });
  };

  const notificationList = (e, res) => {
    if (e == "Avg Time Taken To resolve")
      return res[0][e] + (res[0][e] > 1 ? " days" : " day");
    else return res[0][e];
  };

  const callBreakdownDataForYears = (years) => {
    const fetchDataForYear = (year) => {
      return getBreakdownDataApi("year=" + year).then((res) => {
        if (!Array.isArray(res)) return [];
        return res.map((element) => ({
          year,
          name: element.category,
          tickets: element.total_queries,
          resolved: element.resolved_queries,
        }));
      });
    };
    Promise.all(years.map(fetchDataForYear))
      .then((allData) => {
        const combined = allData.flat(); // Flatten array of arrays
        setBarChartData(combined);
        setApiErrors("");
      })
      .catch((error) => {
        setBarChartData([]);
        setApiErrors(
          error?.response?.data ? error?.response?.data.message : error?.message
        );
      });
  };

  // Breakdown of support tickets by type​
  const callBreakdownData = (year) => {
    const callBreakdownDataApi = async () => {
      return await getBreakdownDataApi("year=" + year);
    };
    callBreakdownDataApi()
      .then((res) => {
        if (!Array.isArray(res) || res.length === 0) {
          setBarChartData([]);
          setApiErrors("No data available");
          return;
        }
        let array = [];
        res.forEach((element) => {
          array.push({
            name: element.category,
            tickets: element.total_queries,
            resolved: element.resolved_queries,
          });
        });
        setBarChartData(array);
        setApiErrors("");
      })
      .catch((error) => {
        setBarChartData([]);
        setApiErrors(
          error?.response?.data ? error?.response?.data.message : error?.message
        );
      });
  };

  const handleSelectedYearChange = (event) => {
    if (event.target.value === "All") {
      const allYears = selectedYearDrop
        .filter((item) => item.label !== "All")
        .map((item) => item.label);
      callMetricsDataForyears(allYears);
      callBreakdownDataForYears(allYears);
    } else {
      callMetricsData(event.target.value);
      callBreakdownData(event.target.value);
    }
  };

  return (
    <div ref={listcontent} className="mb-5 helpsupport_dashboard">
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
            <div key={item.id} className="col-3 pe-0">
              <GraphNotificationCard data={item}></GraphNotificationCard>
            </div>
          );
        })}
      </div>
      <div className="row">
        <div className="col-12 pe-0">
          <div className="bar_chart">
            <p className="bar_chart_title">
              Breakdown of support tickets by type
            </p>
            {barChartData?.length > 0 ? (
              <BarWithLineChart data={barChartData}></BarWithLineChart>
            ) : (
              <p className="empty">
                {apiErrors.length > 0 ? apiErrors : "No data available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportDashboard;
