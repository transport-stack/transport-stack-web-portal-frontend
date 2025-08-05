import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { ShimmerTable } from "react-shimmer-effects";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import ViewReportsColumn from "../../../components/common/ui/table/ViewReportsColumn";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import ReactTableComponent from "../../../components/common/ui/table/ReactTableComponent";
import DatePickerComponent from "../../../components/common/ui/datepicker/DatePickerComponent";
import { downloadFileAPI, getViewReportsApi } from "../../../services/apiservices";
import "../../../components/common/ui/table/TableComponent.scss";
import "../../../assets/styles/formcomponent.scss";

const ViewReports = () => {
  const [columName, setColumName] = useState("");
  const viewReportsColumn = ViewReportsColumn(columName);
  const [loader, setLoader] = useState();
  const [apiErrors, setApiErrors] = useState("");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportTypeText, setReportTypeText] = useState("");
  const [tableName, setTableName] = useState();
  const [reportTypeDrop, setReportTypeDrop] = useState([]);
  const [statusReportDrop, setStatusReportDrop] = useState([]);
  const [transactionReportDrop, setTransactionReportDrop] = useState([]);
  const [sortingOrder, setSortingOrder] = useState("asc");
  const [formData, setFormData] = useState({});
  const dataList = [
    {
      name: "User Report",
      path: "api/report/user-status",
      page: "page",
      size: "size",
      sortingId: "sortField",
      sortingOrder: "sortDirection",
      reportDate: "reportDate",
      defaultSortId: "firstName",
    },
    {
      name: "Data Set Report",
      path: "api/report/data-set-status-report",
      page: "page",
      size: "size",
      sortingId: "sortField",
      sortingOrder: "sortDirection",
      reportDate: "reportDate",
      defaultSortId: "datePublished",
    },
    {
      name: "Service Report",
      path: "api/report/service-set-status-report",
      page: "page",
      size: "size",
      sortingId: "sortField",
      sortingOrder: "sortDirection",
      reportDate: "reportDate",
      defaultSortId: "datePublished",
    },
    {
      name: "Document Report",
      path: "api/report/document-view-reports",
      page: "page",
      size: "size",
      sortingId: "sortBy",
      sortingOrder: "sortDir",
      reportDate: "reportDate",
      defaultSortId: "id",
    },
    {
      name: "Data Request Report",
      path: "api/report/data-set-request-report",
      page: "page",
      size: "size",
      sortingId: "sortField",
      sortingOrder: "sortDirection",
      toDate: "toDate",
      fromDate: "fromDate",
      defaultSortId: "requestDate",
    },
    {
      name: "Service Request Report",
      path: "api/report/service-set-request-report",
      page: "page",
      size: "size",
      sortingId: "sortField",
      sortingOrder: "sortDirection",
      toDate: "toDate",
      fromDate: "fromDate",
      defaultSortId: "requestDate",
    },
    {
      name: "Help & Support Report",
      path: "api/report/help-support-view-reports",
      page: "page",
      size: "size",
      sortingId: "sortBy",
      sortingOrder: "sortDir",
      toDate: "toDate",
      fromDate: "fromDate",
      defaultSortId: "id",
    },
  ];
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    setReportTypeDrop([
      {
        label: "Status Report",
        value: 1,
      },
      {
        label: "Transaction Report",
        value: 2,
      },
    ]);
    setStatusReportDrop([
      {
        label: "User Report",
        value: 1,
      },
      {
        label: "Data Set Report",
        value: 2,
      },
      {
        label: "Service Report",
        value: 3,
      },
      {
        label: "Document Report",
        value: 4,
      },
    ]);
    setTransactionReportDrop([
      {
        label: "Data Request Report",
        value: 1,
      },
      {
        label: "Service Request Report",
        value: 2,
      },
      {
        label: "Help & Support Report",
        value: 3,
      },
    ]);
  }, []);

  useEffect(() => {
    callReportsApi(formData);
  }, [currentPage, sortingOrder]);

  const handleSubmitClick = (data) => {
    setTableName("");
    setCurrentPage(1);
    if (data.fromDate && data.toDate) {
      if (validateDates(data)) {
        data.fromDate = dateFormat(data.fromDate);
        data.toDate = dateFormat(data.toDate);
        callReportsApi(data);
      }
    } else {
      data.date = dateFormat(data.date);
      callReportsApi(data);
    }
  };

  const callReportsApi = (data) => {
    setFormData(data);
    let name = "";
    if (data.transactionReportId?.length > 0) {
      setTableName(data.transactionReportId);
      name = data.transactionReportId;
    } else {
      setTableName(data.statusReportId);
      name = data.statusReportId;
    }
    setColumName(name);
    dataList.forEach((element) => {
      if (element.name === name) {
        let path =
          element.path +
          "?" +
          element.page +
          "=" +
          (currentPage - 1) +
          "&" +
          element.size +
          "=10&" +
          element.sortingId +
          "=" +
          element.defaultSortId +
          "&" +
          element.sortingOrder +
          "=" +
          sortingOrder +
          (data.date ? "&" + element.reportDate + "=" + data.date : "") +
          (data.toDate ? "&" + element.toDate + "=" + data.toDate : "") +
          (data.fromDate ? "&" + element.fromDate + "=" + data.fromDate : "");
        const getReportsList = async () => {
          return getViewReportsApi(path);
        };
        getReportsList()
          .then((res) => {
            res?.content.forEach((element) => {
              if (element.firstName)
                element.firstName = element.firstName + " " + element?.lastName;
            });
            setData(res?.content?.length > 0 ? res.content : []);
            setTotalPages(res?.totalPages);
            setApiErrors("");
            setLoader(false);
          })
          .catch((error) => {
            setLoader(false);
            if (error?.response?.data?.message) {
              setApiErrors(error?.response.data.message);
            } else {
              setApiErrors(error?.message);
            }
          });
      }
    });
  };

  const handleReportTypeChange = (event) => {
    const selectedText = event.target.options[event.target.selectedIndex].text;
    setReportTypeText(selectedText);
    setValue("statusReportId", "");
    setValue("transactionReportId", "");
    setValue("date", null);
    setValue("fromDate", null);
    setValue("toDate", null);
  };

  const validateDates = (data) => {
    if (data.fromDate && data.toDate && data.toDate < data.fromDate) {
      setError("toDate", {
        type: "manual",
        message: "End date must be greater than or equal to start date",
      });
      return false;
    }
    clearErrors("toDate");
    return true;
  };

  const dateFormat = (date) => {
    if (!date) {
      return "";
    }
    if (isNaN(date.getTime())) {
      return "";
    }
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // const exportToPDF = () => {
  //   console.log("called exportToPDF ........");
  // };

  const exportToExcel = () => {
    let reportType = '';
    let reportName = '';
    let reportStartDate = ''
    if (reportTypeText === 'Status Report') {
      reportType = 'Status';
      reportName = getValues("statusReportId").replaceAll(" ", "_")
      reportStartDate = dateFormat(getValues("date"));
    } else if (reportTypeText === 'Transaction Report') {
      reportType = 'Transaction';
      reportName = getValues("transactionReportId").replaceAll(" ", "_");
      if (reportName === 'Help_&_Support_Report') {
        reportName = 'Help_And_Support_Report'
      }
      reportStartDate = dateFormat(getValues("fromDate"));
    }
    const params = (reportTypeText === 'Transaction Report') ? "&endDate=" + dateFormat(getValues("toDate")) : "";
    const fileurl = "/api/report/export/excel?reportType=" + reportType
      + "&reportName=" + reportName
      + "&startDate=" + reportStartDate
      + params;
    const downloadFile = async () => {
      return downloadFileAPI(fileurl, "admin", true);
    };
    downloadFile()
      .then(response => {
        let fileName = '';
        const contentDisposition = response.headers['content-disposition'];
        const match = contentDisposition.match(/filename="(.+)"/);

        if (match) {
          fileName = match[1];
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        // const now = new Date();
        // const formattedDate = String(now.getDate()).padStart(2, '0') + "-" + String(now.getMonth() + 1).padStart(2, '0') + "-" + now.getFullYear();
        // a.download = `${reportName}_${formattedDate}.xlsx`;
        a.download = fileName
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.parentNode.removeChild(a);
      }).catch((error) => {
        if (error?.response?.data?.message) {
          setApiErrors(error?.response?.data.message)
        } else {
          setApiErrors(error?.message)
        }
      });
  };

  return (
    <div className="view_reports">
      <div className="formComponent mb-3">
        <Form>
          <Row className="mb-3">
            <Col md={5} lg={3}>
              <FloatingLabel
                controlId="reportType"
                label="Select Report Type"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Select Report Type"
                  name="reportType"
                  disabled={loader}
                  className={errors.reportType ? "is-invalid-border-only" : ""}
                  {...register("reportType", {})}
                  onChange={handleReportTypeChange}
                >
                  <option value="">Select</option>
                  {reportTypeDrop?.length > 0 &&
                    reportTypeDrop.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          {reportTypeText === "Status Report" && (
            <Row>
              <Col md={5} lg={3}>
                <FloatingLabel
                  controlId="statusReportId"
                  label="Status Report"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Status Report"
                    name="statusReportId"
                    disabled={loader}
                    className={
                      errors.statusReportId ? "is-invalid-border-only" : ""
                    }
                    required
                    {...register("statusReportId", {
                      required: "Status Report is required",
                    })}
                  >
                    <option value="">Select</option>
                    {statusReportDrop?.length > 0 &&
                      statusReportDrop.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                  </Form.Select>
                  <span className="is-invalid-border-only">
                    {errors.statusReportId && (
                      <span className="is-invalid-border-only">
                        {errors.statusReportId.message}
                      </span>
                    )}
                  </span>
                </FloatingLabel>
              </Col>
              <Col md={5} lg={3}>
                <DatePickerComponent
                  control={control}
                  name="date"
                  rules={{ required: "Date is required" }}
                  placeholderText="Date"
                  defaultValue={null}
                  required="true"
                />
              </Col>
              <Col md={5} lg={3}>
                <div className="submit-btn">
                  <ButtonComponent
                    type="primaryBlue"
                    onClick={handleSubmit(handleSubmitClick)}
                  >
                    {loader && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    Go
                  </ButtonComponent>
                </div>
              </Col>
            </Row>
          )}
          {reportTypeText === "Transaction Report" && (
            <Row>
              <Col md={5} lg={3}>
                <FloatingLabel
                  controlId="transactionReportId"
                  label="Transaction Report"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Transaction Report"
                    name="transactionReportId"
                    disabled={loader}
                    className={
                      errors.transactionReportId ? "is-invalid-border-only" : ""
                    }
                    required
                    {...register("transactionReportId", {
                      required: "Transaction Report is required",
                    })}
                  >
                    <option value="">Select</option>
                    {transactionReportDrop?.length > 0 &&
                      transactionReportDrop.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                  </Form.Select>
                  <span className="is-invalid-border-only">
                    {errors.transactionReportId && (
                      <span className="is-invalid-border-only">
                        {errors.transactionReportId.message}
                      </span>
                    )}
                  </span>
                </FloatingLabel>
              </Col>
              <Col md={5} lg={3}>
                <DatePickerComponent
                  control={control}
                  name="fromDate"
                  rules={{ required: "Start date is required" }}
                  placeholderText="Start Date"
                  defaultValue={null}
                  required="true"
                />
              </Col>
              <Col md={5} lg={3}>
                <DatePickerComponent
                  control={control}
                  name="toDate"
                  rules={{ required: "End date is required" }}
                  placeholderText="End Date"
                  defaultValue={null}
                  required="true"
                />
              </Col>
              <Col md={5} lg={3}>
                <div className="submit-btn">
                  <ButtonComponent
                    type="primaryBlue"
                    onClick={handleSubmit(handleSubmitClick)}
                  >
                    {loader && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    Go
                  </ButtonComponent>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </div>
      <div className="pb-2 d-flex justify-content-between">
        <strong>{tableName}</strong>
        {tableName?.length > 0 && viewReportsColumn?.length > 0 && data?.length > 0 && (
          <div className="">
            <ButtonComponent
              type="primaryBlue"
              onClick={() => exportToExcel()}
            >
              Export to Excel
            </ButtonComponent>
          </div>
        )}
      </div>
      {tableName?.length > 0 && viewReportsColumn?.length > 0 && (
        <div>
          {loader ? (
            <ShimmerTable row={10} col={8} />
          ) : (
            <div className="mb-2">
              <ReactTableComponent
                columns={viewReportsColumn}
                data={data?.length > 0 ? data : []}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setSortingOrder={setSortingOrder}
              ></ReactTableComponent>
            </div>
          )}
        </div>
      )}
      <p className="is-invalid-border-only mt-2 mb-3">{apiErrors}</p>
    </div>
  );
};

export default ViewReports;
