import {connect} from "react-redux"
import {List, Plus} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";
import MyInventoryRequestForm from "@src/views/inventory/my-request/my-request-form";

function MyInventoryRequest({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false)
    const [myRequestList, setMyRequestList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const [logList, setLogList] = useState([]);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)
    const [showLogModal, setShowLogModal] = useState(false)
    const toggleLogModal = () => setShowLogModal(!showLogModal)

    const header = ["S/N", "Item Name", "Category", "Description", "Qty", "Status", "Requested Date", "Action"];

    const initialValue = {
        item_id: "", category_id: "", agency_id: login.agency_id, user_id: loginData[0]?.user_id,
        quantity: "", description: ""
    }
    const [formData, setFormData] = useState(initialValue);

    const resetForm = () => {
        setFormData(initialValue)
    }

    const getData = async () => {
        const sendData = {
            user_id: initialValue.user_id,
        }
        await axios.post(`${serverLink}inventory/request/my-request`, sendData, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setMyRequestList(data.request)
                    setInventoryList(data.inventory)
                    setLogList(data.logs)
                    showTable(data.request)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (items) => {
        try {
            return items.length > 0 && items.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{index +1}</td>
                        <td>{item.item_name}</td>
                        <td>{item.category_name}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{item.status}</td>
                        <td>{formatDateAndTime(item.requested_date, 'date')}</td>
                        <td>
                            {
                                item.status === 'pending' ?
                                    <a href="#" className={"btn btn-danger btn-sm  mb-1"}
                                       onClick={() => showConfirm("Warning", `Are you sure you want to cancel your request of this item?`, "warning")
                                           .then(async (confirm) => {
                                               if (confirm) {
                                                   await handleCancel(item.request_id, item.quantity)
                                               }
                                           })}>
                                        <i className='fa fa-x'/>
                                    </a> :
                                    <a href="#" className={"btn btn-info btn-sm  mb-1"}
                                       onClick={() => {
                                           setSelectedLogs(logList.filter(r=>r.request_id === item.request_id))
                                           toggleLogModal();
                                       }}>
                                        <i className='fa fa-eye'/>
                                    </a>
                            }

                        </td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const onSubmit = async () => {
        if (formData.item_id.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please enter item name", "error");
            return false;
        }
        if (formData.quantity === "") {
            showAlert("EMPTY FIELD", "Please select quantity", "error");
            return false;
        }
        const quantity_available = inventoryList.filter(r=>r.item_id === parseInt(formData.item_id))[0].quantity;
        if (parseInt(formData.quantity) > quantity_available) {
            showAlert("EMPTY FIELD", "Quantity requested has exceeded the quantity available", "error");
            return false;
        }

        setIsFormLoading(true);
        toast.info("please wait...");
        await axios
            .post(`${serverLink}inventory/request/add`, formData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Item Requested Successfully");
                    setIsFormLoading(false);
                    getData();
                    resetForm();
                    toggleModal();
                } else if (result.data.message === 'exist') {
                    setIsFormLoading(false);
                    showAlert("ERROR", "You've already requested this item", "error");
                } else {
                    setIsFormLoading(false);
                    showAlert("ERROR", "Something went wrong. Please try again!", "error");
                }
            })
            .catch((error) => {
                setIsFormLoading(false);
                showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
            });
    }

    const handleCancel = async (id, quantity) => {
        toast.info("please wait...");
        const sendData = {
            request_id: id,
            user_id: initialValue.user_id,
            quantity: quantity
        }
        await axios.patch(`${serverLink}inventory/request/cancel`, sendData, token).then((res) => {
            if (res.data.message === "success") {
                toast.success("Cancelled Successfully");
                getData();
            } else {
                toast.error("NETWORK ERROR. Please try again!");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("NETWORK ERROR. Please try again!");
        });
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'inventory_my_request').length < 1) {
            navigate('/')
        }
        getData();
    }, []);

    return (
        <Fragment>
            {
                isLoading ? <SpinnerLoader/>
                    :
                    <>
                        <div className="row">
                            <div className="col-md-9 col-10">
                                <Breadcrumbs
                                    title='My Inventory Request ' data={[{title: 'Inventory'}, {title: 'My Inventory Request'}]}
                                />
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                <div className="breadcrumb-right dropdown">
                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleModal();
                                        resetForm();
                                    }}>
                                        <Plus size={14}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardHeader>
                                    <div className="card-toolbar col-md-12 col-12 p-0">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className="col-md-4">
                                                <h4><List/> My Inventory Request </h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2'>
                                        <DataTable
                                            tableID="MyInventoryRequests"
                                            header={header}
                                            body={showTable(myRequestList)}
                                            title="My Inventory Requests"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Inventory Request Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <MyInventoryRequestForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    inventoryList={inventoryList}
                                    IsFormLoading={isFormLoading}
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleModal={toggleModal}
                                />
                            </MiddleModal>

                            <MiddleModal id="modal" title={"Request Tracker"} size={'modal-lg'} open={showLogModal} toggleSidebar={toggleLogModal}>
                                <div className={'table-responsive'}>
                                    <table className={'table table-striped'}>
                                        <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Activity</th>
                                            <th>Action By</th>
                                            <th>Action Date</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            selectedLogs.length > 0 && selectedLogs.map((log, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{log.action}</td>
                                                    <td>{log.staff_name}</td>
                                                    <td>{formatDateAndTime(log.created_date, 'date_and_time')}</td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </MiddleModal>
                        </div>
                    </>
            }
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(MyInventoryRequest)