import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import UploadedFilesTable from "../../../components/admin/fileupload/UploadedFilesTable";
import { getDataDetails } from "../../../services/apiservices";
import "../../../assets/styles/viewdataset.scss";
import UploadedImageGallery from "../../../components/admin/imageupload/UploadedImageGallery";

const ViewDataSet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detailsData, setDetailsData] = useState([]);
  const [documentationFiles, setDocumentationFiles] = useState([]);
  const [dataFiles, setDataFiles] = useState([]);
  const [licenseFiles, setLicenseFiles] = useState([]);
  const [dataProviders, setDataProviders] = useState("");
  const [imageFile, setImageFile] = useState([]);
  const { control } = useForm({ mode: "onChange" });

  useEffect(() => {
    const fetchDataCardDetails = async () => {
      return getDataDetails(id);
    };
    fetchDataCardDetails()
      .then((response) => {
        setDetailsData(response);
        let obj = response?.dataProviders.map((item, i) => {
          return (
            item.name + (i !== response?.dataProviders.length - 1 ? ", " : "")
          );
        });
        setDataProviders(obj);
        if (response?.documentsByType) {
          if (response.documentsByType?.DATASET_DOCUMENTATION) {
            const filteredDocumentation =
              response.documentsByType.DATASET_DOCUMENTATION.map((item) => {
                return {
                  fileID: item.id,
                  documentTitle: item.title,
                  url: item.url,
                  name: item.fileKey,
                };
              });
            setDocumentationFiles(filteredDocumentation);
          }
        }
        if (response?.documentsByType) {
          if (response.documentsByType?.DATASET_FILE) {
            const filteredData = response.documentsByType.DATASET_FILE.map(
              (item) => {
                return {
                  fileID: item.id,
                  documentTitle: item.title,
                  url: item.url,
                  name: item.fileKey,
                };
              }
            );
            setDataFiles(filteredData);
          }
        }
        if (response?.documentsByType) {
          if (response.documentsByType?.DATASET_LICENSE) {
            const filteredLicense =
              response.documentsByType.DATASET_LICENSE.map((item) => {
                return {
                  fileID: item.id,
                  documentTitle: item.title,
                  url: item.url,
                  name: item.fileKey,
                };
              });
            setLicenseFiles(filteredLicense);
          }
        }
        const imageArray = response?.documentsByType?.IMAGE || []
        setImageFile(imageArray); // Stores the full object in state
      })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="dataset mb-5">
      <h3 className="dataset_title">View Data Set</h3>
      <div className="formComponent w-50">
        <Form>
          <Form.Label>Dataset ID</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.sequenceId}
          />
          <Form.Label>Dataset name</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.name}
          />
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            className="mb-3"
            disabled
            value={detailsData.description}
          />
          <Form.Label>Associated Image</Form.Label>
          <div className="mb-3">
          {imageFile?.length > 0 ? (
            <UploadedImageGallery
            uploadedImages={imageFile}
              isViewOnly={true}
            />
          ) : (
            <p>NA</p>
          )}
          </div>
          <div className="mb-3">
            <Form.Label>Type of Data</Form.Label>
            <DropdownButton
              id="dropdown-basic-button"
              disabled
              title={
                detailsData.datasetTypeName ? detailsData.datasetTypeName : ""
              }
            ></DropdownButton>
          </div>
          {detailsData.datasetTypeName === "Ancillary" ? (
            <div className="mb-3">
              <Form.Label>Ancilliary Service</Form.Label>
              <DropdownButton
                id="dropdown-basic-button"
                disabled
                title={
                  detailsData.ancillaryServiceName
                    ? detailsData.ancillaryServiceName
                    : ""
                }
              ></DropdownButton>
            </div>
          ) : (
            <div className="mb-3">
              <Form.Label>Transport Mode</Form.Label>
              <DropdownButton
                id="dropdown-basic-button"
                disabled
                title={
                  detailsData.transportModeName
                    ? detailsData.transportModeName
                    : ""
                }
              ></DropdownButton>
            </div>
          )}
          <div className="mb-3">
            <Form.Label>Data Provider</Form.Label>
            <DropdownButton
              id="dropdown-basic-button"
              disabled
              title={dataProviders}
            ></DropdownButton>
          </div>
          <Form.Label>Data Published</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData?.publishedDate}
          />
          <Form.Label htmlFor="group1">Data access type</Form.Label>
          <div key={`inline-radio-1`} className="mb-3 mt-2">
            <Controller
              name="dataAccessTypeId"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Check
                    inline
                    label="Download"
                    name="dataAccessTypeId"
                    type="radio"
                    disabled
                    {...field}
                    checked={detailsData.dataAccessTypeName === "Download"}
                  />
                  <Form.Check
                    inline
                    label="Subscribe"
                    name="dataAccessTypeId"
                    type="radio"
                    disabled
                    {...field}
                    checked={detailsData.dataAccessTypeName === "Subscribe"}
                  />
                </>
              )}
            />
          </div>
          <Form.Label>Last updated on</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            value={
              detailsData?.lastModifiedDate
                ? detailsData?.lastModifiedDate.split("T")[0]
                : "-"
            }
          />
          <Form.Label>File format</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.fileFormat}
          />
          <Form.Label htmlFor="group1">API Available</Form.Label>
          <div key={`inline-radio-2`} className="mb-3 mt-2">
            <Controller
              name="isApiAvailable"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Check
                    inline
                    label="Yes"
                    name="isApiAvailable"
                    disabled
                    type="radio"
                    {...field}
                    checked={detailsData?.isApiAvailable}
                  />
                  <Form.Check
                    inline
                    label="No"
                    name="isApiAvailable"
                    type="radio"
                    disabled
                    {...field}
                    checked={!detailsData?.isApiAvailable}
                  />
                </>
              )}
            />
          </div>
          <Form.Label>Version</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.version}
          />
          <Form.Label>Update frequency</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.updateFrequency}
          />
          <Form.Label>Data fields covered</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.dataFieldsCovered}
          />
          <Form.Label>Processing of values</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.processingOfValuesName}
          />
          <Form.Label>Search tags</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.searchTags}
          />
          <Form.Label htmlFor="group1">Approval Mechanism</Form.Label>
          <div key={`inline-radio-3`} className="mb-3 mt-2">
            <Controller
              name="approvalMechanism"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Check
                    inline
                    label="Auto"
                    name="approvalMechanism"
                    type="radio"
                    disabled
                    {...field}
                    checked={detailsData.approvalMechanismName === "Auto"}
                  />
                  <Form.Check
                    inline
                    label="Manual"
                    name="approvalMechanism"
                    type="radio"
                    disabled
                    {...field}
                    checked={detailsData.approvalMechanismName === "Manual"}
                  />
                </>
              )}
            />
          </div>
          <Form.Label htmlFor="group1">Charging model</Form.Label>
          <div key={`inline-radio-4`} className="mb-3 mt-2">
            <Controller
              name="chargingModel"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Check
                    inline
                    label="Free"
                    name="chargingModel"
                    type="radio"
                    disabled
                    {...field}
                    checked={
                      detailsData.chargingModelName === "Free" ? "true" : ""
                    }
                  />
                  <Form.Check
                    inline
                    label="Paid"
                    name="chargingModel"
                    type="radio"
                    disabled
                    {...field}
                    checked={
                      detailsData.chargingModelName === "Paid" ? "true" : ""
                    }
                  />
                </>
              )}
            />
          </div>
          {detailsData.chargingModelName === "Paid" ? (
            <div>
              <Form.Label>Default fee (INR)</Form.Label>
              <Form.Control
                type="text"
                className="mb-3"
                value={detailsData.defaultFee}
              />
            </div>
          ) : null}

          <Form.Label>Designated Approvers</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.designatedApprovers?.map(
              (approver) =>
                ` ${approver.firstName} ${approver.lastName || ""} (${
                  approver.email
                })`
            )}
          />
          <div className="mb-3">
            <Form.Label>Documentation</Form.Label>
            {documentationFiles.length > 0 ? (
              <UploadedFilesTable uploadedFiles={documentationFiles} />
            ) : (
              <p>NA</p>
            )}
          </div>
          <div className="mb-3">
            <Form.Label>Sample Data</Form.Label>
            {dataFiles.length > 0 ? (
              <UploadedFilesTable uploadedFiles={dataFiles} />
            ) : (
              <p>NA</p>
            )}
          </div>
          <div className="mb-3">
            <Form.Label>License agreement</Form.Label>
            {licenseFiles.length > 0 ? (
              <UploadedFilesTable uploadedFiles={licenseFiles} />
            ) : (
              <p>NA</p>
            )}
          </div>
          <Form.Label>Agency</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.agency}
          />
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.category}
          />
          <Form.Label>Filename</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.filename}
          />
        </Form>
        <ButtonComponent
          type="primaryWhite"
          onClick={() => {
            navigate("../datasetlisting");
          }}
        >
          Back
        </ButtonComponent>
      </div>
    </div>
  );
};

export default ViewDataSet;
