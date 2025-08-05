import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Row } from "react-bootstrap";
import { ShimmerTable } from "react-shimmer-effects";
import ConfirmModal from "../../components/admin/ConfirmModal";
import TableSearch from "../../components/common/ui/table/TableSearch";
import ButtonComponent from "../../components/common/ui/button/ButtonComponent";
import ReactTableComponent from "../../components/common/ui/table/ReactTableComponent";
import {
  getDocumentationList,
  deleteDocumentAPI,
} from "../../services/apiservices";
import AddIcon from "../../assets/images/add-fill-icon.svg";
import EditIcon from "../../assets/images/edit-icon.png";
import DeleteIcon from "../../assets/images/delete-row.svg";

const DocumentManagement = () => {
  const navigate = useNavigate();
  const listcontent = useRef(null);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState();
  const [sortingId, setSortingId] = useState("dateModified");
  const [sortingOrder, setSortingOrder] = useState("desc");
  const [searchValue, setSearchValue] = useState("");
  const [apiErrors, setApiErrors] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentDocumentID, setCurrentDocumentID] = useState("");
  const columns = React.useMemo(
    () => [
      {
        Header: "Document ID",
        accessor: "sequenceId",
        Cell: (e) => (
          <button
            className="has-link"
            onClick={() =>
              navigate("/admin/documentmanagement/viewdocument/" + e.cell.row.original.id)
            }
          >
            {e.value}
          </button>
        ),
        sortKey: "Inactive",
      },
      { Header: "Document Title", accessor: "title", sortKey: "Inactive" },
      {
        Header: "Document Category",
        accessor: "category.name",
        sortKey: "Inactive",
      },
      {
        Header: "Date Modified",
        id: "dateModified",
        sortKey: "Inactive",
        accessor: "dateModified",
      },
      { Header: "Version", accessor: "versions" },
      {
        Header: "Action",
        id: "action",
        Cell: (data) => {
          return (
            <div className="d-flex">
              <button
                className="table-button"
                onClick={() => handleEdit(data.cell.row.original)}
              >
                <img src={EditIcon} alt="edit icon" />
              </button>
              <button
                className="table-button"
                onClick={() => handleDelete(data.cell.row.original)}
              >
                <img src={DeleteIcon} alt="delete icon" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    fetchData();
    window.scrollTo({
      top: listcontent.current?.offsetTop,
      behaviour: "smooth",
    });
    setApiMessage('');
  }, [currentPage, sortingId, sortingOrder, searchValue]);

  const handleEdit = (data) => {
    navigate("/admin/documentmanagement/editdocument/" + data.id);
  };

  const handleDelete = (data) => {
    setCurrentDocumentID(data.id);
    setShowConfirmModal(true);
  };

  const deleteDocumentData = () => {
    const documentID = {
      id: currentDocumentID,
    };
    const deleteDocument = async () => {
      return deleteDocumentAPI(documentID);
    };

    deleteDocument()
      .then((response) => {
        setLoader(false);
        setShowConfirmModal(false);
        setCurrentDocumentID("");
        setApiMessage(response.message);
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

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
      return await getDocumentationList(params);
    };
    getData()
      .then((res) => {
        setData(res?.content ? res.content : []);
        setTotalPages(res?.totalPages ? res.totalPages : 1);
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

  return (
    <div ref={listcontent} className="container document_management">
      {apiMessage && (
        <Alert variant="success" className="text-center">
          {apiMessage}
        </Alert>
      )}
      {apiErrors && (
        <Alert variant="danger" className="text-center">
          {apiErrors}
        </Alert>
      )}
      {showConfirmModal && (
        <ConfirmModal
          action="delete"
          category="document"
          onYesClick={deleteDocumentData}
          onNoClick={hideConfirmModal}
          confirmModal={setShowConfirmModal}
        />
      )}
      <div>
        <Row className="mb-4">
          <Col md={6}>
            <TableSearch
              placeholder="Search for Documents"
              setSearchValue={setSearchValue}
            />
          </Col>
          <Col md={6} className="text-end">
            <ButtonComponent
              type="primaryWhite"
              className="button-icon"
              onClick={() =>
                navigate("/admin/documentmanagement/createdocument")
              }
            >
              <img src={AddIcon} alt="add" /> Add New Documents
            </ButtonComponent>
          </Col>
        </Row>
      </div>
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
  );
};

export default DocumentManagement;
