
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ShimmerTable } from 'react-shimmer-effects';
import TableSearch from "../../../components/common/ui/table/TableSearch";
import ReactTableComponent from '../../../components/common/ui/table/ReactTableComponent';
import { getServicesetLists, getStatusFilterAPI } from '../../../services/apiservices';
import SelectComponent from '../../../components/common/ui/select/SelectComponent';

const ServiceRequestManagement = () => {
    const navigate = useNavigate()
    const listcontent = useRef(null);
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [apiErrors, setApiErrors] = useState("");
    const [loader, setLoader] = useState();
    const [sortingId, setSortingId] = useState("sequenceId");
    const [sortingOrder, setSortingOrder] = useState("desc");
    const [searchValue, setSearchValue] = useState('');
    const [filterValue1, setFilterValue1] = useState('');
    const [statusMaster, setStatusMaster] = useState([]);
    const columns = React.useMemo(
        () => [
            {
                Header: "Request No.",
                accessor: "sequenceId",
                Cell: (e) => (
                    <button className='has-link'
                        onClick={() =>
                            navigate("/admin/requestmanagement/viewservicesetrequest/" + e.cell.row.original.id)
                        }
                    >
                        {e.value}
                    </button>
                ),
                sortKey: "Inactive",
            },
            {
                Header: "User Name", accessor: "userName",
                Cell: (e) => (
                    <button className='has-link'
                        onClick={() =>
                            navigate("/admin/usermanagement/viewuser/" + e.cell.row.original.userId)
                        }
                    >
                        {e.value}
                    </button>
                ),
            },
            { Header: "Service ID", accessor: "serviceSetId" },
            { Header: "Service Title", accessor: "serviceSetName" },
            { Header: "Request Date", accessor: "requestDate", sortKey: "Inactive", },
            { Header: "Status", accessor: "status" },
            { Header: "Approved by", accessor: "approverEmail" },
        ],
        []
    );

    useEffect(() => {
        fetchData();
        window.scrollTo({ top: listcontent.current.offsetTop, behaviour: "smooth" })
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1)
        fetchData();
        window.scrollTo({ top: listcontent.current.offsetTop, behaviour: "smooth" })
    }, [sortingId, sortingOrder, searchValue, filterValue1]);

    useEffect(() => {
        fetchStatusMaster();
    }, []);

    const fetchData = () => {
        setLoader(true)
        let params =
            "page=" +
            (currentPage - 1) +
            "&size=10&sortBy=" +
            sortingId +
            "&sortDir=" +
            sortingOrder +
            "&keyword=" +
            searchValue +
            "&status=" +
            filterValue1;
        const getData = async () => {
            return await getServicesetLists(params);
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

    const fetchStatusMaster = () => {
        setLoader(true)
        const getStatus = async () => {
            return await getStatusFilterAPI();
        };
        getStatus().then((items) => {
            const status = items.map(({ name, value }) => ({
                label: value,
                value: name
            }));
            setStatusMaster(status);
            setLoader(false);
        }).catch((error) => {
            setLoader(false);
        });
    };

    return (
        <div ref={listcontent}>
            {apiErrors && (
                <Alert variant="danger" className="text-center">{apiErrors}</Alert>
            )}
            <Row className='mb-4' style={{ marginTop: '-16px' }}>
                <Col style={{ alignSelf: "end" }} md={6}> <TableSearch placeholder="Enter Request No. or User Name" setSearchValue={setSearchValue} /></Col>
                <Col md={{ span: 3, offset: 3 }}>
                    <SelectComponent
                        className="select-secondary"
                        label="Status"
                        options={statusMaster}
                        onSelectChange={(value) => setFilterValue1(value)}
                    />
                </Col>
            </Row>
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
export default ServiceRequestManagement;

