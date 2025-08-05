import React, { useEffect, useRef, useState } from "react";
import { Alert, Col, Image, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import {
  activateUserAPI,
  deactivateAdminAPI,
  deleteUserAPI,
  getAdminUserList,
} from "../../../services/apiservices";
import RejectModal from "../../../components/admin/RejectModal";
import TableSearch from "../../../components/common/ui/table/TableSearch";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import ReactTableComponent from "../../../components/common/ui/table/ReactTableComponent";
import "../../../assets/styles/formcomponent.scss";
import DeleteIcon from "../../../assets/images/delete-row.svg";
import DeactivateIcon from "../../../assets/images/deactivate.svg";
import ReActivateIcon from "../../../assets/images/Reactivate.png";
import AddIcon from "../../../assets/images/add-fill-icon.svg";

const AdminManagement = () => {
  const navigate = useNavigate();
  const listcontent = useRef(null);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState();
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userStatus, setUserStatus] = useState();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [sortingId, setSortingId] = useState("sequenceId");
  const [sortingOrder, setSortingOrder] = useState("asc");
  const [searchValue, setSearchValue] = useState('');
  const { id: adminID } = useSelector((state) => state.auth.admin.profile);
  const columns = React.useMemo(
    () => [
      {
        Header: "Admin Id",
        accessor: "sequenceId",
        Cell: (e) => (
          <button
            className="has-link"
            onClick={() =>
              navigate("/admin/adminmanagement/viewadmin/" + e.cell.row.original.id)
            }
          >
            {e.value}
          </button>
        ),
        sortKey: "Active",
      },
      {
        Header: "Name",
        accessor: "userName", 
      },
      { Header: "Email Id", accessor: "email", sortKey: "Inactive" },
      {
        Header: "Role",
        accessor: (data) => {
          let output = [];
          if (Array.isArray(data?.roles)) {
            data?.roles.map((item) => {
              if (item === 'ROLE_ADMIN') {
                output.push('Admin');
              } else if (item === 'ROLE_DATA_PROVIDER') {
                output.push('Data Provider');
              } else {
                output.push(item);
              }
            });
          }

          return output.join(", ");
        },
      },
      {
        Header: "No. of Pending Requests", accessor: "numberOfPendingRequests",
        Cell: (e) => (
          parseInt(e.value) > 0 ?
          <button
            className="has-link"
            onClick={() =>
              navigate("/admin/adminmanagement/pendingrequests/" + e.cell.row.original.id)
            }
          >
            {e.value}
          </button> : e.value
        ),
        sortKey: "Inactive",
      },
      { Header: "Last Activity Date", accessor: "lastModifiedDate", sortKey: "Inactive" },
      {
        Header: "Action",
        id: "action",
        Cell: (data) => {
          return (
            <div className="d-flex">
              <button
                className="table-button"
                onClick={() => handleDelete(data.cell.row.original)}
              >
                <img src={DeleteIcon} alt="delete icon" title="Delete" />
              </button>
              {data.cell.row.original.userStatus === "APPROVED" ? (
                <button
                  className="table-button"
                  onClick={() =>
                    handleActivateDeactivate(data.cell.row.original)
                  }
                >
                  <img
                    src={DeactivateIcon}
                    alt="deactivate icon"
                    title="Deactivate"
                  />
                </button>
              ) : (
                <button
                  className="table-button"
                  onClick={() =>
                    handleActivateDeactivate(data.cell.row.original)
                  }
                >
                  <img src={ReActivateIcon} alt="activate icon" title="Activate" />
                </button>
              )}
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
      top: listcontent.current.offsetTop,
      behaviour: "smooth",
    });
    return () => { };
  }, [currentPage, sortingId, sortingOrder, searchValue]);

  const fetchData = () => {
    setLoader(true);
    let params =
      "page=" +
      (currentPage - 1) +
      "&size=10&sortField=" +
      sortingId +
      "&sortDirection=" +
      sortingOrder +
      "&searchTerm=" +
      searchValue;
    const getData = async () => {
      return await getAdminUserList(params);
    };
    getData()
      .then((items) => {
        setData(items?.content);
        setTotalPages(items?.totalPages);
        setApiErrors("");
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        if (error?.response?.data?.message) {
          setApiErrors(error.response.data.message);
        } else {
          setApiErrors(error?.message);
        }
      });
  };

  const handleDelete = (data) => {
    setShowDeleteModal(true);
    setCurrentUser(data.id);
  };

  const handleActivateDeactivate = (data) => {
    setUserStatus(data.userStatus);
    setShowDeactivateModal(true);
    setCurrentUser(data.id);
  };

  const deactivateAdmin = (data) => {
    setLoader(true);
    let userData = {
      userId: currentUser,
      reason: data.reason,
      adminId: adminID,
    };
    const deactivateAdminPost = async () => {
      return deactivateAdminAPI(userData);
    };
    deactivateAdminPost()
      .then((response) => {
        if (response?.message === "User deactivated successfully") {
          setShowDeactivateModal(false);
          fetchData();
          setLoader(false);
        }
      })
      .catch((error) => {
        setApiErrors(error?.message);
        setLoader(false);
      });
  };
  const activateAdmin = (data) => {
    setLoader(true);
    let userData = {
      userId: currentUser,
      reason: data.reason,
      adminId: adminID,
    };
    const activateAdminPost = async () => {
      return activateUserAPI(userData);
    };
    activateAdminPost()
      .then((response) => {
        if (response?.message === "User reactivated successfully") {
          setShowDeactivateModal(false);
          fetchData();
          setLoader(false);
        }
      })
      .catch((error) => {
        setApiErrors(error?.message);
        setLoader(false);
      });
  };

  const handleDeleteUser = (data) => {
    setLoader(true);
    let userData = {
      userId: currentUser,
      reason: data.reason,
      adminId: adminID,
    };
    const deleteUserPost = async () => {
      return deleteUserAPI("super-admin", userData);
    };
    deleteUserPost()
      .then((response) => {
        if (response?.message === "User deleted successfully") {
          setShowDeleteModal(false);
          fetchData();
          setLoader(false);
        }
      })
      .catch((error) => {
        setShowDeleteModal(false);
        setApiErrors(error?.message);
        setLoader(false);
      });
  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const hideDeactivateModal = () => {
    setShowDeactivateModal(false);
  };

  const handleUserAction = (formData, label) => {
    if (userStatus === "APPROVED") {
      deactivateAdmin(formData);
    }
    if (userStatus === "DEACTIVATED") {
      activateAdmin(formData);
    }
  };

  return (
    <div className="user_management">
      {apiErrors && (
        <Alert variant="danger" className="text-center">
          {apiErrors}
        </Alert>
      )}
      {showDeleteModal && (
        <RejectModal
          headerMessage="Delete user"
          onNoClick={hideDeleteModal}
          onYesClick={handleDeleteUser}
          label='Reason for Deleting the User?'
        />
      )}
      {showDeactivateModal && (
        <RejectModal
          headerMessage={userStatus === "APPROVED" ? "Deactivate user" : "Activate user"}
          onNoClick={hideDeactivateModal}
          onYesClick={handleUserAction}
          label={userStatus === "APPROVED" ? "Reason for Deactivating the User?" : 'Reason for Activating the User?'}
        />
      )}
      <div ref={listcontent}>
        <Row className="mb-4">
          <Col md={6}>
            <TableSearch
              placeholder="Enter Name or  Email ID"
              setSearchValue={setSearchValue} />
          </Col>
          <Col md={6} className="text-end">
            <ButtonComponent
              type="primaryWhite"
              className="button-icon"
              onClick={() => navigate("/admin/adminmanagement/createnewadmin")}
              style={{ maxWidth: '180px' }}
            >
              <Image src={AddIcon} alt="add" />
              Add New Admin/ Data Provider
            </ButtonComponent>
          </Col>
        </Row>
        {data && !loader ? (
          <ReactTableComponent
            columns={columns}
            data={data.length > 0 ? data : []}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setSortingId={setSortingId}
            setSortingOrder={setSortingOrder}
          />
        ) : (
          <ShimmerTable row={10} col={7} />
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
