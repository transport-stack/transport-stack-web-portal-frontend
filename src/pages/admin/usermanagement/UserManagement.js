import React, { useEffect, useRef, useState } from "react";
import { Alert, Col, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import { useSelector } from "react-redux";
import RejectModal from "../../../components/admin/RejectModal";
import TableSearch from "../../../components/common/ui/table/TableSearch";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import ReactTableComponent from "../../../components/common/ui/table/ReactTableComponent";
import {
  activateUserAPI,
  deactivateUserAPI,
  deleteUserAPI,
  getUserLists,
} from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import DeleteIcon from "../../../assets/images/delete-row.svg";
import DeactivateIcon from "../../../assets/images/deactivate.svg";
import ReActivateIcon from "../../../assets/images/Reactivate.png";
import AddIcon from "../../../assets/images/add-fill-icon.svg";

const UserManagement = () => {
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
        Header: "User Id",
        accessor: "sequenceId",
        Cell: (e) => (
          <button
            className="has-link"
            onClick={() =>
              navigate("/admin/usermanagement/viewuser/" + e.cell.row.original.id)
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
        sortKey: "Inactive",
      },

      {
        Header: "Email Id",
        accessor: "email",
        sortKey: "Inactive",
      },
      {
        Header: "No. of Datasets",
        accessor: "numberOfDatasetsAvailed",
        sortKey: "Inactive",
      },
      {
        Header: "No. of Services",
        accessor: "numberOfServicesAvailed",
        sortKey: "Inactive",
      },
      { Header: "Registration Date", accessor: "creationDate", sortKey: "Inactive", },
      { Header: "Last Activity Date", accessor: "lastModifiedDate", sortKey: "Inactive", },
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
      return await getUserLists(params);
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

  const deactivateUser = (data) => {
    setLoader(true);
    let userData = {
      userId: currentUser,
      reason: data.reason,
      adminId: adminID,
    };
    const deactivateUserPost = async () => {
      return deactivateUserAPI(userData);
    };
    deactivateUserPost()
      .then((response) => {
        if (response?.message === "User deactivated successfully") {
          setShowDeactivateModal(false);
          fetchData();
          setLoader(false);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setApiErrors(error?.response.data.message);
        } else {
          setApiErrors(error?.message);
        }
      });
  };

  const activateUser = (data) => {
    setLoader(true);
    let userData = {
      userId: currentUser,
      reason: data.reason,
      adminId: adminID,
    };
    const activateUserPost = async () => {
      return activateUserAPI(userData);
    };
    activateUserPost()
      .then((response) => {
        if (response?.message === "User reactivated successfully") {
          setShowDeactivateModal(false);
          fetchData();
          setLoader(false);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setApiErrors(error?.response.data.message);
        } else {
          setApiErrors(error?.message);
        }
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
      return deleteUserAPI("user", userData);
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
        if (error?.response?.data?.message) {
          setApiErrors(error?.response.data.message);
        } else {
          setApiErrors(error?.message);
        }

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
      deactivateUser(formData);
    }
    if (userStatus === "DEACTIVATED") {
      activateUser(formData);
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
              onClick={() => navigate("/admin/usermanagement/createnewuser")}
            >
              <Image src={AddIcon} alt="add" />
              Add New User
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

export default UserManagement;
