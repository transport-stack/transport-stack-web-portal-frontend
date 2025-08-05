import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-bootstrap";
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
import { downloadFileAPI, getServiceDetails, getSubscribedStatus } from "../../../services/apiservices";
import "../../../assets/styles/datadetails.scss";
import BusImage from '../../../assets/images/products/bus.jpg';
import MetroImage from '../../../assets/images/products/metro.png';
import PassengerCountImage from '../../../assets/images/products/passengercount.png';
import ParkingImage from '../../../assets/images/products/parking.png';
import RapidImage from '../../../assets/images/products/rapidrail.png';
import ETAImage from '../../../assets/images/products/eta.png';
import JourneyImage from '../../../assets/images/products/journey.png';
import TicketingImage from '../../../assets/images/products/ticket.png';

const ServiceDetails = () => {
  const dispatch = useDispatch();
  const isMobile = useCheckMobileScreen();
  const { id } = useParams();
  const [refreshDataset, setRefreshDataset] = useState(false);
  const [detailsData, setDetailsData] = useState([]);
  const [subscribedStatus, setSubscribedStatus] = useState([]);
  const [serviceProvider, setServiceProvider] = useState([]);
  const [documentation, setDocumentation] = useState([]);
  const [license, setLicense] = useState([]);
  const { isAuthenticated } = useSelector((state) => state.auth.user);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [productImage, setProductImage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = () => {
    const fetchServiceCardDetails = async () => {
      return getServiceDetails(id);
    };
    fetchServiceCardDetails()
      .then((response) => {
        setDetailsData(response);
        if (response?.documentsByType) {
          if (response?.documentsByType?.SERVICESET_DOCUMENTATION) {
            setDocumentation(
              response?.documentsByType?.SERVICESET_DOCUMENTATION
            );
          }
        } else {
          setDocumentation([]);
        }
        if (response?.documentsByType) {
          if (response?.documentsByType?.SERVICESET_LICENSE) {
            setLicense(response?.documentsByType?.SERVICESET_LICENSE);
          }
        } else {
          setLicense([]);
        }

        let provider = '';
        response?.serviceProviders?.forEach((element, index) => {
          provider += element.name
          if (index !== response.serviceProviders.length - 1) provider += ', '
        });
        setServiceProvider(provider);
        if (response == '') setErrorMessage('ServiceSet does not exist')
      })
      .catch((error) => {
        console.log(error);
      });
    if (isAuthenticated) {
      const fetchSubscribedStatus = async () => {
        return getSubscribedStatus(id, 'serviceset');
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
    let data = {
      status: false,
      path: ''
    }
    dispatch({ type: 'verify/userDataServiceLoginRequest', payload: data });
  }, []);

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
    if (detailsData?.name?.includes('Parking')) {
      setProductImage(ParkingImage)
    } else if (detailsData?.name?.includes('count')) {
      setProductImage(PassengerCountImage)
    } else if (detailsData?.name?.includes('Metro')) {
      setProductImage(MetroImage)
    } else if (detailsData?.name?.includes('Bus')) {
      setProductImage(BusImage)
    } else if (detailsData?.name?.includes('ETA Calculator')) {
      setProductImage(ETAImage)
    } else if (detailsData?.name?.includes('Journey')) {
      setProductImage(JourneyImage)
    } else if (detailsData?.name?.includes('Ticketing')) {
      setProductImage(TicketingImage)
    } else {
      setProductImage(RapidImage)
    }
  }, [detailsData])

  const subscribe = () => {
    if (isAuthenticated) {
      setShowForm(true);
    } else {
      setShowSignInModal(true);
    }
  };

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
      .then((response) => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {showForm && (
        <DownloadRequestForm
          label="Service"
          id={detailsData.id}
          title={detailsData.name}
          setShowForm={setShowForm}
          setRefreshDataset={setRefreshDataset}
          requestData={detailsData}
        />
      )}
      {showSignInModal && (
        <SignInModal label="service" setShowSignInModal={setShowSignInModal} />
      )}
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
                <h2 className="details__banner-subname">{detailsData?.name}</h2>
              </>
            ) : (
              <BannerTitle
                title={
                  detailsData?.name +
                  (serviceProvider
                    ? " - " + serviceProvider
                    : "")
                }
              ></BannerTitle>
            )}
            <div className="row m-0">
              <div className="col-sm-12 col-md-6 ps-0 pe-4 details_picture">
                <Image
                  src={productImage}
                  alt="service image"
                  className="details_picture-img"
                />
              </div>
              <div className="col-sm-12 col-md-6 pe-0 ps-4 details_description">
                <p>{detailsData?.description}</p>
                {subscribedStatus?.requestStatus === "REQUEST_APPROVED" ? (
                  <ButtonComponent
                    type="primaryWhite"
                    style={{ cursor: "not-allowed" }}
                  >
                    Subscribed
                  </ButtonComponent>
                ) : (
                  <>
                    {subscribedStatus?.requestStatus === "REQUEST_PENDING" ? (
                      <ButtonComponent type="primaryWhite" style={{ cursor: "not-allowed" }}>
                        Request in progress
                      </ButtonComponent>
                    ) : (
                      <ButtonComponent type="primaryWhite" onClick={() => subscribe()}>
                        Subscribe
                      </ButtonComponent>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="details__content container">
        <div className="row m-0" id="content_details">
          <div className="col-sm-12 col-md-6 ps-0 pe-4 details__content-tabs">
            <Tabs defaultActiveKey="documentation">
              <Tab eventKey="documentation" title="Documentation">
                { }
                {documentation?.length > 0 ?
                  documentation.map((item, index) => {
                    return (
                      <span key={item.fileKey}>
                        <p>{item.title}</p>
                        <button
                          className="document-link"
                          onClick={(e) =>
                            handleFilePreview(e, item.fileKey, item.url)
                          }
                        >
                          {item?.fileKey?.split('_').slice(1).join('_')}
                        </button>
                        {index !== documentation.length - 1 ? <hr /> : null}
                      </span>
                    );
                  })
                  : <p>NA</p>
                }
              </Tab>
              <Tab eventKey="license" title="License">
                {license?.length > 0 ?
                  license.map((item, index) => {
                    return (
                      <span key={item.fileKey}>
                        <p>{item.title}</p>
                        <button
                          className="document-link"
                          onClick={(e) =>
                            handleFilePreview(e, item.fileKey, item.url)
                          }
                        >
                          {item?.fileKey?.split('_').slice(1).join('_')}
                        </button>
                        {index !== license.length - 1 ? <hr /> : null}
                      </span>
                    );
                  })
                  : <p>NA</p>
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
                <span>Date published</span>
                <p>{detailsData?.datePublished}</p>
              </div>
              <hr />
              {/* <div className="col-8 ps-0">
                  <span>Used by</span>
                  <p>{detailsData?.usedby ? detailsData?.usedby : "-"}</p>
                </div> */}
              <div className="col-8 ps-0">
                <span>Type of Service</span>
                <p>{detailsData?.serviceSetTypeName ? detailsData?.serviceSetTypeName : "-"}</p>
              </div>
              <div className="col-4 pe-0">
                <span>Last updated on</span>
                <p>
                  {detailsData?.lastModifiedDate ? detailsData?.lastModifiedDate.split('T')[0] : "-"}
                </p>
              </div>
              <hr />
              {/* <div className="col-8 ps-0">
                  <span>Service Provider</span>
                  <p>
                    {serviceProvider
                      ? serviceProvider
                      : "-"}
                  </p>
                </div>
                <div className="col-4 pe-0">
                  <span>Search tags</span>
                  <p>
                    {detailsData?.searchTags ? detailsData?.searchTags : "-"}
                  </p>
                </div>
                <hr /> */}
              <div className="col-8 ps-0">
                <span>Charging model</span>
                <p>{detailsData?.chargingModelName}</p>
              </div>
              {detailsData?.chargingModelName === 'Paid' && <div className="col-4 pe-0">
                <span>Trial period</span>
                <p>
                  {detailsData?.trialPeriod ? detailsData?.trialPeriod : "-"}
                </p>
              </div>}
              <hr />
              {detailsData?.chargingModelName === "Paid" ? (
                <>
                  <div className="col-8 ps-0">
                    <span>Default fee</span>
                    <p>
                      {detailsData?.defaultFee
                        ? detailsData?.defaultFee
                        : "-"}
                    </p>
                  </div>
                  <hr />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div > :
    </>
  );
};

export default ServiceDetails;
