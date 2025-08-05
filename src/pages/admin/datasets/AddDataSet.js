import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { formatDate } from "../../../utils/Helper";
import useMasterData from "../../../hooks/useMasterData";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import FileUpload from "../../../components/admin/fileupload/FileUpload";
import ImageUpload from "../../../components/admin/imageupload/ImageUpload";
import MultiSelectComponent from "../../../components/common/ui/multiselect/MultiSelectComponent";
import DatePickerComponent from "../../../components/common/ui/datepicker/DatePickerComponent";
import {
  getAgencyOptionsAPI,
  getCategoryOptionsAPI,
  getDesignatedApproverUsersAPI,
  getFilenameOptionsAPI,
  postDatasetAPI,
} from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import { useSelector } from "react-redux";

const AddDataSets = () => {
  let navigate = useNavigate();
  const { isAuthenticated, profile } = useSelector((state) => state.auth.admin);

  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [documentationFiles, setDocumentationFiles] = useState([]);
  const [dataFiles, setDataFiles] = useState([]);
  const [licenseFiles, setLicenseFiles] = useState([]);
  const [dataSetTypeText, setDataSetTypeText] = useState("");
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filenameOptions, setFilenameOptions] = useState([]);
  const [designatedApproverUsers, setDesignatedApproverUsers] = useState([]);
  const [imageFile, setImageFile] = useState([]);

  const { data: dataTypeMaster } = useMasterData(
    "dataset-type",
    "admin",
    false
  );
  const { data: ancillaryServicesMaster } = useMasterData(
    "ancillary-service",
    "admin"
  );
  const { data: transportModeMaster } = useMasterData(
    "transport-mode",
    "admin"
  );
  const { data: dataproviderMaster } = useMasterData(
    "data-provider",
    "admin",
    false
  );
  const { data: dataAccessTypeMaster } = useMasterData(
    "data-access-type",
    "admin"
  );
  const { data: approvalMechanismMaster } = useMasterData(
    "approval-mechanism",
    "admin"
  );
  const { data: chargingModelMaster } = useMasterData(
    "charging-model",
    "admin"
  );
  const { data: processingOfValuesMaster } = useMasterData(
    "processing-of-values",
    "admin"
  );

  const documentSection = [
    {
      id: "DATASET_DOCUMENTATION",
      heading: "Documentation",
      allowMultiple: true,
    },
    { id: "DATASET_FILE", heading: "Sample Data", allowMultiple: true },
    {
      id: "DATASET_LICENSE",
      heading: "License Agreement",
      allowMultiple: false,
    },
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const chargingModelId = useWatch({ control, name: "chargingModelId" });
  const agencyValue = useWatch({ control, name: "agency" });
  const categoryValue = useWatch({ control, name: "category" });

  const getSelectedDataProviderString = (options) => {
    if (!options || options.length === 0) return "";
    return options.map((option) => option.label).join(",");
  };

  const fetchDesignatedApproverUsers = async (organizationName) => {
    return getDesignatedApproverUsersAPI(organizationName);
  };

  useEffect(() => {
    if (designatedApproverUsers.length === 0) {
      setValue("designatedApproversIds", []); // Reset the selected value
    }
  }, [designatedApproverUsers, control]);

  useEffect(() => {
    const fetchAgencyOptions = async () => {
      return getAgencyOptionsAPI();
    };
    fetchAgencyOptions()
      .then((res) => {
        setAgencyOptions(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    handleAgencyChange();
  }, [agencyValue]);

  useEffect(() => {
    handleCategoryChange();
  }, [categoryValue]);

  const handleDatasetSubmit = (data) => {
    data.publishedDate = formatDate(data.publishedDate);
    if (data.dataProviderIds) {
      const dataproviderID = data.dataProviderIds.map((item) => {
        return item.value ? parseInt(item.value) : "";
      });
      data.dataProviderIds = dataproviderID;
    }

    if (data.designatedApproversIds) {
      data.designatedApproversIds = data.designatedApproversIds.map(
        (item) => item.value
      );
    }

    data.documentIds = documentationFiles;
    data.dataFileIds = dataFiles;
    data.licenseAgreementIds = licenseFiles;
    if (!data.ancillaryServiceId) {
      data.ancillaryServiceId = null;
    } else {
      data.ancillaryServiceId = parseInt(data.ancillaryServiceId);
    }
    if (!data.transportModeId) {
      data.transportModeId = null;
    } else {
      data.transportModeId = parseInt(data.transportModeId);
    }

    data.approvalMechanismId = parseInt(data.approvalMechanismId);
    data.chargingModelId = parseInt(data.chargingModelId);
    data.dataAccessTypeId = parseInt(data.dataAccessTypeId);
    data.datasetTypeId = parseInt(data.datasetTypeId);
    data.isApiAvailable = JSON.parse(data.isApiAvailable.toLowerCase());
    data.imageID = imageFile.id;
    setLoader(true);
    setApiErrors("");
    const postDataset = async () => {
      return postDatasetAPI(data);
    };

    postDataset()
      .then((response) => {
        setLoader(false);
        if (response?.message === "DataSet created successfully") {
          setApiMessage(response.message);
          setTimeout(
            () => navigate("/admin/dataservicemanagement/datasetlisting"),
            3000
          );
        } else {
          setApiErrors(response.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        if (error?.response?.data?.message) {
          setApiErrors(error.response.data.message);
        } else {
          setApiErrors(error.message);
        }
      });
  };

  const handleDatasetTypeChange = (event) => {
    const selectedText = event.target.options[event.target.selectedIndex].text;
    setDataSetTypeText(selectedText);
  };

  const onUploadSuccess = (file, documentType) => {
    if (documentType === "DATASET_DOCUMENTATION") {
      const newArray = [...documentationFiles, file.fileID];
      setDocumentationFiles(newArray);
    } else if (documentType === "DATASET_FILE") {
      const newArray = [...dataFiles, file.fileID];
      setDataFiles(newArray);
    } else if (documentType === "DATASET_LICENSE") {
      const newArray = [...licenseFiles, file.fileID];
      setLicenseFiles(newArray);
    }else if(documentType === "IMAGE"){
      setImageFile({id: file.id,
        title: file.title,
        fileKey: file.fileKey,
      });
    }
  };

  const onDeleteSuccess = (fileID, documentType) => {
    if (documentType === "DATASET_DOCUMENTATION") {
      const newArray = documentationFiles.filter((item) => item !== fileID);
      setDocumentationFiles(newArray);
    } else if (documentType === "DATASET_FILE") {
      const newArray = dataFiles.filter((item) => item !== fileID);
      setDataFiles(newArray);
    } else if (documentType === "DATASET_LICENSE") {
      const newArray = licenseFiles.filter((item) => item !== fileID);
      setLicenseFiles(newArray);
    } else if(documentType === "IMAGE"){
      setImageFile([]);
    }
  };

  const handleAgencyChange = () => {
    if (agencyValue) {
      const fetchCategoryOptions = async () => {
        return getCategoryOptionsAPI(agencyValue);
      };
      fetchCategoryOptions()
        .then((res) => {
          setCategoryOptions(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCategoryChange = () => {
    if (categoryValue) {
      const fetchFilenameOptions = async () => {
        return getFilenameOptionsAPI(agencyValue, categoryValue);
      };
      fetchFilenameOptions()
        .then((res) => {
          setFilenameOptions(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="container mb-5">
      <h2 className="form-title">Add New Data Set</h2>
      <div className="formComponent">
        <Form autoComplete="off">
          <Row>
            <Col md={6}>
              <FloatingLabel label="Dataset name" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Dataset name"
                  name="name"
                  required
                  disabled={loader}
                  maxLength={100}
                  className={errors.name ? "is-invalid-border-only" : ""}
                  {...register("name", {
                    required: "Dataset name is required",
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
              <div className="mb-3">
                <label
                  htmlFor="imageUploadInputimage"
                  className="form-label floating_textarea_label"
                >
                  Upload Image
                </label>
                <ImageUpload
                  id="IMAGE"
                  category="dataset"
                  allowMultiple={false}
                  defaultImages={[]}
                  onUploadSuccess={onUploadSuccess}
                  onDeleteSuccess={onDeleteSuccess}
                  documentType="DATASET_IMAGES"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="datasetTypeId"
                label="Type of Data"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Type of Data"
                  name="datasetTypeId"
                  disabled={loader}
                  className={
                    errors.datasetTypeId ? "is-invalid-border-only" : ""
                  }
                  required
                  {...register("datasetTypeId", {
                    required: "Type of Data is required",
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
                  {errors.datasetTypeId && (
                    <span className="is-invalid-border-only">
                      {errors.datasetTypeId.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
          {dataSetTypeText === "Ancillary" && (
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
          {dataSetTypeText === "Core Transport" && (
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
                name="dataProviderIds"
                label="Data Provider"
                className="mb-3"
                options={dataproviderMaster}
                required="true"
                rules={{
                  required: "Data Provider is required",
                  validate: (value) =>
                    value.length > 0 || "Select  at least one  option",
                }}
                onChange={(selectedValue) => {
                  const organizationNames =
                    getSelectedDataProviderString(selectedValue);
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
                name="publishedDate"
                rules={{ required: "Date Published is required" }}
                placeholderText="Date Published"
                defaultValue={null}
                required="true"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Label htmlFor="group1">
                Data access type <span className="star">*</span>{" "}
              </Form.Label>
              <div key={`inline-radio`} className="mb-3">
                <Controller
                  name="dataAccessTypeId"
                  control={control}
                  rules={{ required: "Data Access Type is required" }}
                  render={({ field }) => (
                    <>
                      {dataAccessTypeMaster.map((dataAccessType) => {
                        return (
                          <Form.Check
                            inline
                            label={dataAccessType.label}
                            name="dataAccessTypeId"
                            type="radio"
                            value={dataAccessType.value}
                            {...field}
                            checked={field.value === dataAccessType.value}
                            id={`inline-radio-${dataAccessType.value}`}
                            onChange={() =>
                              field.onChange(dataAccessType.value)
                            }
                          />
                        );
                      })}
                    </>
                  )}
                />
                <span className="is-invalid-border-only d-block">
                  {errors.dataAccessTypeId && (
                    <span className="is-invalid-border-only">
                      {errors.dataAccessTypeId.message}
                    </span>
                  )}
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel label="File format" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="File format"
                  name="fileFormat"
                  required
                  disabled={loader}
                  maxLength={10}
                  className={errors.fileFormat ? "is-invalid-border-only" : ""}
                  {...register("fileFormat", {
                    required: "File format is required",
                  })}
                />
                {errors.fileFormat && (
                  <span className="is-invalid-border-only">
                    {errors.fileFormat.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Label htmlFor="group1">
                API Available <span className="star">*</span>
              </Form.Label>
              <div key={`inline-radio`} className="mb-3">
                <Controller
                  name="isApiAvailable"
                  control={control}
                  rules={{ required: "Api available  is required" }}
                  render={({ field }) => (
                    <>
                      <Form.Check
                        inline
                        label="Yes"
                        name="isApiAvailable"
                        type="radio"
                        value="true"
                        {...field}
                        checked={field.value === "true"}
                        onChange={() => field.onChange("true")}
                      />
                      <Form.Check
                        inline
                        label="No"
                        name="isApiAvailable"
                        type="radio"
                        value="False"
                        {...field}
                        checked={field.value === "False"}
                        onChange={() => field.onChange("False")}
                      />
                    </>
                  )}
                />
                <span className="is-invalid-border-only d-block">
                  {errors.isApiAvailable && (
                    <span className="is-invalid-border-only">
                      {errors.isApiAvailable.message}
                    </span>
                  )}
                </span>
              </div>
            </Col>
          </Row>
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
              <FloatingLabel label="Data fields covered" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Data fields covered"
                  name="dataFieldsCovered"
                  required
                  disabled={loader}
                  maxLength={100}
                  className={
                    errors.dataFieldsCovered ? "is-invalid-border-only" : ""
                  }
                  {...register("dataFieldsCovered", {
                    required: "Data fields covered is required",
                  })}
                />
                {errors.dataFieldsCovered && (
                  <span className="is-invalid-border-only">
                    {errors.dataFieldsCovered.message}
                  </span>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="processingOfValuesId"
                label="Processing of values"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Processing of values"
                  name="processingOfValuesId"
                  disabled={loader}
                  className={
                    errors.processingOfValuesId ? "is-invalid-border-only" : ""
                  }
                  required
                  {...register("processingOfValuesId", {
                    required: "Processing of values is required",
                  })}
                >
                  <option value="">Select</option>
                  {processingOfValuesMaster.length > 0 &&
                    processingOfValuesMaster.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.processingOfValuesId && (
                    <span className="is-invalid-border-only">
                      {errors.processingOfValuesId.message}
                    </span>
                  )}
                </span>
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
                  {...register("searchTags", {})}
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
              <Form.Label>
                Approval Mechanism <span className="star">*</span>
              </Form.Label>
              <div key={`inline-radio`} className="mb-3">
                <Controller
                  name="approvalMechanismId"
                  control={control}
                  rules={{ required: "Approval Mechanism  is required" }}
                  render={({ field }) => (
                    <>
                      {approvalMechanismMaster.map((approvalMechanism) => {
                        return (
                          <Form.Check
                            inline
                            label={approvalMechanism.label}
                            name="approvalMechanismId"
                            type="radio"
                            value={approvalMechanism.value}
                            {...field}
                            checked={field.value === approvalMechanism.value}
                            id={`inline-radio-${approvalMechanism.value}`}
                            onChange={() =>
                              field.onChange(approvalMechanism.value)
                            }
                            key={approvalMechanism.label}
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
              <Form.Label>
                Charging model <span className="star">*</span>
              </Form.Label>
              <div key={`inline-radio`} className="mb-3">
                <Controller
                  name="chargingModelId"
                  control={control}
                  rules={{ required: "Charging model  is required" }}
                  render={({ field }) => (
                    <>
                      {chargingModelMaster.map((chargingModel) => {
                        return (
                          <Form.Check
                            inline
                            label={chargingModel.label}
                            name="chargingModelId"
                            type="radio"
                            value={chargingModel.value}
                            {...field}
                            checked={field.value === chargingModel.value}
                            id={`inline-radio-${chargingModel.value}`}
                            onChange={() => field.onChange(chargingModel.value)}
                            key={chargingModel.label}
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
                  label: `${approver.firstName} ${approver.lastName || ""} (${
                    approver.email
                  })`,
                }))}
                required="true"
                rules={{
                  required: "Designated Approver is required",
                  validate: (value) =>
                    value.length > 0 || "Select  at least one  option",
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
                    category="dataset"
                    allowMultiple={item.allowMultiple}
                  />
                </Col>
              </Row>
            );
          })}

          <Row>
            <Col md={6}>
              <FloatingLabel controlId="agency" label="Agency" className="mb-3">
                <Form.Select
                  aria-label="Agency"
                  name="agency"
                  disabled={loader}
                  className={errors.agency ? "is-invalid-border-only" : ""}
                  required
                  {...register("agency", {
                    required: "Agency is required",
                  })}
                >
                  <option value="">Select</option>
                  {agencyOptions.length > 0 &&
                    agencyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.agency && (
                    <span className="is-invalid-border-only">
                      {errors.agency.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="category"
                label="Category"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Category"
                  name="category"
                  disabled={loader}
                  className={errors.category ? "is-invalid-border-only" : ""}
                  required
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select</option>
                  {categoryOptions.length > 0 &&
                    categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.category && (
                    <span className="is-invalid-border-only">
                      {errors.category.message}
                    </span>
                  )}
                </span>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FloatingLabel
                controlId="filename"
                label="Filename"
                className="mb-3"
              >
                <Form.Select
                  aria-label="filename"
                  name="Filename"
                  disabled={loader}
                  className={errors.filename ? "is-invalid-border-only" : ""}
                  // required
                  {...register("filename", {
                    // required: "Filename is required",
                  })}
                >
                  <option value="">Select</option>
                  {filenameOptions.length > 0 &&
                    filenameOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </Form.Select>
                <span className="is-invalid-border-only">
                  {errors.filename && (
                    <span className="is-invalid-border-only">
                      {errors.filename.message}
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
          onClick={handleSubmit(handleDatasetSubmit)}
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

export default AddDataSets;
