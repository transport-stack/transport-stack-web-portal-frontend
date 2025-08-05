import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "../../../assets/styles/formcomponent.scss";
import "../../../assets/styles/mySubscriptionDetails.scss";
import { getSubscribeRequestDetails } from "../../../services/apiservices";
import { useSelector } from "react-redux";
import useMasterData from "../../../hooks/useMasterData";

const MySubscriptionForm = ({ path, activeDataset }) => {
  const { id: userId } = useSelector((state) => state.auth.user.profile);
  const { data: subscriptionTypeMaster } = useMasterData('subscription-type', 'user');
  const { data: typeOfUsageMaster } = useMasterData('type-of-usage', 'user');
  const [productDetails, setProductDetails] = useState({});
  const [showDropdown, setShowDropdown] = useState(true);
  const {
    register,
    setValue,
  } = useForm({ mode: "onChange" });

  const getCardsData = (type) => {
    const data = {
      "userId": userId,
      "requestNo": activeDataset?.requestNo,
      "requestType": activeDataset?.requestType
    };
    const fetchCardData = async () => {
      return getSubscribeRequestDetails(type, data);
    };

    fetchCardData()
      .then((response) => {
        setProductDetails(response);
        setValue("orgName", response?.organizationName || "");
        setValue("authorizedPerson", response?.firstName + response?.lastName);
        setValue("email", response?.email || "");
        setValue("mobileNumber", response?.mobileNumber || "");
        setValue("nodalPersonName", response?.nodalPersonName || "");
        setValue("nodalPersonMobileNumber", response?.nodalPersonMobileNumber || "");
        setValue("requestDate", response?.requestDate || "");
        setValue("resourceTitle", response?.resourceTitle || "");
        setValue("requestPurpose", response?.requestPurpose || "");
        // setValue("typeOfUse", response?.typeOfUse || "");
        // setValue("subscriptionModel", response?.subscriptionModel || "");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (path === 'mysubscriptions') {
      getCardsData('subscriptions');
    } else if (path === 'myrequests') {
      getCardsData('requests');
    }
    window.scrollTo({ top: 0, behaviour: "smooth" });
  }, [path]);

  useEffect(() => {
    setValue("typeOfUse", productDetails?.typeOfUse);
  }, [typeOfUsageMaster,productDetails]);

  useEffect(() => {
    setValue("subscriptionModel", productDetails?.subscriptionModel);
  }, [subscriptionTypeMaster,productDetails]);

  useEffect(() => {
    if (productDetails?.expirationDate) {
      const parsedDate = new Date(productDetails.expirationDate.split('-').reverse().join('-'));
      const maxDate = new Date('9999-12-31');
      const isMaxDate = parsedDate.getTime() === maxDate.getTime();
      setShowDropdown(!isMaxDate);
    }
  }, [productDetails?.expirationDate]);

  return (
    <div className="formComponent">
      <Form autoComplete="off">
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel label="Name of Organization" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name of Organization"
                name="orgName"
                disabled
                maxLength={30}
                {...register("orgName")}
              />

            </FloatingLabel>
          </Col>
          <Col md={12} lg={{ span: 5, offset: 2 }}>
            <FloatingLabel
              label="Name of Authorized Person Requesting Data"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of Authorized Person Requesting Data"
                name="authorizedPerson"
                disabled
                maxLength={30}
                {...register("authorizedPerson")}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel label="Email" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Email"
                name="email"
                disabled
                maxLength={30}
                {...register("email")}
              />

            </FloatingLabel>
          </Col>
          <Col md={12} lg={{ span: 5, offset: 2 }}>
            <FloatingLabel label="Phone Number" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Phone Number"
                name="mobileNumber"
                disabled
                maxLength={30}
                {...register("mobileNumber")}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel label="Name of nodal person" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name of nodal person"
                name="nodalPersonName"
                disabled
                maxLength={30}
                {...register("nodalPersonName")}
              />
            </FloatingLabel>
          </Col>
          <Col md={12} lg={{ span: 5, offset: 2 }}>
            <FloatingLabel label="Phone Number" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Phone Number"
                name="nodalPersonMobileNumber"
                disabled
                maxLength={30}
                {...register("nodalPersonMobileNumber")}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 5 }}>
            <FloatingLabel
              label="Date of data request"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Date of data request"
                name="requestDate"
                disabled
                maxLength={30}
                {...register("requestDate")}
              />
            </FloatingLabel>
          </Col>
          <Col md={12} lg={{ span: 5, offset: 2 }}>
            <FloatingLabel label="Data Service Title" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Data Service Title"
                name="resourceTitle"
                disabled
                maxLength={30}
                {...register("resourceTitle")}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12}>
            <FloatingLabel
              label="Purpose of Data/Service Request"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Purpose of Data/Service Request"
                name="requestPurpose"
                disabled
                maxLength={30}
                {...register("requestPurpose")}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={{ span: 3 }}>
            <FloatingLabel
              controlId="floatingSelect"
              label="Type of Use"
              className="mb-3"
            >
              <Form.Select
                aria-label="Floating label Type of Use"
                name="typeOfUse"
                disabled
                {...register("typeOfUse")}
              >
                <option value=''>Select</option>
                {typeOfUsageMaster.length > 0 &&
                  typeOfUsageMaster.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
          {(productDetails?.dataAccessTypeName === "Subscribe" || productDetails?.isApiAvailable === true || productDetails?.requestType==="ServiceSet")
          && showDropdown ?
            <Col md={12} lg={{ span: 3, offset: 4 }}>
              <FloatingLabel
                controlId="floatingSelect"
                label="Subscription Type"
                className="mb-3"
              >
                <Form.Select
                  aria-label="Floating label Subscription Type"
                  name="subscriptionModel"
                  disabled
                  {...register("subscriptionModel")}
                >
                  <option value=''>Select</option>
                  {subscriptionTypeMaster.length > 0 &&
                    subscriptionTypeMaster.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                </Form.Select>
              </FloatingLabel>
            </Col>:null
          }
        </Row>
      </Form>
    </div>
  );
};

MySubscriptionForm.propTypes = {
  path: PropTypes.string.isRequired,
  activeDataset: PropTypes.shape({
    requestNo: PropTypes.number.isRequired,
    requestType: PropTypes.string.isRequired,
  }).isRequired,
};

export default MySubscriptionForm;
