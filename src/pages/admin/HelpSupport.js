import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { ShimmerTable } from "react-shimmer-effects";
import TableSearch from "../../components/common/ui/table/TableSearch";
import ReactTableComponent from "../../components/common/ui/table/ReactTableComponent";
import { getHelpAndSupportList } from "../../services/apiservices";

const HelpSupport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState();
  const [sortingId, setSortingId] = useState("sequenceId");
  const [sortingOrder, setSortingOrder] = useState("desc");
  const [searchValue, setSearchValue] = useState("");
  const columns = React.useMemo(
    () => [
      {
        Header: "Query No.",
        accessor: "sequenceId",
        Cell: (e) => (
          <button
            className="has-link"
            onClick={() =>
              navigate("/admin/helpsupport/viewhelpandsupport/" + e.cell.row.original.id)
            }
          >
            {e.value}
          </button>
        ),
        sortKey: "Active",
      },
      { Header: "User name", accessor: "email", sortKey: "Inactive" },
      {
        Header: "Category",
        accessor: "category",
        sortKey: "Inactive",
      },
      {
        Header: "Subject",
        accessor: "subject",
        sortKey: "Inactive",
      },
      {
        Header: "Submission Date",
        accessor: "submissionDate",
        sortKey: "Inactive",
      },
      { Header: "Status", accessor: "status", sortKey: "Inactive" },
      {
        Header: "Last updated on",
        accessor: "lastUpdatedOn",
        sortKey: "Inactive",
      },
    ],
    []
  );

  useEffect(() => {
    fetchData();
  }, [currentPage, sortingId, sortingOrder, searchValue]);

  const fetchData = () => {
    setLoader(true);
    let params =
      "page=" +
      (currentPage - 1) +
      "&size=10&sortBy=" +
      sortingId +
      "&sortDir=" +
      sortingOrder +
      "&keyword=" +
      searchValue;

    const getData = async () => {
      return await getHelpAndSupportList(params);
    };
    getData()
      .then((res) => {
        let list = [];
        res?.content.forEach((ele) => {
          let obj = {
            id: ele?.id,
            sequenceId: ele?.sequenceId,
            email: ele?.email,
            category: ele?.category,
            subject: ele?.subject,
            submissionDate: ele?.submissionDate,
            status: ele?.status,
            lastUpdatedOn: ele?.lastUpdatedOn,
          };
          list.push(obj);
        });
        setData(list.length > 0 ? list : []);
        setTotalPages(res?.totalPages ? res.totalPages : 1);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
      });
  };
  
  return (
    <div className="container document_management">
      <div>
        <div>
          <Row className="mb-4">
            <Col md={6}>
              <TableSearch
                placeholder="Entry Query No. or User Name"
                setSearchValue={setSearchValue}
              />
            </Col>
          </Row>
        </div>
        {data && !loader ? (
          <ReactTableComponent
            columns={columns}
            data={data.length > 0 ? data : []}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setSortingId={setSortingId}
            setSortingOrder={setSortingOrder}
          ></ReactTableComponent>
        ) : (
          <ShimmerTable row={10} col={7} />
        )}
      </div>
    </div>
  );
};

export default HelpSupport;
