import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataSetsOrServiceForm from "../datasetsorservicecommon/DatasetsOrServiceForm";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { datasetRequestDetailAPI } from "../../../services/apiservices";

const DataSetsRequestManagementDetails = () => {
  let navigate = useNavigate();
  const [loader, setLoader] = useState(false);
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

  const handleDataSetSubmit = (formData, data) => {
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
    setLoader(true);
    setErrorMessage("");
    const postRegister = async () => {
      return datasetRequestDetailAPI(updatedData);
    };
    postRegister()
      .then((response) => {
        if (response.message === "Request processed successfully." || response.message === 'Request processed successfully') {
          setLoader(false);
          if (isRejected) {
            setShowConfirmModal(false);
          }
          setSuccessMessage(response.message)
          setErrorMessage('')
          setTimeout(() => {
            navigate("/admin/requestmanagement/datasetsrequestmanagement");
            setSuccessMessage('')
          }, 3000)

        } else {
          // setAPIErrors(response?.message);
          setErrorMessage(response?.message)
        }
      })
      .catch((error) => {
        setLoader(false);
        if (error?.response?.data?.message) {
          // setAPIErrors(error.response.data.message);
          setErrorMessage(error.response.data.message)
        } else {
          // setAPIErrors(error?.message);
          setErrorMessage(error?.message)
        }
      });
  };

  const handleRejectModal = () => {
    setShowConfirmModal(true);
  };

  const showIsRejected = () => {
    setIsRejected(true);
  };

  const showButtons = () => {
    setShowActions(true);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          action="reject"
          category="dataset request"
          onYesClick={showIsRejected}
          onNoClick={hideConfirmModal}
        />
      )}

      <DataSetsOrServiceForm
        disableReject={disableReject}
        showActions={showActions}
        showButtons={showButtons}
        isRejected={isRejected}
        label="Data Sets"
        formField="Data"
        handleRejectModal={handleRejectModal}
        handleDataSetSubmit={handleDataSetSubmit}
        paymentAction={paymentAction}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      {/* <p className="is-invalid-border-only mb-3">{apierrors}</p> */}
    </>
  );
};

export default DataSetsRequestManagementDetails;
