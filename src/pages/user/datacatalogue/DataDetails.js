import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import useCheckMobileScreen from "../../../hooks/useCheckMobileScreen";
import Breadcrumb from "../../../components/user/ui/Breadcrumb/Breadcrumb";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import BannerTitle from "../../../components/user/ui/BannerTitle/BannerTitle";
import Tags from "../../../components/user/Tags";
import DownloadRequestForm from "../form/DownloadRequestForm";
import SignInModal from "../authentication/SignInModal";
import NotFound from "../../PageNotFound";
import { downloadFileAPI, getDataDetails, getSubscribedStatus } from "../../../services/apiservices";
import "../../../assets/styles/datadetails.scss";
import BusImage from '../../../assets/images/products/bus.jpg';
import MetroImage from '../../../assets/images/products/metro.png';
import PassengerCountImage from '../../../assets/images/products/passengercount.png';
import ParkingImage from '../../../assets/images/products/parking.png';
import RapidImage from '../../../assets/images/products/rapidrail.png';
import ETAImage from '../../../assets/images/products/eta.png';
import JourneyImage from '../../../assets/images/products/journey.png';
import TicketingImage from '../../../assets/images/products/ticket.png';

const DataDetails = () => {
  const dispatch = useDispatch();
  const isMobile = useCheckMobileScreen();
  const { id } = useParams();
  const [detailsData, setDetailsData] = useState([]);
  const [refreshDataset, setRefreshDataset] = useState(false);
  const [subscribedStatus, setSubscribedStatus] = useState([]);
  const [dataProvider, setDataProvider] = useState([]);
  const { isAuthenticated } = useSelector((state) => state.auth.user);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dataFiles, setDataFiles] = useState([]);
  const [documentation, setDocumentation] = useState([]);
  const [license, setLicense] = useState([]);
  const [productImage, setProductImage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    let data = {
      status: false,
      path: ''
    }
    dispatch({ type: 'verify/userDataServiceLoginRequest', payload: data });
  }, []);

  const fetchData = () => {
    const fetchDataCardDetails = async () => {
      return getDataDetails(id, "user");
    };
    fetchDataCardDetails()
      .then((res) => {
        setDetailsData(res);
        setDocumentation(res?.documentsByType?.DATASET_DOCUMENTATION ?
          res?.documentsByType?.DATASET_DOCUMENTATION : []);
        setDataFiles(res?.documentsByType?.DATASET_FILE ?
          res?.documentsByType?.DATASET_FILE : []);
        setLicense(res?.documentsByType?.DATASET_LICENSE ?
          res?.documentsByType?.DATASET_LICENSE : []);
        let provider = '';
        res?.dataProviders?.forEach((element, index) => {
          provider += element.name
          if (index !== res.dataProviders.length - 1) provider += ', '
        });
        setDataProvider(provider);
        if(res=='')setErrorMessage('Dataset does not exist')
      })
      .catch((error) => {
        setErrorMessage(error)
      });

    if (isAuthenticated) {
      const fetchSubscribedStatus = async () => {
        return getSubscribedStatus(id, 'dataset');
      };
      fetchSubscribedStatus()
        .then((res) => {
          setSubscribedStatus(res);
        })
        .catch((error) => {
          setErrorMessage(error?.request?.response)
        });
    }
  }

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (refreshDataset) {
      fetchData();
      window.scrollTo(0, 0);
    }

  }, [refreshDataset]);

  useEffect(() => {
    const determineFallbackImage = (name = '') => {
      if (name.includes('Parking')) return ParkingImage;
      if (name.includes('count')) return PassengerCountImage;
      if (name.includes('Metro')) return MetroImage;
      if (name.includes('Bus')) return BusImage;
      if (name.includes('ETA Calculator')) return ETAImage;
      if (name.includes('Journey')) return JourneyImage;
      if (name.includes('Ticketing')) return TicketingImage;
      return RapidImage;
    };
  
    const fetchImage = async () => {
      const imageDocs = detailsData?.documentsByType?.IMAGE;
  
      if (Array.isArray(imageDocs) && imageDocs.length > 0) {
        const fileKey = imageDocs[0]?.fileKey;
  
        try {
          const response = await downloadFileAPI(
            `/api/dataset/download?key=${encodeURIComponent(fileKey)}`,
            'admin',
            false
          );
          const blob = new Blob([response.data], { type: 'image/png' });
          const blobUrl = URL.createObjectURL(blob);
          setProductImage(blobUrl);
          return; 
        } catch (error) {
          console.error('Error loading product image:', error);
        }
      }
      setProductImage(determineFallbackImage(detailsData?.name));
    };
  
    if (detailsData) {
      fetchImage();
    }
  }, [detailsData]);

  const handleDownload = () => {
    if (isAuthenticated) {
      setShowForm(true);
    } else {
      setShowSignInModal(true);
    }
  };

  const handleDownloadNow = (e) => {
    if (detailsData?.dataAccessTypeName === 'Download') {
      e.preventDefault();
      const downloadFile = async () => {
        return downloadFileAPI(detailsData?.downloadUrl, "user");
      };
      downloadFile()
        .then(response => {
          let fileName = 'downloaded_file';
          const contentDisposition = response.headers['content-disposition'];
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) {
            fileName = match[1];
          }
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/octet-stream' }));
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          // the filename you want
          // a.download = 'Downloaded-Dataset.' + detailsData?.downloadUrl?.split('.')[detailsData?.downloadUrl?.split('.').length - 1];
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.parentNode.removeChild(a);
        }).catch((error) => {
          console.log(error);
          // if (error?.response?.data?.message) {
          //     setApiErrors(error?.response?.data.message)
          // } else {
          //     setApiErrors(error?.message)
          // }
        });
    }
  }

  const handleFilePreview = async (e, fileKey, fileurl) => {
    e.preventDefault();
    const isPDF = fileurl.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
       handleFileDownload(e,fileKey,fileurl);
       return;
    }
    try {
        const response = await downloadFileAPI(fileurl, "user", false);
        const fileBlob = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(fileBlob);
        window.open(fileURL, "_blank");
    } catch (error) {
        console.error("File preview failed:", error);
    }
};
 
  const handleFileDownload = (e, fileKey, fileurl) => {
    e.preventDefault();
    const downloadFile = async () => {
      return downloadFileAPI(fileurl, "user", false);
    };
    downloadFile()
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = fileKey;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.parentNode.removeChild(a);
      }).catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      {showForm && <DownloadRequestForm requestData={detailsData} label="Data" id={detailsData.id} title={detailsData.name} setShowForm={setShowForm} setRefreshDataset={setRefreshDataset} />}
      {showSignInModal && <SignInModal label="data" setShowSignInModal={setShowSignInModal} />}
      <div className="details">
        <div className="details__banner">
          <div className="container">
            {isMobile ? null : (
              <div className="d-flex">
                <Breadcrumb />
                <span className="breadcrumb_subname">{detailsData?.name}</span>
              </div>
            )}
            {isMobile ? (
              <>
                <BannerTitle title="Data & Services"></BannerTitle>
                <h2 className="details__banner-subname">
                  {detailsData?.datasetName}
                </h2>
              </>
            ) : (
              <BannerTitle
                title={
                  detailsData?.name + (dataProvider ? " - " + dataProvider : "")
                }
              ></BannerTitle>
            )}
            <div className="row m-0">
              <div className="col-sm-12 col-md-6 ps-0 pe-4 details_picture">
                <img
                  src={productImage}
                  alt="data-catalogue"
                  className="details_picture-img"
                />
              </div>
              <div className="col-sm-12 col-md-6 pe-0 ps-4 details_description">
                <p>{detailsData?.description}</p>
                {subscribedStatus?.requestStatus === "REQUEST_APPROVED" ? (
                  <ButtonComponent
                    type="primaryWhite"
                    onClick={(e) => handleDownloadNow(e)}
                    style={{ cursor: subscribedStatus?.isApiAvailable ? "not-allowed" : 'pointer' }}
                  >
                    {(subscribedStatus?.dataAccessType === 'Download' && subscribedStatus?.isApiAvailable === false) ? "Download Now" : "Subscribed"}
                  </ButtonComponent>
                ) : (
                  <>
                    {(subscribedStatus?.requestStatus === "REQUEST_PENDING" || subscribedStatus?.requestStatus === "PAYMENT_PENDING" )? (
                      <ButtonComponent type="primaryWhite" style={{ cursor: "not-allowed" }}>
                        Request-in-progress
                      </ButtonComponent>
                    ) : (
                      <ButtonComponent type="primaryWhite"
                        onClick={handleDownload}>
                        {(detailsData?.dataAccessTypeName === 'Download' && detailsData?.isApiAvailable === false) ? "Download" : "Subscribe"}
                      </ButtonComponent>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="details__content container">
          <div className="row m-0" id="content_details">
            <div className="col-sm-12 col-md-6 ps-0 pe-4 details__content-tabs">
              <Tabs defaultActiveKey="documentation">
                <Tab eventKey="documentation" title="Documentation">
                  {documentation?.length>0?
                    documentation.map((item, index) => {
                      return (
                        <span key={item.fileKey}>
                          <p>{item.title}</p>
                          <button className="document-link"
                            onClick={(e) => handleFilePreview(e, item.fileKey, item.url)}>{item?.fileKey?.split('_').slice(1).join('_')}</button>

                          {index !== documentation.length - 1 ? <hr /> : null}
                        </span>
                      );
                    })
                    :<p>NA</p>
                  }
                </Tab>
                <Tab eventKey="license" title="License">
                  {license?.length>0?
                    license.map((item, index) => {
                      return (
                        <span key={item.fileKey}>
                          <p>{item.title}</p>
                          <button className="document-link"
                            onClick={(e) => handleFilePreview(e, item.fileKey, item.url)}>{item?.fileKey?.split('_').slice(1).join('_')}</button>
                          {index !== license.length - 1 ? <hr /> : null}
                        </span>
                      );
                    })
                    :<p>NA</p>
                  }
                </Tab>
                <Tab eventKey="datafiles" title="Sample Data">
                  {dataFiles?.length>0?
                    dataFiles.map((item, index) => {
                      return (
                        <span key={item.fileKey}>
                          <p>{item.title}</p>
                          <button className="document-link"
                            onClick={(e) => handleFileDownload(e, item.fileKey, item.url)}>{item?.fileKey?.split('_').slice(1).join('_')}</button>
                          {index !== dataFiles.length - 1 ? <hr /> : null}
                        </span>
                      );
                    })
                    :<p>NA</p>
                  }
                </Tab>
              </Tabs>
            </div>
            <div className="col-sm-12 col-md-6 pe-0 ps-4 details__content-features">
              <Tags
                name={
                  detailsData?.searchTags
                    ? detailsData?.searchTags.split(",")
                    : []
                }
              ></Tags>
              <div className="row m-0 details__content-features-data">
                <div className="col-8 ps-0">
                  <span style={{ fontSize: "16px" }}>Version</span>
                  <p>{detailsData?.version}</p>
                </div>
                <div className="col-4 pe-0">
                  <span>API available</span>
                  <p>{detailsData?.isApiAvailable ? "Yes" : "No"}</p>
                </div>
                <hr />
                <div className="col-8 ps-0">
                  <span>Types of data</span>
                  <p>{detailsData?.datasetTypeName}</p>
                </div>
                <div className="col-4 pe-0">
                  <span>Date published</span>
                  <p>{detailsData?.publishedDate}</p>
                </div>
                <hr />
                <div className="col-8 ps-0">
                  <span>Data Provider</span>
                  <p>
                    {dataProvider
                      ? dataProvider
                      : "-"}
                  </p>
                </div>
                <div className="col-4 pe-0">
                  <span>Last updated on</span>
                  <p>
                    {detailsData?.lastModifiedDate ? detailsData?.lastModifiedDate.split('T')[0] : "-"}
                  </p>
                </div>
                <hr />
                <div className="col-8 ps-0">
                  <span>Update Frequency</span>
                  <p>{detailsData?.updateFrequency}</p>
                </div>
                <div className="col-4 pe-0">
                  <span>Processing of value</span>
                  <p>{detailsData?.processingOfValuesName}</p>
                </div>
                <hr />
                <div className="col-8 ps-0">
                  <span>Data Fields Covered</span>
                  <p>{detailsData?.dataFieldsCovered}</p>
                </div>
                <div className="col-4 pe-0">
                  <span>Search tags</span>
                  <p>{detailsData?.searchTags}</p>
                </div>
                <hr />
                <div className="col-8 ps-0">
                  <span>Charging model</span>
                  <p>{detailsData?.chargingModelName}</p>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataDetails;
