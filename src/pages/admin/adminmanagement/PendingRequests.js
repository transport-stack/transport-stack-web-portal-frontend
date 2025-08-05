import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import {
    getPendingRequestAPI,
} from "../../../services/apiservices";
import ReactTableComponent from "../../../components/common/ui/table/ReactTableComponent";
import "../../../assets/styles/formcomponent.scss";

const PendingRequests = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const listcontent = useRef(null);
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [apiErrors, setApiErrors] = useState("");
    const [loader, setLoader] = useState();
    const [sortingId, setSortingId] = useState("email");
    const [sortingOrder, setSortingOrder] = useState("desc");
    const columns = React.useMemo(
        () => [
            {
                Header: "Request No",
                accessor: "requestId",
                Cell: (e) => (
                    <button
                        className="has-link"
                        onClick={() =>
                            navigate("/admin/adminmanagement/viewpendingrequest/" + e.cell.row.original.userId + '/' + e.value + '/' + e.cell.row.original.entityName)
                        }
                    >
                        {e.value}
                    </button>
                ),
                sortKey: "InActive",
            },
            { Header: "Admin Id", accessor: "userSequenceId" },
            {
                Header: "Name",
                accessor: (data) => {
                    return data?.firstName + " " + (data?.lastName !== null ? data?.lastName : '');
                },
            },

            { Header: "Email Id", accessor: "email" },
            { Header: "Request Date", accessor: "creationDate", sortKey: "Active" },
            { Header: "Last Updated on", accessor: "lastModifiedDate", sortKey: "Active" },
            { Header: "Status", accessor: "displayStatus", sortKey: "Active" },
            { Header: "Request type", accessor: "displayRequestType", sortKey: "Active" },
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
    }, [currentPage, sortingId, sortingOrder]);

    const fetchData = () => {
        setLoader(true);
        let params =
            "page=" +
            (currentPage - 1) +
            "&size=10&sortField=" +
            sortingId +
            "&sortDirection=" +
            sortingOrder;

        const getData = async () => {
            return await getPendingRequestAPI(params, id);
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

    return (
        <div className="pending-requests">
            <h2 className="form-title mb-4">Pending Requests</h2>
            {apiErrors && (
                <Alert variant="danger" className="text-center">
                    {apiErrors}
                </Alert>
            )}
            <div ref={listcontent}>
                {data && !loader ? (
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
            </div>
        </div>
    );
};

export default PendingRequests;
