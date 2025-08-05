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
import FileUpload from "../../../components/admin/fileupload/FileUpload";
import ImageUpload from "../../../components/admin/imageupload/ImageUpload";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import MultiSelectComponent from "../../../components/common/ui/multiselect/MultiSelectComponent";
import DatePickerComponent from "../../../components/common/ui/datepicker/DatePickerComponent";
import {getDataDetails, editDataSetAPI, getDesignatedApproverUsersAPI} from "../../../services/apiservices";
import "../../../assets/styles/formcomponent.scss";
import {useSelector} from "react-redux";

const EditDataSet = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  let navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, profile } = useSelector((state) => state.auth.admin);
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [documentationFiles, setDocumentationFiles] = useState([]);
  const [dataFiles, setDataFiles] = useState([]);
  const [licenseFiles, setLicenseFiles] = useState([]);
  const chargingModelId = useWatch({ control, name: "chargingModelId" });
  const [dataSetTypeText, setDataSetTypeText] = useState("");
  const [publishedDate, setPublishedDate] = useState('');
  const [uploadedDocumentation, setUploadedDocumentation] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);
  const [uploadedLicense, setUploadedLicense] = useState([]);
  const [designatedApproverUsers, setDesignatedApproverUsers] = useState([]);
  const [imageFile, setImageFile] = useState([]);

  const documentSection = [
    {
      id: "DATASET_DOCUMENTATION",
      heading: "Documentation",
      allowMultiple: true,
      uploadedFiles: uploadedDocumentation
    },
    { id: "DATASET_FILE", heading: "Sample Data", allowMultiple: true, uploadedFiles: uploadedData },
    {
      id: "DATASET_LICENSE",
      heading: "License Agreement",
      allowMultiple: false,
      uploadedFiles: uploadedLicense
    },
  ];

  const { data: dataTypeMaster } = useMasterData("dataset-type", "admin", false);
  const { data: processingOfValuesMaster } = useMasterData("processing-of-values", "admin");
  const { data: ancillaryServicesMaster } = useMasterData("ancillary-service", "admin");
  const { data: transportModeMaster } = useMasterData("transport-mode", "admin");
  const { data: dataproviderMaster } = useMasterData("data-provider", "admin", false);
  const { data: dataAccessTypeMaster } = useMasterData("data-access-type", "admin");
  const { data: approvalMechanismMaster } = useMasterData("approval-mechanism", "admin");
  const { data: chargingModelMaster } = useMasterData("charging-model", "admin");

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
    const fetchDataCardDetails = async () => {
      return getDataDetails(id);
    };

    fetchDataCardDetails()
      .then((res) => {
        setValue("id", res?.id || "");
        setValue("name", res?.name || "");
        setValue("description", res?.description || "");
        setValue("datasetTypeId", res?.datasetTypeId || "");
        setDataSetTypeText(res?.datasetTypeName);
        setValue("ancillaryServiceId", res?.ancillaryServiceId || "");
        setValue("transportModeId", res?.transportModeId || "");
        setValue("dataAccessTypeId", res?.dataAccessTypeId || "");
        setValue("fileFormat", res?.fileFormat || "");
        setValue("version", res?.version || "");
        setValue("updateFrequency", res?.updateFrequency || "");
        setValue("dataFieldsCovered", res?.dataFieldsCovered || "");
        setValue("processingOfValuesId", res?.processingOfValuesId || "");
        setValue("searchTags", res?.searchTags || "");
        setValue("approvalMechanismId", res?.approvalMechanismId || "");
        setValue("chargingModelId", res?.chargingModelId || "");
        const isApiAvailableValue = res?.isApiAvailable !== null ? res?.isApiAvailable.toString() : '';
        setValue("isApiAvailable", isApiAvailableValue);
        setValue("agency", res?.agency || "");
        setValue("category", res?.category || "");
        setValue("filename", res?.filename || "");
        const formattedDate = res?.publishedDate ? new Date(res?.publishedDate.split("-")[1] + "-" + res?.publishedDate.split("-")[0] + "-" + res?.publishedDate.split("-")[2]) : '';
        setPublishedDate(formattedDate);
        reset({
          publishedDate: formattedDate,
          id: res?.id,
          datasetTypeId: res?.datasetTypeId,
          transportModeId: res?.transportModeId,
          isApiAvailable: isApiAvailableValue,
          approvalMechanismId: res?.approvalMechanismId,
          chargingModelId: res?.chargingModelId,
          dataAccessTypeId: res?.dataAccessTypeId,
          ancillaryServiceId: res?.ancillaryServiceId,
          processingOfValuesId: res?.processingOfValuesId,
          agency: res?.agency,
          category: res?.category,
          filename: res?.filename,
        })

        const dataProviderOption = res?.dataProviders.map((option) => {
          return { label: option.name, value: option.id }
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

        setValue("dataProviderIds", dataProviderOption || []);

        setValue("designatedApproversIds",
            res?.designatedApprovers.map(approver => ({
                label: `${approver.firstName} ${approver.lastName || ''} (${approver.email})`,
                value: approver.id
            })));

        setValue("defaultFee", res?.defaultFee || "");

        const uploadedDocumentationArray = (res?.documentsByType?.DATASET_DOCUMENTATION?.length > 0) ?
          res.documentsByType.DATASET_DOCUMENTATION
            .map((document) => {
              return {
                "name": document.fileKey,
                "documentTitle": document.title,
                "fileID": document.id,
                "url": document.url
              }
            }) : [];
        setUploadedDocumentation(uploadedDocumentationArray);
        const documentationArray = (res?.documentsByType?.DATASET_DOCUMENTATION?.length > 0) ?
          res.documentsByType.DATASET_DOCUMENTATION
            .map((document) => document.id) : [];

        setDocumentationFiles(documentationArray);

        const uploadedDataArray = (res?.documentsByType?.DATASET_FILE?.length > 0) ?
          res.documentsByType.DATASET_FILE
            .map((document) => {
              return {
                "name": document.fileKey,
                "documentTitle": document.title,
                "fileID": document.id,
                "url": document.url
              }
            }) : [];
        setUploadedData(uploadedDataArray);
        const dataArray = (res?.documentsByType?.DATASET_FILE?.length > 0) ?
          res.documentsByType.DATASET_FILE
            .map((document) => document.id) : [];
        setDataFiles(dataArray);

        const uploadedLicenseArray = (res?.documentsByType?.DATASET_LICENSE?.length > 0) ?
          res.documentsByType.DATASET_LICENSE
            .map((document) => {
              return {
                "name": document.fileKey,
                "documentTitle": document.title,
                "fileID": document.id,
                "url": document.url
              }
            }) : [];
        setUploadedLicense(uploadedLicenseArray);

        const licenseArray = (res?.documentsByType?.DATASET_LICENSE?.length > 0) ?
          res.documentsByType.DATASET_LICENSE
            .map((document) => document.id) : [];
        setLicenseFiles(licenseArray);

        const imageArray = res?.documentsByType?.IMAGE || []
        setImageFile(imageArray); // Stores the full object in state
        

      })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
  }, [id]);

  const handleDatasetSubmit = (data) => {
    if (data.chargingModelId === 1) data.defaultFee = null;
    data.publishedDate = formatDate(data.publishedDate);

    if (data.dataProviderIds) {
      const dataproviderID = data.dataProviderIds.map((item) => {
        return item.value ? parseInt(item.value) : "";
      });
      data.dataProviderIds = dataproviderID;
    }

    if (data.designatedApproversIds) {
      data.designatedApproversIds = data.designatedApproversIds.map((item) => item.value);
    }

    data.documentIds = documentationFiles;
    data.dataFileIds = dataFiles;
    data.licenseAgreementIds = licenseFiles;
    data.ancillaryServiceId = parseInt(data.ancillaryServiceId);
    data.transportModeId = parseInt(data.transportModeId);
    data.approvalMechanismId = parseInt(data.approvalMechanismId);
    data.chargingModelId = parseInt(data.chargingModelId);
    data.dataAccessTypeId = parseInt(data.dataAccessTypeId);
    data.datasetTypeId = parseInt(data.datasetTypeId);
    data.isApiAvailable = JSON.parse(data.isApiAvailable.toLowerCase());
    data.imageID = imageFile.id;
    setLoader(true);
    setApiErrors("");
    editData(data);
  };

  const editData = (data) => {
    const postModifyData = async () => {
      return editDataSetAPI(data);
    };

    postModifyData()
      .then((response) => {
        setLoader(false);
        if (response?.message === 'DataSet updated successfully') {
          setApiMessage(response.message);
          setTimeout(() => navigate('/admin/dataservicemanagement/datasetlisting'), 3000);

        } else {
          setApiErrors(response.message)
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
    if (documentType === 'DATASET_DOCUMENTATION') {
      const newArray = documentationFiles.filter((item) => item !== fileID);
      setDocumentationFiles(newArray);
    } else if (documentType === 'DATASET_FILE') {
      const newArray = dataFiles.filter((item) => item !== fileID);
      setDataFiles(newArray);
    } else if (documentType === 'DATASET_LICENSE') {
      const newArray = licenseFiles.filter((item) => item !== fileID);
      setLicenseFiles(newArray);
    }
     else if(documentType === "IMAGE"){
      setImageFile([]);
    }
  }

  return (
    <div className="container mb-5">
      <h2 className="form-title">Modify Data Set</h2>
      <div className="formComponent">
        <Form autoComplete="off">
          <Row>
            <Col md={6}>
              <FloatingLabel label="Dataset ID" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Dataset ID"
                  name="id"
                  disabled='true'
                  maxLength={100}
                  className={errors.id ? "is-invalid-border-only" : ""}
                  {...register("id", {
                    required: "Dataset ID is required",
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
                  onUploadSuccess={onUploadSuccess}
                  onDeleteSuccess={onDeleteSuccess}
                  documentType="DATASET_IMAGES"
                  defaultImages= {imageFile}
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
                required="true"
                options={dataproviderMaster}
                // defaultValue={dataProvider}
                rules={{
                  required: "Data Provider is required",
                  validate: (value) =>
                    value.length > 0 || "Select  at least one  option",
                }}
                onChange={(selectedValue) => {
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
                name="publishedDate"
                rules={{ required: "Date Published is required" }}
                placeholderText="Date Published"
                defaultValue={publishedDate}
                required="true"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Label htmlFor="group1">Data access type <span className='star'>*</span></Form.Label>
              <div key={`inline-radio-1`} className="mb-3">
                <Controller
                  name="dataAccessTypeId"
                  control={control}
                  rules={{ required: "Data Access Type is required" }}
                  render={({ field }) => (
                    <>
                      {dataAccessTypeMaster.map((dataAccessType) => {
                        return (
                          <Form.Check
                            key={dataAccessType.value}
                            inline
                            label={dataAccessType.label}
                            name="dataAccessTypeId"
                            type="radio"
                            value={dataAccessType.value}
                            {...field}
                            checked={field.value === dataAccessType.value}
                            id={`inline-radio-${dataAccessType.label}`}
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
              <Form.Label htmlFor="group2">API Available <span className='star'>*</span></Form.Label>
              <div key={`inline-radio-2`} className="mb-3">
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
                        id={`isApiAvailable1`}
                        disabled='true'
                      />
                      <Form.Check
                        inline
                        label="No"
                        name="isApiAvailable"
                        type="radio"
                        value="false"
                        {...field}
                        checked={field.value === "false"}
                        onChange={() => field.onChange("false")}
                        id={`isApiAvailable2`}
                        disabled='true'
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
              <Form.Label>Charging model</Form.Label>
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
                            // disabled='true'
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
          {(chargingModelId && parseInt(chargingModelId) === 2) && (
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
                    category="dataset"
                    allowMultiple={item.allowMultiple}
                    defaultFiles={item.uploadedFiles}
                  />
                </Col>
              </Row>
            );
          })}
          <Row>
            <Col md={6}>
              <Form.Label className="required-label">Agency</Form.Label>
              <Form.Control
                type="text"
                className="mb-3"
                disabled
                required
                {...register("agency", {
                })}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Label className="required-label">Category</Form.Label>
              <Form.Control
                type="text"
                className="mb-3"
                disabled
                required
                {...register("category", {
                })}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Label>Filename</Form.Label>
              <Form.Control
                type="text"
                className="mb-3"
                disabled
                {...register("filename", {
                })}
              />
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

export default EditDataSet;
