import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import UploadedFilesTable from "../../../components/admin/fileupload/UploadedFilesTable";
import { getServiceDetails } from "../../../services/apiservices";
import "../../../assets/styles/viewdataset.scss";

const ViewService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailsData, setDetailsData] = useState([]);
  const [dataProviders, setDataProviders] = useState("");
  const [documentationFiles, setDocumentationFiles] = useState([]);
  const [licenseFiles, setLicenseFiles] = useState([]);
  const { control } = useForm({ mode: "onChange" });

  useEffect(() => {
    const fetchDataCardDetails = async () => {
      return getServiceDetails(id);
    };
    fetchDataCardDetails()
      .then((response) => {
        setDetailsData(response);
        let obj = response?.serviceProviders.map((item, i) => {
          return (
            item.name + (i !== response.serviceProviders.length - 1 ? ", " : "")
          );
        });
        setDataProviders(obj);
        const filteredDocumentation =
          response?.documentsByType && (response?.documentsByType?.SERVICESET_DOCUMENTATION
            ? response.documentsByType.SERVICESET_DOCUMENTATION
              .map((item) => {
                return {
                  fileID: item.id,
                  documentTitle: item.title,
                  url: item.url,
                  name: item.fileKey,
                };
              })
            : [])
        setDocumentationFiles(filteredDocumentation);

        const filteredLicense =
          response?.documentsByType && (response?.documentsByType?.SERVICESET_LICENSE
            ? response.documentsByType.SERVICESET_LICENSE
              .map((item) => {
                return {
                  fileID: item.id,
                  documentTitle: item.title,
                  url: item.url,
                  name: item.fileKey,
                };
              })
            : [])
        setLicenseFiles(filteredLicense);
      })
      .catch((error) => {
        console.log(error);
      });
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="serviceset mb-5">
      <h3 className="serviceset_title">View Service</h3>
      <div className="formComponent w-50">
        <Form>
          <Form.Label>Service ID</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.sequenceId}
          />
          <Form.Label>Service name</Form.Label>
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
          <div className="mb-3">
            <Form.Label>Type of Service</Form.Label>
            <DropdownButton
              id="dropdown-basic-button"
              disabled
              title={detailsData.serviceSetTypeName}
            ></DropdownButton>
          </div>
          {detailsData.serviceSetTypeName === "Core Transport" ? (
            <div className="mb-3">
              <Form.Label>Transport Mode</Form.Label>
              <DropdownButton
                id="dropdown-basic-button"
                disabled
                title={detailsData.transportModeName}
              ></DropdownButton>
            </div>
          ) : (
            <div className="mb-3">
              <Form.Label>Ancilliary Services</Form.Label>
              <DropdownButton
                id="dropdown-basic-button"
                disabled
                title={detailsData.ancillaryServiceName}
              ></DropdownButton>
            </div>
          )}
          <div className="mb-3">
            <Form.Label>Service Provider</Form.Label>
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
            value={detailsData.datePublished}
          />
          <Form.Label>Last updated on</Form.Label>
          <Form.Control type="text" className="mb-3"
            value={detailsData?.lastModifiedDate ? detailsData?.lastModifiedDate.split('T')[0] : "-"} />

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
                    checked={
                      detailsData.approvalMechanismName === "Auto" ? "true" : ""
                    }
                  />
                  <Form.Check
                    inline
                    label="Manual"
                    name="approvalMechanism"
                    type="radio"
                    disabled
                    {...field}
                    checked={
                      detailsData.approvalMechanismName === "Manual"
                        ? "true"
                        : ""
                    }
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
            value={detailsData.designatedApprovers?.map(approver => ` ${approver.firstName} ${approver.lastName || ''} (${approver.email})`)}
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
            <Form.Label>License agreement</Form.Label>
            {licenseFiles.length > 0 ? (
              <UploadedFilesTable uploadedFiles={licenseFiles} />
            ) : (
              <p>NA</p>
            )}
          </div>
          <Form.Label>Service</Form.Label>
          <Form.Control
            type="text"
            className="mb-3"
            disabled
            value={detailsData.serviceSetMasterName}
          />
        </Form>
        <ButtonComponent
          type="primaryWhite"
          onClick={() => {
            navigate("../servicelisting");
          }}
        >
          Back
        </ButtonComponent>
      </div>
    </div>
  );
};

export default ViewService;
