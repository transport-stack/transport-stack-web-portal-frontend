import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { ShimmerTable } from "react-shimmer-effects";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import ReactTableComponent from "../../../components/common/ui/table/ReactTableComponent";
import { searchAuditLogApi } from "../../../services/apiservices";
import "../../../components/common/ui/table/TableComponent.scss";
import "../../../assets/styles/formcomponent.scss";

const AuditLogs = () => {
  const [loader, setLoader] = useState();
  const [apiErrors, setApiErrors] = useState("");
  const [userName, setUserName] = useState("");
  const [requestNo, setRequestNo] = useState("");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingId, setSortingId] = useState("lastModifiedDate");
  const [sortingOrder, setSortingOrder] = useState("asc");
  const columns = React.useMemo(
    () => [
      { Header: "Request No.", accessor: "refSequenceId" },
      { Header: "User Email Id", accessor: "userEmail" },
      { Header: "Date Created", accessor: "creationDate" },
      { Header: "Date Modified", accessor: "lastModifiedDate" },
      { Header: "Action taken", accessor: "eventAction" },
      { Header: "Action details", accessor: "eventReason" },
      { Header: "Admin Name", accessor: "adminEmail" },
    ],
    []
  );

  useEffect(() => {
    handleSearch();
  }, [currentPage, sortingId, sortingOrder]);

  const handleSearch = () => {
    if (requestNo.length > 0) callAuditLogApi("&logId=" + requestNo);
    else callAuditLogApi("&userEmailId=" + userName);
  };

  const callAuditLogApi = (data) => {
    let params =
      "page=" +
      (currentPage - 1) +
      "&size=10&sortBy=" +
      sortingId +
      "&sortDir=" +
      sortingOrder +
      data;
    const searchAuditLogList = async () => {
      return searchAuditLogApi(params);
    };
    searchAuditLogList()
      .then((res) => {
        setData(res.content.length > 0 ? res.content : []);
        setTotalPages(res.totalPages);
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
  };

  const changeInputValue = (data, name) => {
    if (name === "name") {
      setUserName(data);
      setRequestNo("");
    } else {
      setRequestNo(data);
      setUserName("");
    }
    setApiErrors("");
  };

  return (
    <div className="">
      <div className="formComponent mb-4">
        <Row>
          <Col md={6}>
            <div className="table-search">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Enter User name"
                  value={userName}
                  onChange={(e) => changeInputValue(e.target.value, "name")}
                />
              </div>
              <p>OR</p>
              <div className="mb-3 mt-2">
                <input
                  type="text"
                  value={requestNo}
                  placeholder="Enter Request No."
                  onChange={(e) => changeInputValue(e.target.value, "num")}
                />
              </div>
              <ButtonComponent
                type="primaryBlue"
                onClick={() => handleSearch()}
                disabled={requestNo.length < 1 && userName.length < 1}
              >
                Search
              </ButtonComponent>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        {loader ? (
          <ShimmerTable row={10} col={8} />
        ) : (
          <ReactTableComponent
            columns={columns}
            data={data.length > 0 ? data : []}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setSortingId={setSortingId}
            setSortingOrder={setSortingOrder}
          ></ReactTableComponent>
        )}
      </div>
      <p className="is-invalid-border-only mt-2 mb-3">{apiErrors}</p>
    </div>
  );
};

export default AuditLogs;
