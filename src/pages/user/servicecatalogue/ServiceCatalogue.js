import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMasterData from "../../../hooks/useMasterData";
import SelectComponent from "../../../components/common/ui/select/SelectComponent";
import Product from "../../../components/user/Product";
import Pagination from "../../../components/common/ui/pagination/Pagination";
import { getChargingModelByTypeAPI, getServiceLists } from "../../../services/apiservices";
import "../../../assets/styles/dataservice.scss";

const ServiceCatalogue = () => {
  const servicecards = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [productData, setProductData] = useState([]);
  const [filterValue1, setFilterValue1] = useState('');
  const [filterValue2, setFilterValue2] = useState('');
  const { data: serviceTypeDrop } = useMasterData("service-type", "user", false);
  const [serviceChargingModelDrop, setServiceChargingModelDrop] = useState([]);
  useEffect(() => {
    let params = "page=" + (currentPage - 1) + "&size=12&sortBy=id&sortDir=asc" +
      "&typeOfService=" + filterValue1 + // filter params
      "&chargingModelId=" + filterValue2;
    getCardsService(params);
    window.scrollTo({
      top: servicecards.current.offsetTop,
      behaviour: "smooth",
    });
  }, [currentPage, filterValue1, filterValue2]);

  const getCardsService = (params) => {
    let data = [];
    const fetchCardService = async () => {
      return getServiceLists(params);
    };
    fetchCardService()
      .then((response) => {
        setTotalPages(response?.totalPages);
        response?.content.forEach((element, index) => {
          let provider = [];
          element?.serviceProviders?.forEach((e) => {
            provider.push(e.name);
          });
          let searchTags = (element?.searchTags || [])
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag)
            .slice(0, 3);
          let obj = {
            id: element?.id,
            name: element?.name,
            description: element?.description,
            ovalCardData: searchTags,
            sub_name:
              element?.serviceProviders.length > 0
                ? provider?.join(", ")
                : "",
            titleName:
              element?.name + " - " + (element?.serviceProviders?.length > 0
                ? provider?.join(", ")
                : ""),
          };
          data.push(obj);
        });
        setProductData(data);
        setError('')
      })
      .catch((err) => {
        setError(err)
        setProductData(data);
      });
  };

  const handleProductClick = (id) => {
    navigate("servicedetails/" + id);
  };


  const getChargingModelOptions = (value) => {
    const getChargingModel = async () => {
      return await getChargingModelByTypeAPI(value);
    };
    getChargingModel().then((items) => {
      const chargingmodeloptions = items.map(({ name, id }) => ({
        label: name,
        value: id
      }));
      setServiceChargingModelDrop(chargingmodeloptions);
    }).catch((error) => {
      // setLoader(false);
    });
  }

  const handleServiceChange = (value) => {
    setFilterValue1(value);
    getChargingModelOptions(value);
  }

  return (
    <div className="mb-5" ref={servicecards}>
      <h1 className="header-title">Services Catalogue</h1>
      <div className="dataservice__banner-dropdown d-flex">
        <SelectComponent
          className="drop_lg"
          label="Type of Service"
          options={serviceTypeDrop}
          onSelectChange={(value) => handleServiceChange(value)}
        ></SelectComponent>
        <SelectComponent
          className="drop_lg"
          label="Charging Model"
          options={serviceChargingModelDrop}
          onSelectChange={(value) => setFilterValue2(value)}
        ></SelectComponent>
      </div>
      {productData.length > 0 ?
        <div className="row m-0 p-0">
          {productData.map((item, i) => {
            return (
              <div key={item.id} className="col-md-6 col-lg-4 p-0">
                <Product
                  data={item}
                  onClick={() => handleProductClick(item.id)}
                ></Product>
              </div>
            );
          })}
        </div>
        :
        <>
          {error.length > 0 ?
            <p className="is-invalid-border-only mt-2">{error}</p> :
            <p className="pt-3">No data available</p>
          }
        </>
      }

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ServiceCatalogue;
