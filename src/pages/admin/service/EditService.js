import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import useMasterData from "../../../hooks/useMasterData";
import { formatDate } from "../../../utils/Helper";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import FileUpload from "../../../components/admin/fileupload/FileUpload";
import MultiSelectComponent from "../../../components/common/ui/multiselect/MultiSelectComponent";
import DatePickerComponent from "../../../components/common/ui/datepicker/DatePickerComponent";
import {
  getServiceDetails,
  editServiceAPI,
  getServiceOptionsAPI,
  getDesignatedApproverUsersAPI,
} from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import {useSelector} from "react-redux";

const EditService = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  let navigate = useNavigate();
  const { isAuthenticated, profile } = useSelector((state) => state.auth.admin);
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [documentationFiles, setDocumentationFiles] = useState([]);
  const [licenseFiles, setLicenseFiles] = useState([]);
  const chargingModelId = useWatch({ control, name: "chargingModelId" });
  const [serviceTypeText, setServiceTypeText] = useState("");
  const [datePublished, setDatePublished] = useState("");
  // const [lastModifiedDate, setLastModifiedDate] = useState("");
  const [uploadedDocumentation, setUploadedDocumentation] = useState([]);
  const [uploadedLicense, setUploadedLicense] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [designatedApproverUsers, setDesignatedApproverUsers] = useState([]);
  const { id } = useParams();

  const { data: dataTypeMaster } = useMasterData("service-type", "admin", false);
  const { data: ancillaryServicesMaster } = useMasterData("ancillary-service", "admin");
  const { data: transportModeMaster } = useMasterData("transport-mode", "admin");
  const { data: dataproviderMaster } = useMasterData("data-provider", "admin", false);
  const { data: approvalMechanismMaster } = useMasterData("approval-mechanism", "admin");
  const { data: chargingModelMaster } = useMasterData("charging-model", "admin", false);

  const documentSection = [
    {
      id: "SERVICESET_DOCUMENTATION",
      heading: "Documentation",
      allowMultiple: true,
      uploadedFiles: uploadedDocumentation,
    },
    {
      id: "SERVICESET_LICENSE",
      heading: "License Agreement",
      allowMultiple: false,
      uploadedFiles: uploadedLicense,
    },
  ];

  const getSelectedDataProviderString = (options) => {
    if (!options || options.length === 0) return '';
    return options.map(option => option.label).join(',');
  }

  const fetchDesignatedApproverUsers = async (organizationName) => {
    return getDesignatedApproverUsersAPI(organizationName);
  }

  useEffect(() => {
    if (designatedApproverUsers.length === 0) {
      setValue("designatedApproversIds", []); // Reset the selected value
    }
  }, [designatedApproverUsers, control])

  useEffect(() => {
    const fetchServiceOptions = async () => {
      return getServiceOptionsAPI();
    };
    fetchServiceOptions()
      .then((res) => {
        setServiceOptions(res);
        const fetchDataCardDetails = async () => {
          return getServiceDetails(id);
        };
        fetchDataCardDetails()
          .then((res) => {
            setValue("id", res?.id || "");
            setValue("name", res?.name || "");
            setValue("description", res?.description || "");
            setValue("serviceSetTypeId", res?.serviceSetTypeId || "");
            setServiceTypeText(res?.serviceSetTypeName);
            setValue("ancillaryServiceId", res?.ancillaryServiceId || "");
            setValue("transportModeId", res?.transportModeId || "");
            setValue("version", res?.version || "");
            setValue("updateFrequency", res?.updateFrequency || "");
            setValue("searchTags", res?.searchTags || "");
            setValue("approvalMechanismId", res?.approvalMechanismId || "");
            setValue("chargingModelId", res?.chargingModelId || "");
            setValue("serviceSetMasterId", res?.serviceSetMasterId || "");

            const formattedDate = res?.datePublished ? new Date(res?.datePublished.split("-")[1] + "-" + res?.datePublished.split("-")[0] + "-" + res.datePublished.split("-")[2]) : '';
            setDatePublished(formattedDate);

            reset({
              datePublished: formattedDate,
              // lastModifiedDate: formattedLastDate,
              id: res?.id,
              serviceSetTypeId: res?.serviceSetTypeId,
              ancillaryServiceId: res?.ancillaryServiceId,
              transportModeId: res?.transportModeId,
              approvalMechanismId: res?.approvalMechanismId,
              chargingModelId: res?.chargingModelId,
              serviceSetMasterId: res?.serviceSetMasterId,
            });

            const dataProviderOption = res?.serviceProviders.map((option) => {
              return { label: option.name, value: option.id };
            });

            const organizationNames = getSelectedDataProviderString(dataProviderOption);
            if (organizationNames.length > 0) {
              fetchDesignatedApproverUsers(organizationNames)
                .then((res) => {
                  setDesignatedApproverUsers(res);
                })
                .catch((error) => {
                  console.log(error);
                });
            }

            setValue("serviceProviderIds", dataProviderOption || []);

            setValue("designatedApproversIds",
              res?.designatedApprovers.map(approver => ({
                label: `${approver.firstName} ${approver.lastName || ''} (${approver.email})`,
                value: approver.id
              })));

            setValue("defaultFee", res?.defaultFee || "");
            const uploadedDocumentationArray =

              (res?.documentsByType?.SERVICESET_DOCUMENTATION?.length > 0)
                ? res?.documentsByType?.SERVICESET_DOCUMENTATION?.map((document) => {
                  return {
                    "name": document.fileKey,
                    "documentTitle": document.title,
                    "fileID": document.id,
                    "url": document.url
                  };
                })
                : [];
            setUploadedDocumentation(uploadedDocumentationArray);
            const documentationArray =
              (res?.documentsByType?.SERVICESET_DOCUMENTATION?.length > 0)
                ? res.documentsByType.SERVICESET_DOCUMENTATION?.map(
                  (document) => document.id
                )
                : [];

            setDocumentationFiles(documentationArray);

            const uploadedLicenseArray =
              (res?.documentsByType?.SERVICESET_LICENSE?.length > 0)
                ? res.documentsByType.SERVICESET_LICENSE?.map((document) => {
                  return {
                    "name": document.fileKey,
                    "documentTitle": document.title,
                    "fileID": document.id,
                    "url": document.url
                  };
                })
                : [];
            setUploadedLicense(uploadedLicenseArray);

            const licenseArray =
              res?.documentsByType?.SERVICESET_LICENSE?.length > 0
                ? res.documentsByType.SERVICESET_LICENSE.map((document) => document.id)
                : [];
            setLicenseFiles(licenseArray);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
  }, [id]);

  const handleServiceSubmit = (data) => {
    if(data.chargingModelId===1)data.defaultFee=null
    data.datePublished = formatDate(data.datePublished);
    // if (data.lastModifiedDate) {
    //   const [year, month, day] = data.lastModifiedDate
    //     .toISOString()
    //     .split("T")[0]
    //     .split("-");
    //   data.lastModifiedDate = `${parseInt(day) + 1}-${month}-${year}`;
    // }
    if (data.serviceProviderIds) {
      const dataproviderID = data.serviceProviderIds.map((item) => {
        return item.value ? parseInt(item.value) : "";
      });
      data.serviceProviderIds = dataproviderID;
    }

    if (data.designatedApproversIds) {
      data.designatedApproversIds = data.designatedApproversIds.map((item) => item.value);
    }

    data.documentIds = documentationFiles;
    data.licenseAgreementIds = licenseFiles;
    if (!data.ancillaryServiceId) {
      data.ancillaryServiceId = 1;
    }
    if (!data.transportModeId) {
      data.transportModeId = 1;
    }
    data.ancillaryServiceId = parseInt(data.ancillaryServiceId);
    data.approvalMechanismId = parseInt(data.approvalMechanismId);
    data.chargingModelId = parseInt(data.chargingModelId);
    data.serviceSetTypeId = parseInt(data.serviceSetTypeId);
    data.transportModeId = parseInt(data.transportModeId);
    setLoader(true);
    setApiErrors("");
    editData(data);
  };

  const editData = (data) => {
    const postModifyData = async () => {
      return editServiceAPI(data);
    };

    postModifyData()
      .then((response) => {
        setLoader(false);
        if (response?.message === "Service updated successfully") {
          setApiMessage(response.message);
          setTimeout(
            () => navigate("/admin/dataservicemanagement/servicelisting"),
            3000
          );
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

  const handleDatasetTypeChange = (event) => {
    const selectedText = event.target.options[event.target.selectedIndex].text;
    setServiceTypeText(selectedText);
  };

  const onUploadSuccess = (file, documentType) => {
    if (documentType === "SERVICESET_DOCUMENTATION") {
      const newArray = [...documentationFiles, file.fileID];
      setDocumentationFiles(newArray);
    } else if (documentType === "SERVICESET_LICENSE") {
      const newArray = [...licenseFiles, file.fileID];
      setLicenseFiles(newArray);
    }
  };

  const onDeleteSuccess = (fileID, documentType) => {
    if (documentType === "SERVICESET_DOCUMENTATION") {
      const newArray = documentationFiles.filter((item) => item !== fileID);
      setDocumentationFiles(newArray);
    } else if (documentType === "SERVICESET_LICENSE") {
      const newArray = licenseFiles.filter((item) => item !== fileID);
      setLicenseFiles(newArray);
    }
  };

  return (
    <div className="container mb-5">
      <h2 className="form-title">Modify Service</h2>
      <div className="formComponent">
        <Form autoComplete="off">
          <Row>
            <Col md={6}>
              <FloatingLabel label="Service ID" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Service ID"
                  name="id"
                  disabled="true"
                  maxLength={100}
                  className={errors.id ? "is-invalid-border-only" : ""}
                  {...register("id", {
                    required: "Service ID is required",
                  })}
                />
                {errors.id && (
                  <span className="is-invalid-border-only">
                    {errors.id.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel label="Service name" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Service name"
                  name="name"
                  required
                  disabled={loader}
                  maxLength={100}
                  className={errors.name ? "is-invalid-border-only" : ""}
                  {...register("name", {
                    required: "Service name is required",
                  })}
                />
                {errors.name && (
                  <span className="is-invalid-border-only">
                    {errors.name.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="description"
                label="Description"
                className="mb-3 floating_textarea_label"
              >
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Description"
                  disabled={loader}
                  required
                  maxLength={400}
                  className={errors.description ? "is-invalid-border-only" : ""}
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                <span className="is-invalid-border-only">
                  {errors.description && (
                    <span className="is-invalid-border-only">
                      {errors.description.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="serviceSetTypeId"
                label="Type of Service"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Type of Service"
                  name="serviceSetTypeId"
                  disabled={loader}
                  className={
                    errors.serviceSetTypeId ? "is-invalid-border-only" : ""
                  }
                  required
                  {...register("serviceSetTypeId", {
                    required: "Type of Service is required",
                  })}
                  onChange={handleDatasetTypeChange}
                >
                  <option value="">Select</option>
                  {dataTypeMaster.length > 0 &&
                    dataTypeMaster.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.serviceSetTypeId && (
                    <span className="is-invalid-border-only">
                      {errors.serviceSetTypeId.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
          {serviceTypeText === "Ancillary" && (
            <Row>
              <Col md={6}>
                <FloatingLabel
                  controlId="ancillaryServiceId"
                  label="Ancilliary Service"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Ancilliary Service"
                    name="ancillaryServiceId"
                    disabled={loader}
                    className={
                      errors.ancillaryServiceId ? "is-invalid-border-only" : ""
                    }
                    required
                    {...register("ancillaryServiceId", {
                      required: "Ancilliary Service is required",
                    })}
                  >
                    <option value="">Select</option>
                    {ancillaryServicesMaster.length > 0 &&
                      ancillaryServicesMaster.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </Form.Select>
                  <span className="is-invalid-border-only">
                    {errors.ancillaryServiceId && (
                      <span className="is-invalid-border-only">
                        {errors.ancillaryServiceId.message}
                      </span>
                    )}
                  </span>
                </FloatingLabel>
              </Col>
            </Row>
          )}
          {serviceTypeText === "Core Transport" && (
            <Row>
              <Col md={6}>
                <FloatingLabel
                  controlId="transportModeId"
                  label="Transport Mode"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Transport Mode"
                    name="transportModeId"
                    disabled={loader}
                    className={
                      errors.transportModeId ? "is-invalid-border-only" : ""
                    }
                    required
                    {...register("transportModeId", {
                      required: "Transport Mode is required",
                    })}
                  >
                    <option value="">Select</option>
                    {transportModeMaster.length > 0 &&
                      transportModeMaster.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </Form.Select>
                  <span className="is-invalid-border-only">
                    {errors.transportModeId && (
                      <span className="is-invalid-border-only">
                        {errors.transportModeId.message}
                      </span>
                    )}
                  </span>
                </FloatingLabel>
              </Col>
            </Row>
          )}
          <Row>
            <Col md={6}>
              <MultiSelectComponent
                control={control}
                name="serviceProviderIds"
                label="Service Provider"
                className="mb-3"
                required="true"
                options={dataproviderMaster}
                rules={{
                  required: "Service Provider is required",
                  validate: (value) =>
                    value.length > 0 || "Select  at least one  option",
                }}
                onChange={(selectedValue) => {
                  console.log('Selected value: ', selectedValue);
                  const organizationNames = getSelectedDataProviderString(selectedValue);
                  if (organizationNames.length > 0) {
                    fetchDesignatedApproverUsers(organizationNames)
                      .then((res) => {
                        setDesignatedApproverUsers(res);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    setDesignatedApproverUsers([]);
                  }
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <DatePickerComponent
                control={control}
                name="datePublished"
                rules={{ required: "Date Published is required" }}
                placeholderText="Date Published"
                defaultValue={datePublished}
                required="true"
              />
            </Col>
          </Row>
          {/* <Row>
            <Col md={6}>
              <DatePickerComponent
                control={control}
                name="lastModifiedDate"
                rules={{ required: "Date Published is required" }}
                placeholderText="Last updated on"
                defaultValue={lastModifiedDate}
              />
            </Col>
          </Row> */}
          <Row>
            <Col md={6}>
              <FloatingLabel label="Version" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Version"
                  name="version"
                  required
                  disabled={loader}
                  maxLength={5}
                  className={errors.version ? "is-invalid-border-only" : ""}
                  {...register("version", {
                    required: "Version is required",
                  })}
                />
                {errors.version && (
                  <span className="is-invalid-border-only">
                    {errors.version.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel label="Update frequency" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Update frequency"
                  name="updateFrequency"
                  required
                  disabled={loader}
                  maxLength={50}
                  className={
                    errors.updateFrequency ? "is-invalid-border-only" : ""
                  }
                  {...register("updateFrequency", {
                    required: "Update frequency is required",
                  })}
                />
                {errors.updateFrequency && (
                  <span className="is-invalid-border-only">
                    {errors.updateFrequency.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel label="Search tags" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search tags"
                  name="searchTags"
                  disabled={loader}
                  maxLength={100}
                  className={errors.searchTags ? "is-invalid-border-only" : ""}
                  {...register("searchTags", {
                  })}
                />
                {errors.searchTags && (
                  <span className="is-invalid-border-only">
                    {errors.searchTags.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Label>Approval Mechanism <span className='star'>*</span></Form.Label>
              <div key={`inline-radio-3`} className="mb-3">
                <Controller
                  name="approvalMechanismId"
                  control={control}
                  rules={{ required: "Approval Mechanism  is required" }}
                  render={({ field }) => (
                    <>
                      {approvalMechanismMaster.map((approvalMechanism) => {
                        return (
                          <Form.Check
                            key={approvalMechanism.value}
                            inline
                            label={approvalMechanism.label}
                            name="approvalMechanismId"
                            type="radio"
                            value={approvalMechanism.value}
                            {...field}
                            checked={field.value === approvalMechanism.value}
                            id={`inline-radio-${approvalMechanism.label}`}
                            onChange={() =>
                              field.onChange(approvalMechanism.value)
                            }
                          />
                        );
                      })}
                    </>
                  )}
                />
                <span className="is-invalid-border-only d-block">
                  {errors.approvalMechanismId && (
                    <span className="is-invalid-border-only">
                      {errors.approvalMechanismId.message}
                    </span>
                  )}
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Label>Charging model <span className='star'>*</span></Form.Label>
              <div key={`inline-radio-4`} className="mb-3">
                <Controller
                  name="chargingModelId"
                  control={control}
                  rules={{ required: "Charging model  is required" }}
                  render={({ field }) => (
                    <>
                      {chargingModelMaster.map((chargingModel) => {
                        return (
                          <Form.Check
                            key={chargingModel.value}
                            inline
                            label={chargingModel.label}
                            name="chargingModelId"
                            type="radio"
                            value={chargingModel.value}
                            {...field}
                            checked={field.value === chargingModel.value}
                            id={`inline-radio-${chargingModel.label}`}
                            onChange={() => field.onChange(chargingModel.value)}
                          />
                        );
                      })}
                    </>
                  )}
                />
                <span className="is-invalid-border-only d-block">
                  {errors.chargingModelId && (
                    <span className="is-invalid-border-only">
                      {errors.chargingModelId.message}
                    </span>
                  )}
                </span>
              </div>
            </Col>
          </Row>
          {chargingModelId && parseInt(chargingModelId) === 2 && (
            <Row>
              <Col md={6}>
                <FloatingLabel label="Default Fee (INR)" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Default Fee (INR)"
                    name="defaultFee"
                    required
                    disabled={loader}
                    maxLength={20}
                    className={
                      errors.defaultFee ? "is-invalid-border-only" : ""
                    }
                    {...register("defaultFee", {
                      required: "Default Fee (INR) is required",
                    })}
                  />
                  {errors.defaultFee && (
                    <span className="is-invalid-border-only">
                      {errors.defaultFee.message}
                    </span>
                  )}
                </FloatingLabel>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={6}>
              <MultiSelectComponent
                control={control}
                name="designatedApproversIds"
                label="Designated Approvers"
                className="mb-3"
                options={designatedApproverUsers.map((approver) => ({
                  value: approver.id,
                  label: `${approver.firstName} ${approver.lastName || ''} (${approver.email})`
                }))}
                required="true"
                rules={{
                  required: 'Designated Approver is required',
                  validate: value => value.length > 0 || 'Select  at least one  option'
                }}
              />
            </Col>
          </Row>

          {documentSection.map((item, index) => {
            return (
              <Row key={item.id}>
                <Col>
                  <Form.Label>{item.heading}</Form.Label>
                  <FileUpload
                    id={item.id}
                    onUploadSuccess={onUploadSuccess}
                    onDeleteSuccess={onDeleteSuccess}
                    category="service"
                    allowMultiple={item.allowMultiple}
                    defaultFiles={item.uploadedFiles}
                  />
                </Col>
              </Row>
            );
          })}
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="serviceSetMasterId"
                label="Service"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Service"
                  name="serviceSetMasterId"
                  disabled="true"
                  className={
                    errors.serviceSetTypeId ? "is-invalid-border-only" : ""
                  }
                  required
                  {...register("serviceSetMasterId", {
                    required: "Service is required",
                  })}
                >
                  <option value="">Select</option>
                  {serviceOptions.length > 0 &&
                    serviceOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.serviceSetMasterId && (
                    <span className="is-invalid-border-only">
                      {errors.serviceSetMasterId.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="submit-btn">
        <ButtonComponent
          type="primaryBlue"
          onClick={handleSubmit(handleServiceSubmit)}
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
          Cancel
        </ButtonComponent>
      </div>
      <p className="is-invalid-border-only mt-2">{apiErrors}</p>
      <p className="success-message mt-2">{apiMessage}</p>
    </div>
  );
};

export default EditService;
