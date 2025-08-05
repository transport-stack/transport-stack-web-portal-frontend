import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Product1 from "../../../components/user/Product1";
import MySubscriptionDetails from "./MySubscriptionDetails";
import { getSubscribeRequestList } from "../../../services/apiservices";
import Pagination from "../../../components/common/ui/pagination/Pagination";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";

const MySubscriptionOrRequest = ({ label, path }) => {
  const [productData, setProductData] = useState([]); 
  const [activeId, setActiveId] = useState(null);
  const [currentDataset, setCurrentDataset] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const getCardsData = (type) => {
    let data = [];
    const fetchCardData = async () => {
      return getSubscribeRequestList(type, currentPage);
    };
    fetchCardData()
      .then((response) => {
        setTotalPages(response?.totalPages);
        response?.content?.forEach((element) => {
          let provider = [];
          element?.dataProviders?.forEach((e) => {
            provider.push(e.name);
          });
          let searchTags = element?.resourceSearchTags?.split(",") || [];
          let obj = {
            id: element?.resourceId,
            name: element?.resourceTitle,
            description: element?.resourceDescription,
            ovalCardData: searchTags,
            sub_name:
              element?.dataProviders?.length > 0 ? provider?.join(", ") : "",
            titleName:
              element?.resourceTitle + element?.providerName
                ? " - " + element?.providerName
                : "",
            expiryDate: element?.expirationDate,
            requestStatus: element?.requestStatus,
            requestNo: element?.requestNo,
            requestType: element?.requestType,
            providerName: element?.providerName,
            imageFileKey: element?.imageFileKey
          };
          data.push(obj);
        });
        setProductData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setActiveId(null);
    setCurrentDataset(null);
    getProductList()
    window.scrollTo({ top: 0, behaviour: "smooth" });
  }, [path, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [path]);


  const onClickProduct = (requestNo) => {
    let activeDataset = productData.find(
      (item) => item.requestNo === requestNo
    );
    if (activeDataset) {
      setCurrentDataset(activeDataset);
      setActiveId(activeDataset?.requestNo);
      // have to navigate here
    }
  };

  const callBackBtn = () => {
    setCurrentDataset(null);
    setActiveId(null);
  };
  
  const callUnSubscribe = () => {
    setCurrentDataset(null);
    setActiveId(null);
    getProductList()
  };

  const getProductList = () => {
    if (path === 'mysubscriptions') {
      setProductData([]);
      getCardsData('subscriptions');
    } else if (path === 'myrequests') {
      setProductData([]);
      getCardsData('requests');
    }
  }

  const isCardExpired = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    const expiryDate = new Date(`${year}-${month}-${day}`);
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return expiryDate < today;
  }

  return (
    <div>
      {productData.length > 0 ? (
        <div className="container mt-5" >
          <div className="row m-0">
            <div className="register_header d-flex">
              <h2 className="registerLabel">{label}</h2>
              {activeId === null && currentDataset === null ?
              null
              : (
                <ButtonComponent
                type="primaryWhite"
                className="m-0"
                onClick={() => {
                  callBackBtn()
                }}
              >
                Back
              </ButtonComponent>
              )}
            </div>
            {activeId === null && currentDataset === null ?
              <>
                {productData.map((item, i) => {
                  if(item.expiryDate && isCardExpired(item.expiryDate)){
                    return null;
                  } 
                  return (
                    <div key={item.id} className="col-md-6 col-lg-4 p-0 product-card" onClick={() => onClickProduct(item.requestNo)}>
                      <Product1
                        data={item}
                      ></Product1>
                    </div>
                  );
                })}
                < Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
              : (
                <MySubscriptionDetails
                  activeDataset={currentDataset}
                  path={path}
                  callUnSubscribe={callUnSubscribe}
                />
              )}
          </div>
        </div>
      ) : <p className="container mt-4">No Records available</p>}
    </div>
  );
};
MySubscriptionOrRequest.propTypes = {
  path: PropTypes.string,
  label: PropTypes.string
};
export default MySubscriptionOrRequest;
