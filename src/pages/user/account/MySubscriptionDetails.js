import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Image } from "react-bootstrap";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import MySubscriptionForm from "./MySubscriptionForm";
import ReusableForm from "./ReusableForm";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { getUnsubscribeDataApi } from "../../../services/apiservices";
import "../../../assets/styles/mySubscriptionDetails.scss";
import BusImage from '../../../assets/images/products/bus.jpg';
import MetroImage from '../../../assets/images/products/metro.png';
import PassengerCountImage from '../../../assets/images/products/passengercount.png';
import ParkingImage from '../../../assets/images/products/parking.png';
import RapidImage from '../../../assets/images/products/rapidrail.png';
import ETAImage from '../../../assets/images/products/eta.png';
import JourneyImage from '../../../assets/images/products/journey.png';
import TicketingImage from '../../../assets/images/products/ticket.png';
import { downloadFileAPI } from "../../../services/apiservices";

const MysubscriptionDetails = ({ activeDataset, path, callUnSubscribe }) => {
  const [productImage, setProductImage] = useState('');
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
      const fileKey = activeDataset?.imageFileKey;
  
      if (fileKey) {
        try {
          const response = await downloadFileAPI(
            `/api/dataset/download?key=${encodeURIComponent(fileKey)}`,
            'admin',
            false
          );
          const blob = new Blob([response.data], { type: 'image/png' });
          const blobUrl = URL.createObjectURL(blob);
          setProductImage(blobUrl);
          return; // ✅ only run fallback if this fails
        } catch (error) {
          console.error('Error loading product image:', error);
        }
      }
  
      const fallbackImage = determineFallbackImage(activeDataset?.name || '');
      setProductImage(fallbackImage);
    };
  
    if (activeDataset) {
      fetchImage();
    }
  }, [activeDataset]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [renew, setRenew] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const renewSubscription = () => {
    setRenew(true);
  };

  const subscribe = () => {
    setShowConfirmModal(true);
  };

  const hideConfirmModal = () => {
    let name = activeDataset.requestType == "DataSet" ? 'dataset' : 'serviceSet'
    setSuccessMessage('')
    setErrorMessage('')
    const unSubscribeDataApi = async () => {
      return getUnsubscribeDataApi(name, activeDataset?.requestNo);
    };
    unSubscribeDataApi()
      .then((response) => {
        setSuccessMessage(response.message)
        setTimeout(() => {
          callUnSubscribe()
        }, 3000);
      })
      .catch((error) => {
        setErrorMessage(error.message)
      });
    setShowConfirmModal(false);
  };

  const hideCancelModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div>
      {activeDataset !== undefined && renew === false && (
        <div className="my-subscriptionDetails">
          <div className="content">
            {showConfirmModal && (
              <ConfirmModal
                action="unsubscribe"
                category="from existing dataset/service"
                onYesClick={hideConfirmModal}
                onNoClick={hideCancelModal}
              />
            )}
            <div>
              <div className="detailsPane">
                <Image src={productImage} className="detailImg" />
                <div className="dataDetails">
                  <h4 className="detailHeader">{activeDataset?.name}</h4>
                  {path === "mysubscriptions" ? (
                    <>
                      <p className="details">
                        Data Set provider - {activeDataset?.providerName}
                      </p>
                      <p className="details">
                        Current Status - {activeDataset?.requestStatus}
                      </p>
                      {activeDataset?.expiryDate && !activeDataset?.expiryDate.includes("9999") ? <p className="details">
                        Expiry date - {activeDataset.expiryDate}</p> : null
                      }
                      {/* {activeDataset?.expiryDate ? <p className="details">
                        Expiry Date - {activeDataset.expiryDate}
                      </p> : ''
                      } */}

                      <div className="actions">
                        <ButtonComponent
                          type="primaryBlue"
                          onClick={() => renewSubscription()}
                          className="action"
                          disabled={true}
                        >
                          Renew subscription
                        </ButtonComponent>

                        {/* <ButtonComponent
                          type="primaryBlue"
                          onClick={() => paynow()}
                          className="action"
                          disabled={
                            activeDataset.currentStatus !== "Payment Pending"
                          }
                        >
                          Pay now
                        </ButtonComponent> */}
                        <ButtonComponent
                          type="primaryBlue"
                          className="action"
                          onClick={() => subscribe()}
                          disabled={
                            (successMessage.length > 0) || (activeDataset.requestStatus === 'Request Rejected')
                          }
                        >
                          Unsubscribe
                        </ButtonComponent>
                      </div>
                    </>
                  ) : (
                    <p className="details">
                      Current Status - {activeDataset.requestStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {successMessage.length > 0 ?
              <p style={{ color: "green" }} className="mt-2">{successMessage}</p> : null}
            {errorMessage.length > 0 ?
              <p className="is-invalid-border-only mt-2">{errorMessage}</p> : null}
            <div style={{ marginTop: "2rem" }}>
              <h5 className="requestHeader">Request form details</h5>
              <MySubscriptionForm path={path} activeDataset={activeDataset} />
            </div>
          </div>
        </div>
      )}
      {renew && <ReusableForm label={true} />}
    </div>
  );
};

MysubscriptionDetails.propTypes = {
  path: PropTypes.string,
  activeDataset: PropTypes.object,
  callUnSubscribe: PropTypes.func,
};
export default MysubscriptionDetails;
