import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import DataSetsOrServiceForm from "../datasetsorservicecommon/DatasetsOrServiceForm";
import { servicesetRequestDetailAPI } from "../../../services/apiservices";

const ServiceRequestManagementDetails = () => {
  let navigate = useNavigate();
  // const [apiErrors, setApiErrors] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [paymentAction, setPaymentAction] = useState(false);
  const [disableReject, setDisableReject] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleServiceSubmit = (formData, data) => {
    if (data.feeType === "UNPAID" || data.feeType === "FREE") {
      setDisableReject(true);
    }
    const updatedData = {
      id: data.id,
      adminRemarks: formData.adminRemarks
        ? formData.adminRemarks
        : data.adminRemarks, // Modify the 'name' property
      modifiedFeeAmount:
        data.feeType === "UNPAID" || data.feeType === "FREE"
          ? 0
          : formData.modifiedFeeAmount === undefined
            ? parseInt(data.feeAmount)
            : parseInt(formData.modifiedFeeAmount),
      reasonForFeeChange:
        data.feeType === "UNPAID" || data.feeType === "FREE"
          ? null
          : formData.modifiedFeeAmount === undefined
            ? null
            : formData.reasonForFeeChange,
      isFeeModified:
        data.feeType === "UNPAID" || data.feeType === "FREE"
          ? false
          : formData.modifiedFeeAmount === undefined
            ? false
            : true,
      feeType:
        data.feeType === "UNPAID"
          ? "UNPAID"
          : data.feeType === "FREE"
            ? "FREE"
            : "PAID",
      status: isRejected ? "REQUEST_REJECTED" : "REQUEST_APPROVED",
      userId: "cfe1ab16-a920-42cd-a29c-f792adafd1c0",
    };
    setErrorMessage('')
    const postRegister = async () => {
      return servicesetRequestDetailAPI(updatedData);
    };
    postRegister()
      .then((response) => {
        if (response.message === "ServiceSet request processed successfully." || response.message === 'Request processed successfully') {
          if (isRejected) {
            setShowConfirmModal(false);
          }
          setSuccessMessage(response.message)
          setErrorMessage('')
          setTimeout(() => {
            navigate("/admin/requestmanagement/servicerequestmanagement");
            setSuccessMessage('')
          }, 3000)
        } else {
          // setApiErrors(response?.message);
          setErrorMessage(response?.message)
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          // setApiErrors(error.response.data.message);
          setErrorMessage(error.response.data.message)
        } else {
          // setApiErrors(error?.message);
          setErrorMessage(error?.message)
        }
      });
  };

  const handleRejectModal = () => {
    setShowConfirmModal(true);
  };

  const showButtons = () => {
    setShowActions(true);
  };

  const showIsRejected = () => {
    setIsRejected(true);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          action="reject"
          category="serviceset request"
          onYesClick={showIsRejected}
          onNoClick={hideConfirmModal}
        />
      )}
      <DataSetsOrServiceForm
        disableReject={disableReject}
        showActions={showActions}
        showButtons={showButtons}
        isRejected={isRejected}
        label="Service"
        formField="Service"
        handleServiceSubmit={handleServiceSubmit}
        handleRejectModal={handleRejectModal}
        paymentAction={paymentAction}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      {/* <p className="is-invalid-border-only mt-2">{apiErrors}</p> */}
    </>
  );
};

export default ServiceRequestManagementDetails;
