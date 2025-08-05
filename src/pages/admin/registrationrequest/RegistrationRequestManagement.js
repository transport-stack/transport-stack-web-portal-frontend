import React, { useEffect, useRef, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { ShimmerTable } from "react-shimmer-effects";
import { useSelector } from "react-redux";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import RejectModal from "../../../components/admin/RejectModal";
import TableSearch from "../../../components/common/ui/table/TableSearch";
import ReactTableComponent from "../../../components/common/ui/table/ReactTableComponent";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import {
  approveUserAPI,
  deactivateUserAPI,
  getAllUsersAPI,
  getAdminApprovalModeAPI,
  updateAdminApprovalModeAPI,
} from "../../../services/apiservices";
import "../../../assets/styles/accountSetting.scss";
import "../../../assets/styles/formcomponent.scss";
import ApproveIcon from "../../../assets/images/Approve.png";
import DeactivateIcon from "../../../assets/images/Reject.png";

const RegistrationRequestManagement = () => {
  const listcontent = useRef(null);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState();
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [sortingId, setSortingId] = useState("sequenceId");
  const [sortingOrder, setSortingOrder] = useState("desc");
  const [searchValue, setSearchValue] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(false);
  const profile = useSelector((state) => state.auth.admin.profile);
  const { role } = useSelector((state) => state.auth.admin);
  const [message, setMessage] = useState("");
  const columns = React.useMemo(
    () => [
      {
        Header: "Request No.",
        accessor: "sequenceId",
        sortKey: "Inactive",
      },
      {
        Header: "User Name",
        accessor: "userName",
        sortKey: "Inactive",
      },

      { Header: "Email Id", accessor: "email", sortKey: "Inactive" },
      {
        Header: "Submitted Date",
        accessor: "creationDate",
        sortKey: "Inactive",
      },
      {
        Header: "Organization Name",
        accessor: "organizationName",
        sortKey: "Inactive",
      },
      {
        Header: "Type of Organization",
        accessor: "organizationTypeName",
        sortKey: "Inactive",
      },
      {
        Header: "Action",
        id: "action",
        Cell: (data) => {
          return (
            <div className="d-flex">
              <button
                className="table-button"
                onClick={() => handleApprove(data.cell.row.original)}
              >
                <img src={ApproveIcon} alt="approve icon" title="Approve" />
              </button>
              <button
                className="table-button"
                onClick={() => handleReject(data.cell.row.original)}
              >
                <img src={DeactivateIcon} alt="reject icon" title="Reject" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (role.includes("ROLE_SUPER_ADMIN")) {
      const getAdminApprovalMode = async () => {
        return getAdminApprovalModeAPI();
      };
      getAdminApprovalMode()
        .then((res) => {
          if (res?.id) {
            setApprovalStatus(res.toggleState);
          } else setApprovalStatus(false);
        })
        .catch((error) => {
          setApiErrors(error?.message);
        });
    }
  }, []);

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
      return await getAllUsersAPI(params);
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

  const handleApprove = (data) => {
    setApiErrors("");
    setShowApproveModal(true);
    setCurrentUser(data.id);
  };

  const handleReject = (data) => {
    setApiErrors("");
    setShowRejectModal(true);
    setCurrentUser(data.id);
  };

  const reject = (e) => {
    let userData = {
      reason: e.reason,
      userId: currentUser,
      adminId: profile?.id,
    };
    setShowRejectModal(false);
    const deactivateUser = async () => {
      return deactivateUserAPI(userData);
    };
    deactivateUser()
      .then((response) => {
        if (response?.message === "User deactivated successfully") {
          fetchData();
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setApiErrors(error.response.data.message);
        } else {
          setApiErrors(error?.message);
        }
      });
  };

  const approve = () => {
    let userData = {
      userId: currentUser,
    };
    const activateUser = async () => {
      return approveUserAPI(userData);
    };
    activateUser()
      .then((response) => {
        if (response?.message === "User activated successfully") {
          setShowApproveModal(false);
          fetchData();
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setApiErrors(error.response.data.message);
        } else {
          setApiErrors(error?.message);
        }
      });
  };

  const hideApproveModal = () => {
    setShowApproveModal(false);
  };

  const hideRejectModal = () => {
    setShowRejectModal(false);
  };

  const changeApprovalStatus = () => {
    setApprovalStatus(!approvalStatus);
    const updateAdminApprovalMode = async () => {
      let Request = {
        settingName: "admin_approval_mode",
        toggleState: !approvalStatus,
      };
      return updateAdminApprovalModeAPI(Request);
    };
    updateAdminApprovalMode()
      .then((res) => {
        if (res?.message === "Setting updated successfully.") {
          setMessage(res.message);
        } else setApiErrors(res.message);
        setTimeout(() => setMessage(""), 5000);
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
  };

  return (
    <div className="user_management">
      {apiErrors && (
        <Alert variant="danger" className="text-center">
          {apiErrors}
        </Alert>
      )}
      {showApproveModal && (
        <ConfirmModal
          action="approve"
          category="request"
          onNoClick={hideApproveModal}
          onYesClick={approve}
          showError={apiErrors !== null}
          errorMessage={apiErrors}
          confirmModal={setShowApproveModal}
        />
      )}
      {showRejectModal && (
        <RejectModal
          headerMessage="Reject request"
          onNoClick={hideRejectModal}
          onYesClick={reject}
          label='Reason for Rejecting the request?'
        />
      )}
      <div ref={listcontent}>
        <Row className="mb-4">
          <Col md={6}>
            <TableSearch
              placeholder="Enter Name or  Email ID"
              setSearchValue={setSearchValue}
            />
          </Col>
          {role.includes("ROLE_SUPER_ADMIN") ? (
            <Col md={6} className="justify-content-end d-flex setting mt-0">
              <ButtonComponent
                type="primaryBlue"
                className="d-flex align-items-center"
                style={{ padding: "10px", paddingRight: "26px" }}
              >
                <span>Registration Request Approval Required</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={approvalStatus}
                    onClick={() => changeApprovalStatus()}
                  />
                  <span className="slider round"></span>
                </label>
              </ButtonComponent>
            </Col>
          ) : null}
          <p style={{ color: "green" }}> {message}</p>
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
          <ShimmerTable row={7} col={8} />
        )}
        <p className="is-invalid-border-only mt-2">{apiErrors}</p>
      </div>
    </div>
  );
};

export default RegistrationRequestManagement;
