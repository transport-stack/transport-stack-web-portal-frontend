import React, { useEffect, useRef, useState } from "react";
import { Alert, Col, Image, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import useMasterData from "../../../hooks/useMasterData";
import SelectComponent from "../../../components/common/ui/select/SelectComponent";
import TableSearch from "../../../components/common/ui/table/TableSearch";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import ReactTableComponent from "../../../components/common/ui/table/ReactTableComponent";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { deleteAPI, getAPIavailabilityAPI, getDataLists, getDataProvidersAPI } from "../../../services/apiservices";
import EditIcon from "../../../assets/images/edit-icon.png";
import DeleteIcon from "../../../assets/images/delete-row.svg";
import AddIcon from "../../../assets/images/add-fill-icon.svg";

const DataListingManagement = () => {
  const navigate = useNavigate();
  const listcontent = useRef(null);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiErrors, setApiErrors] = useState("");
  const [loader, setLoader] = useState();
  const [sortingId, setSortingId] = useState("sequenceId");
  const [sortingOrder, setSortingOrder] = useState("asc");
  const [searchValue, setSearchValue] = useState('');
  const [filterValue1, setFilterValue1] = useState('');
  const [filterValue2, setFilterValue2] = useState('');
  const [filterValue3, setFilterValue3] = useState('');
  const { data: dataTypeMaster } = useMasterData('dataset-type', 'admin', false);
  const [dataProviderDrop, setDataProviderDrop] = useState([]);
  const [dataApiDrop, setApiDrop] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentDatasetID, setCurrentDatasetID] = useState('');
  const { role } = useSelector((state) => state.auth.admin);
  const columns = React.useMemo(
    () => [
      {
        Header: "Dataset ID",
        accessor: "sequenceId",
        Cell: (e) => (
          <button
            className="has-link"
            onClick={() =>
              navigate("/admin/dataservicemanagement/viewdataset/" + e.cell.row.original.id)
            }
          >
            {e.value}
          </button>
        ),
        sortKey: "Active",
      },
      {
        Header: "Dataset Title",
        accessor: "name",
        sortKey: "Inactive",
      },
      { Header: "Type of Data", accessor: "datasetTypeName" },
      { Header: "Transport Mode", accessor: "transportModeName" },
      { Header: "Ancilliary Service", accessor: "ancillaryServiceName" },
      {
        Header: "Data Provider",
        id: "dataProviders",
        sortKey: "Inactive",
        accessor: (data) => {
          let output = [];
          if (Array.isArray(data?.dataProviders)) {
            data?.dataProviders.map((item) => {
              output.push(item.name);
            });
          }

          return output.join(", ");
        },
      },
      {
        Header: "Date Published",
        id: "publishedDate",
        sortKey: "Inactive",
        accessor: "publishedDate",
      },
      {
        Header: "Action",
        id: "action",
        Cell: (data) => {
          return (
            <div className="d-flex">
              <button
                className="table-button"
                disabled={role.includes("ROLE_DATA_PROVIDER")}
                onClick={() => handleEdit(data.cell.row.original)}
              >
                <img src={EditIcon} alt="edit icon" title="Edit" />
              </button>
              <button
                className="table-button"
                disabled={role.includes("ROLE_DATA_PROVIDER")}
                onClick={() => handleDelete(data.cell.row.original)}
              >
                <img src={DeleteIcon} alt="delete icon" title="Delete" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );


  useEffect(() => {
    fetchData();
    window.scrollTo({
      top: listcontent.current.offsetTop,
      behaviour: "smooth",
    });
    return () => { };
  }, [currentPage, sortingId, sortingOrder, searchValue, filterValue1, filterValue2, filterValue3]);

  const fetchData = () => {
    setLoader(true)
    let params =
      "page=" +
      (currentPage - 1) +
      "&size=10&sortBy=" +
      sortingId +
      "&sortDir=" +
      sortingOrder +
      "&name=" + searchValue + // search params
      "&typeOfData=" + filterValue1 + // filter params
      "&dataProviderId=" + filterValue2 +
      "&isApiAvailable=" + filterValue3;

    const getData = async () => {
      return await getDataLists(params);
    };
    getData()
      .then((items) => {
        setData(items?.content);
        setTotalPages(items?.totalPages);
        setApiErrors("");
        setLoader(false);
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

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  }

  const deleteDataset = () => {
    const datasetID = {
      'id': currentDatasetID,
    };
    const deleteDataset = async () => {
      return deleteAPI('dataset', datasetID);
    };

    deleteDataset().then((response) => {
      setLoader(false);
      setShowConfirmModal(false);
      setCurrentDatasetID('');
      fetchData()

    }).catch((error) => {
      setLoader(false);
    });

  }

  const handleEdit = (data) => {
    navigate("/admin/dataservicemanagement/editdataset/" + data.id)
  };

  const handleDelete = (data) => {
    setCurrentDatasetID(data.id);
    setShowConfirmModal(true);
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
    <div ref={listcontent} className="data_listing">
      {apiErrors && (
        <Alert variant="danger" className="text-center">{apiErrors}</Alert>
      )}
      {showConfirmModal && (
        <ConfirmModal
          action="delete"
          category="dataset"
          onYesClick={deleteDataset}
          onNoClick={hideConfirmModal}
          confirmModal={setShowConfirmModal}
        />
      )}

      <Row className="mb-4">
        <Col md={6}>
          <TableSearch placeholder="Enter Data Set Name" setSearchValue={setSearchValue} />
        </Col>
        <Col md={6} className="text-end">
          <ButtonComponent
            type="primaryWhite"
            className="button-icon"
            onClick={() =>
              navigate("/admin/dataservicemanagement/createnewdataset")
            }
            disabled={role.includes('ROLE_DATA_PROVIDER')}
          >
            <Image src={AddIcon} alt="add" />
            Add New Data Set
          </ButtonComponent>
        </Col>
      </Row>
      <div className="filter__container">
        <Row>
          <Col md={2}>
            <SelectComponent
              className="select-secondary"
              label="Type of Data"
              options={dataTypeMaster}
              onSelectChange={(value) => handleTypeOfDataChange(value)}
            />
          </Col>
          <Col md={2}>
            <SelectComponent
              className="select-secondary"
              label="Data Providers"
              options={dataProviderDrop}
              onSelectChange={(value) => handleDataProviderChange(value)}
            />
          </Col>
          <Col md={2}>
            <SelectComponent
              className="select-secondary"
              label="API Availability"
              options={dataApiDrop}
              onSelectChange={(value) => setFilterValue3(value)}
            />
          </Col>
        </Row>
      </div>
      {(data && !loader) ? (
        <ReactTableComponent
          columns={columns}
          data={data.length > 0 ? data : []}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setSortingId={setSortingId}
          setSortingOrder={setSortingOrder}
        />
      ) : (
        <ShimmerTable row={10} col={8} />
      )}
      <p className="is-invalid-border-only mt-2">{apiErrors}</p>
    </div>
  );
};

export default DataListingManagement;
