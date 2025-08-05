import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import { getPendingRequestDetailsAPI, updateRequestAPI } from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";


const ViewRequest = () => {
  const { userid, id, entityname } = useParams();
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState({});
  const [loader, setLoader] = useState(false);
  const [apiErrors, setApiErrors] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleButtonClick = (action) => {
    handleSubmit((data) => handleSubmitRequest(data, action))();
  }

  const handleSubmitRequest = (data, action) => {
    const obj = {
      "id": requestData.requestId,
      "userId": requestData.userId,
      "documentId": requestData.resourceId,
      "status": action === 'approve' ? "Delete Request Approved" : "Delete Request Rejected",
      "remarks": data.remarks
    }
    setLoader(true);
    setApiErrors("");
    const updateRequest = async () => {
      return updateRequestAPI(obj);
    };

    updateRequest()
      .then((response) => {
        setLoader(false);
        if (response?.message === "Document successfully deleted." || response?.message === "Document deletion request has been denied.") {
          setApiMessage(response.message);
          setTimeout(() => navigate("/admin/adminmanagement/pendingrequests/" + userid), 3000);
        } else {
          setApiErrors(response?.message);
        }
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

  useEffect(() => {
    setApiErrors("");
    const fetchData = async () => {
      let params =
        "requestId=" +
        id +
        "&entityName=" + entityname;
      return getPendingRequestDetailsAPI(params, userid);
    };
    fetchData()
      .then((response) => {
        if (response?.requestId) {
          setRequestData(response);
        } else {
          setRequestData({});
          setApiErrors(response.error);
        }
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
    window.scrollTo(0, 0);
  }, [id]);


  return (
    <div className="dataset mb-5">
      <h2 className="form-title mb-4">Request Detail</h2>
      <div className="formComponent w-50">
        <Form>
          <Form.Label>Request No.</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={requestData?.requestId}
          />
          <Form.Label>Request Type</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={requestData?.displayRequestType}
          />
          <Form.Label>User name</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={requestData?.firstName}
          />
          <Form.Label>Resource Name</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={requestData?.resourceName}
          />
          <Form.Label>Status</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={requestData?.displayStatus}
          />
          <div>
            <FloatingLabel controlId="remarks" label="Remarks" className="mb-3 floating_textarea_label">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Remarks"
                disabled={loader}
                maxLength={400}
                className={errors.remarks ? "is-invalid-border-only" : ""}
                {...register("remarks", {
                })}
              />
              <span className="is-invalid-border-only">
                {errors.remarks && (
                  <span className="is-invalid-border-only">
                    {errors.remarks.message}
                  </span>
                )}
              </span>
            </FloatingLabel>
          </div>
        </Form>
        <div className="submit-btn">
          <ButtonComponent
            type="primaryBlue"
            onClick={() => handleButtonClick('approve')}
            disabled={apiMessage.length > 0}
          >
            Approve
          </ButtonComponent>
          <ButtonComponent
            type="primaryBlue"
            onClick={() => handleButtonClick('reject')}
            disabled={apiMessage.length > 0}
          >
            Reject
          </ButtonComponent>
          <ButtonComponent type="primaryWhite" onClick={() => navigate(-1)}>
            Back
          </ButtonComponent>
        </div>
        <p className="is-invalid-border-only mt-2">{apiErrors}</p>
        <p className="success-message mt-2"> {apiMessage}</p>
      </div>
    </div>
  );
};

export default ViewRequest;
