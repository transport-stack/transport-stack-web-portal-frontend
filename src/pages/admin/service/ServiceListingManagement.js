import React, { useEffect, useRef, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ShimmerTable } from 'react-shimmer-effects'
import useMasterData from '../../../hooks/useMasterData'
import ButtonComponent from '../../../components/common/ui/button/ButtonComponent'
import TableSearch from '../../../components/common/ui/table/TableSearch'
import SelectComponent from '../../../components/common/ui/select/SelectComponent'
import ReactTableComponent from '../../../components/common/ui/table/ReactTableComponent';
import ConfirmModal from '../../../components/admin/ConfirmModal'
import { getServiceLists, deleteAPI, getTransportModeAPI, getChargingModelByServiceModeAPI } from '../../../services/apiservices'
import EditIcon from '../../../assets/images/edit-icon.png'
import DeleteIcon from '../../../assets/images/delete-row.svg'
import AddIcon from '../../../assets/images/add-fill-icon.svg'

const ServiceListingManagement = () => {
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
    const { data: serviceTypeMaster } = useMasterData('service-type', 'admin');
    const [transportModeDrop, setTransportModeDrop] = useState([]);
    const [serviceChargingModelDrop, setServiceChargingModelDrop] = useState([]);

    const [filterValue1, setFilterValue1] = useState('');
    const [filterValue2, setFilterValue2] = useState('');
    const [filterValue3, setFilterValue3] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentServiceID, setCurrentServiceID] = useState('');
    const { role } = useSelector((state) => state.auth.admin);
    const columns = React.useMemo(
        () => [
            {
                Header: "Service ID",
                accessor: "sequenceId",
                Cell: (e) => (
                    <button className='has-link'
                        onClick={() =>
                            navigate("/admin/dataservicemanagement/viewserviceset/" + e.cell.row.original.id)
                        }
                    >
                        {e.value}
                    </button>
                ),
                sortKey: "Active"
            },
            { Header: "Service Title", accessor: "name", sortKey: "Inactive" },
            { Header: "Type of Service", accessor: "serviceSetTypeName" },
            { Header: "Transport Mode", accessor: "transportModeName" },
            { Header: "Ancilliary Service", accessor: "ancillaryServiceName" },
            {
                Header: "Service Provider", id: "serviceProviders", sortKey: "Inactive", accessor: data => {
                    let output = [];
                    if (Array.isArray(data?.serviceProviders)) {
                        data?.serviceProviders.map((item) => {
                            output.push(item.name);
                        })
                    }
                    return output.join(', ');
                },
            },
            {
                Header: "Service Published",
                id: "datePublished",
                sortKey: "Inactive",
                accessor: "datePublished"
            },
            {
                Header: "Action",
                id: "action",
                Cell: (data) => {
                    return (
                        <div className='d-flex'>
                            <button className="table-button" disabled={role.includes('ROLE_DATA_PROVIDER')} onClick={() => handleEdit(data.cell.row.original)}>
                                <img src={EditIcon} alt="edit icon" title="Edit" />
                            </button>
                            <button className="table-button" disabled={role.includes('ROLE_DATA_PROVIDER')} onClick={() => handleDelete(data.cell.row.original)}>
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
        window.scrollTo({ top: listcontent.current.offsetTop, behaviour: "smooth" })
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
            "&typeOfService=" + filterValue1 + // filter params
            "&transportModeId=" + filterValue2 +
            "&chargingModelId=" + filterValue3;
        const getData = async () => {
            return await getServiceLists(params);
        };
        getData().then((items) => {
            setData(items?.content);
            setTotalPages(items?.totalPages);
            setApiErrors("");
            setLoader(false);
        }).catch((error) => {
            setLoader(false);
            if (error?.response?.data?.message) {
                setApiErrors(error.response.data.message)
            } else {
                setApiErrors(error?.message)
            }
        });
    };

    const hideConfirmModal = () => {
        setShowConfirmModal(false);
    }

    const deleteService = () => {
        const serviceID = {
            'id': currentServiceID,
        };
        const deleteService = async () => {
            return deleteAPI('serviceset', serviceID);
        };

        deleteService().then((response) => {
            setLoader(false);
            setShowConfirmModal(false);
            setCurrentServiceID('');
            fetchData();

        }).catch((error) => {
            setLoader(false);
        });

    }

    const handleEdit = (data) => {
        navigate("/admin/dataservicemanagement/editservice/" + data.id)
    };

    const handleDelete = (data) => {
        setCurrentServiceID(data.id);
        setShowConfirmModal(true);
    };

    const getTransportModeOptions = (value) => {
        const getTransportMode = async () => {
            return await getTransportModeAPI(value);
        };
        getTransportMode().then((items) => {
            const dataprovideroptions = items.map(({ name, id }) => ({
                label: name,
                value: id
            }));
            setTransportModeDrop(dataprovideroptions);
            setFilterValue2('');
        }).catch((error) => {
            // setLoader(false);
        });
    }

    const handleTypeOfServiceChange = (value) => {
        setFilterValue1(value);
        getTransportModeOptions(value);
    }

    const getChargingModelOptions = (value) => {
        const getChargingModel = async () => {
            return await getChargingModelByServiceModeAPI(filterValue1, value);
        };
        getChargingModel().then((items) => {
            const chargingmodeloptions = items.map(({ name, id }) => ({
                label: name,
                value: id
            }));
            setServiceChargingModelDrop(chargingmodeloptions);
            setFilterValue3('');
        }).catch((error) => {
            // setLoader(false);
        });
    }

    const hanldeTransportModeChange = (value) => {
        setFilterValue2(value);
        getChargingModelOptions(value);
    }

    return (
        <div ref={listcontent} className="service_listing">
            {apiErrors && (
                <Alert variant="danger" className="text-center">{apiErrors}</Alert>
            )}
            {showConfirmModal && (
                <ConfirmModal
                    action="delete"
                    category="service"
                    onYesClick={deleteService}
                    onNoClick={hideConfirmModal}
                    confirmModal={setShowConfirmModal}
                />
            )}
            <Row className='mb-4'>
                <Col md={6}> <TableSearch placeholder="Enter Service Name" setSearchValue={setSearchValue} /></Col>
                <Col md={6} className="text-end">
                    <ButtonComponent type='primaryWhite'
                        className="button-icon"
                        disabled={role.includes('ROLE_DATA_PROVIDER')}
                        onClick={() => navigate('/admin/dataservicemanagement/createnewservice')}>
                        <img src={AddIcon} alt="add" />Add New Service</ButtonComponent>
                </Col>
            </Row>
            <div className="filter__container">
                <Row>
                    <Col md={2}>
                        <SelectComponent
                            className="select-secondary"
                            label="Type of Service"
                            options={serviceTypeMaster}
                            onSelectChange={(value) => handleTypeOfServiceChange(value)}
                        />
                    </Col>
                    <Col md={2}>
                        <SelectComponent
                            className="select-secondary"
                            label="Transport Mode"
                            options={transportModeDrop}
                            onSelectChange={(value) => hanldeTransportModeChange(value)}
                        />
                    </Col>
                    <Col md={2}>
                        <SelectComponent
                            className="select-secondary"
                            label="Charging Model"
                            options={serviceChargingModelDrop}
                            onSelectChange={(value) => setFilterValue3(value)}
                        />
                    </Col>
                </Row>
            </div>
            {(data && !loader) ? <ReactTableComponent
                columns={columns}
                data={data.length > 0 ? data : []}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setSortingId={setSortingId}
                setSortingOrder={setSortingOrder}
            /> : <ShimmerTable row={6} col={8} />}
            <p className="is-invalid-border-only mt-2">{apiErrors}</p>
        </div>
    )
}

export default ServiceListingManagement
