import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import useMasterData from "../../hooks/useMasterData";
import ButtonComponent from "../../components/common/ui/button/ButtonComponent";
import { getQueryDataApi, updateQueryAPI } from "../../services/apiservices";
import "../../assets/styles/formcomponent.scss";
import "../../assets/styles/viewdataset.scss";

const ViewHelpQuery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [queryData, setQueryData] = useState({});
  const [loader, setLoader] = useState(false);
  const [apiErrors, setApiErrors] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const { data: queryStatus } = useMasterData("query-status", "admin");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    setApiErrors("");
    const fetchData = async () => {
      return getQueryDataApi(id);
    };
    fetchData()
      .then((response) => {
        if (response?.id) {
          setQueryData(response);
          setValue("remarks", response?.remarks);
          setValue("status", response?.status);
        } else {
          setQueryData({});
          setApiErrors(response.error);
        }
      })
      .catch((error) => {
        setApiErrors(error?.message);
      });
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setValue("status", queryData?.status);
  }, [queryStatus])

  const handleSubmitQuery = (data) => {
    let obj = queryData;
    obj.status = data?.status
    obj.remarks = data?.remarks;
    setLoader(true);
    setApiErrors("");
    const updateQuery = async () => {
      return updateQueryAPI(obj);
    };

    updateQuery()
      .then((response) => {
        setLoader(false);
        if (response?.message === "Query updated Successfully" || response.message.includes("Query is resolved and mail will be sent shortly to")) {
          setApiMessage(response.message);
          setTimeout(() => navigate("/admin/helpsupport"), 3000);
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

  return (
    <div className="dataset mb-5">
      <h3 className="dataset_title">View Query</h3>
      <div className="formComponent w-50">
        <Form>
          <Form.Label>Query No.</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={queryData?.sequenceId ? queryData.sequenceId : ""}
          />
          <Form.Label>User name</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={queryData?.email}
          />
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={queryData?.category}
          />
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={queryData?.subject}
          />
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            className="mb-3"
            disabled
            value={queryData?.message}
          />
          <Form.Label>Submission date</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            value={queryData?.submissionDate}
          />
          <Form.Label>Last updated on</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={queryData?.lastUpdatedOn}
          />
          <div>
            <FloatingLabel controlId="remarks" label="Remarks" className="mb-3 floating_textarea_label">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Remarks"
                disabled={loader}
                required
                maxLength={400}
                className={errors.remarks ? "is-invalid-border-only" : ""}
                {...register("remarks", {
                  required: "Remarks is required",
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
          <div className="mb-5 mt-2">
            <FloatingLabel controlId="status" label="Status" className="mb-3">
              <Form.Select
                aria-label="Status"
                name="status"
                disabled={loader}
                className={errors.status ? "is-invalid-border-only" : ""}
                required
                {...register("status", {
                  required: "Status is required",
                })}
              >
                <option value="">Select</option>
                {queryStatus.length > 0 &&
                  queryStatus.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
              </Form.Select>
              <span className="is-invalid-border-only">
                {errors.status && (
                  <span className="is-invalid-border-only">
                    {errors.status.message}
                  </span>
                )}
              </span>
            </FloatingLabel>
          </div>
        </Form>
        <div className="submit-btn">
          <ButtonComponent
            type="primaryBlue"
            onClick={handleSubmit(handleSubmitQuery)}
            disabled={apiMessage.length > 0}
          >
            {loader && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="output"
                aria-hidden="true"
              />
            )}
            Submit
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

export default ViewHelpQuery;
