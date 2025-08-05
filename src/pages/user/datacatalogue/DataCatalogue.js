import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useMasterData from "../../../hooks/useMasterData";
import SelectComponent from "../../../components/common/ui/select/SelectComponent";
import Product from "../../../components/user/Product";
import Pagination from "../../../components/common/ui/pagination/Pagination";
import { getAPIavailabilityAPI, getDataLists, getDataProvidersAPI } from "../../../services/apiservices";
import "../../../assets/styles/dataservice.scss";

const DataCatalogue = () => {
  const datacards = useRef(null);
  let navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productData, setProductData] = useState([]);
  const [filterValue1, setFilterValue1] = useState('');
  const [filterValue2, setFilterValue2] = useState('');
  const [filterValue3, setFilterValue3] = useState('');
  const { data: dataTypeDrop } = useMasterData("dataset-type", "user", false);
  const [dataProviderDrop, setDataProviderDrop] = useState([]);
  const [dataApiDrop, setApiDrop] = useState([]);

  useEffect(() => {
    let params = "page=" + (currentPage - 1) + "&size=12&sortBy=id&sortDir=asc" +
      "&typeOfData=" + filterValue1 + // filter params
      "&dataProviderId=" + filterValue2 +
      "&isApiAvailable=" + filterValue3;
    getCardsData(params);
    window.scrollTo({ top: datacards.current.offsetTop, behaviour: "smooth" });
  }, [currentPage, filterValue1, filterValue2, filterValue3]);

  const getCardsData = (params) => {
    let data = [];
    const fetchCardData = async () => {
      return getDataLists(params);
    };
    fetchCardData()
      .then((response) => {
        setTotalPages(response?.totalPages);
        response?.content?.forEach((element) => {
          let provider = [];
          element?.dataProviders?.forEach((e) => {
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
              element?.dataProviders?.length > 0 ? provider?.join(", ") : "",
            titleName:
              element?.name + " - " + element?.dataProviders?.length > 0
                ? provider?.join(", ")
                : "",
            image: element?.image
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

  const onClickProduct = (id) => {
    navigate("datadetails/" + id);
  };

  const getDataProvidersOptions = (value) => {
    const getDataProviders = async () => {
      return await getDataProvidersAPI(value);
    };
    getDataProviders().then((items) => {
      const dataprovideroptions = items.map(({ name, id }) => ({
        label: name,
        value: id
      }));
      setDataProviderDrop(dataprovideroptions);
      setFilterValue2('');
    }).catch((error) => {
      // setLoader(false);
    });
  }

  const handleTypeOfDataChange = (value) => {
    setFilterValue1(value);
    getDataProvidersOptions(value);
  }

  const getAPIavailabilityOptions = (value) => {
    const getAPIavailability = async () => {
      return await getAPIavailabilityAPI(filterValue1, value);
    };
    getAPIavailability().then((items) => {
      const dataprovideroptions = items.map((item) => ({
        label: item === true ? "Yes" : "No",
        value: item
      }));
      setApiDrop(dataprovideroptions);
      setFilterValue3('')
    }).catch((error) => {
      // setLoader(false);
    });
  }

  const handleDataProviderChange = (value) => {
    setFilterValue2(value);
    getAPIavailabilityOptions(value);
  }

  return (
    <div className="mb-5" ref={datacards}>
      <h1 className="header-title">Data Catalogue</h1>
      <div className="dataservice__banner-dropdown d-flex">
        <SelectComponent
          className="drop_lg"
          label="Type of Data"
          options={dataTypeDrop}
          onSelectChange={(value) => handleTypeOfDataChange(value)}
        ></SelectComponent>
        <SelectComponent
          className="drop_lg"
          label="Data Providers"
          options={dataProviderDrop}
          onSelectChange={(value) => handleDataProviderChange(value)}
        ></SelectComponent>
        <SelectComponent
          className="drop_md"
          label="API Availability"
          options={dataApiDrop}
          onSelectChange={(value) => setFilterValue3(value)}
        ></SelectComponent>
      </div>
      {productData.length > 0 ?
        <div className="row m-0">
          {productData.map((item) => {
            return (
              <div key={item.id} className="col-md-6 col-lg-4 p-0 data_cards">
                <Product
                  data={item}
                  onClick={() => onClickProduct(item.id)}
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

export default DataCatalogue;
