import {connect} from "react-redux"
import {List, Plus} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {
    formatDateAndTime,
    generate_token,
    moneyFormat,
    serverLink
} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";
import InventoryOrderForm from "@src/views/inventory/order/inventory-order-form";
import InventoryReceiveOrderForm from "@src/views/inventory/order/inventory-receive-order-form";
import InventoryOrderPrintForm from "@src/views/inventory/order/inventory-order-print";

function InventoryOrder({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [orderItemList, setOrderItemList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)
    const [showReceiveModal, setShowReceiveModal] = useState(false)
    const toggleReceiveModal = () => setShowReceiveModal(!showReceiveModal)
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedOrderItem, setSelectedOrderItem] = useState([]);

    const [showPrintModal, setShowPrintModal] = useState(false)
    const togglePrintModal = () => setShowPrintModal(!showPrintModal)

    const header = ["S/N", "Ref Code", "Order Date", "Items", "Created By", "Created On", "Updated By", "Updated On", "Action"];

    const initialValue = {
        order_id: "", order_date: "", ref_code: generate_token(10), total: 0, created_by: loginData[0]?.user_id
    }
    const [formData, setFormData] = useState(initialValue);
    const [orderItem, setOrderItem] = useState([]);

    const resetForm = () => {
        setFormData(initialValue)
        setOrderItem([]);
    }

    const getData = async () => {
        await axios.get(`${serverLink}inventory/order/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setItemList(data.items)
                    setOrderList(data.orders)
                    setOrderItemList(data.order_items)
                    showTable(data.items, data.orders, data.order_items)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (orders, order_items ) => {
        try {
            return orders.length > 0 && orders.map((order, index) => {
                const items = order_items.filter(r=>r.order_id === order.order_id)
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{order.ref_code}</td>
                        <td>{formatDateAndTime(order.order_date, 'short_date')}</td>
                        <td>
                            <table className={'table table-striped table-bordered'}>
                                <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Price</th>
                                    <th>Qty Ordered</th>
                                    <th>Qty Received</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    items.length > 0 && items.map((i, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{i.item_name}</td>
                                                <td>{moneyFormat(i.unit_price)}</td>
                                                <td>{i.quantity_ordered}</td>
                                                <td>{i.quantity_received}</td>
                                                <td>{moneyFormat(i.total)}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                                <tfoot>
                                <tr>
                                    <th>Status</th>
                                    <th>{order.order_status}</th>
                                    <th></th>
                                    <th>Total</th>
                                    <th>{moneyFormat(order.total)}</th>
                                </tr>
                                </tfoot>
                            </table>
                        </td>
                        <td>{order.created_by_name}</td>
                        <td>{formatDateAndTime(order.created_date, 'short_date')}</td>
                        <td>{order.updated_by_name}</td>
                        <td>{formatDateAndTime(order.updated_date, 'short_date')}</td>
                        <td>
                            {
                                order.order_status === 'pending' &&
                                <div>
                                    <a href="#" title={'Cancel Request'} className={"btn btn-danger btn-sm  mb-1"}
                                       style={{marginRight: 3}}
                                       onClick={() => showConfirm("Warning", `Are you sure you want to cancel this request?`, "warning")
                                           .then(async (confirm) => {
                                               if (confirm) {
                                                   await handleCancellation(order.order_id)
                                               }
                                           })}>
                                        <i className='fa fa-x'/>
                                    </a>
                                    <a href="#" title={'Receive Order'} className={"btn btn-info btn-sm  mb-1"}
                                       onClick={() => {
                                           setSelectedOrder({
                                               ...order
                                           })
                                           setSelectedOrderItem(items)
                                           toggleReceiveModal()
                                       }}>
                                        <i className='fa fa-eye'/>
                                    </a>
                                </div>
                            }
                            <a href="#" title={'Print Order'} className={"btn btn-warning btn-sm  mb-1"}
                               onClick={() => {
                                   setSelectedOrder(order)
                                   setSelectedOrderItem(items)
                                   togglePrintModal()
                               }}>
                                <i className='fa fa-print'/>
                            </a>

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
        if (formData.order_date === "") {
            showAlert("EMPTY FIELD", "Please select the order date", "error");
            return false;
        }
        if (orderItem.length === 0) {
            showAlert("EMPTY FIELD", "Please select at least one item", "error");
            return false;
        }

        const sendData = {
            ...formData,
            items: orderItem
        }
        setIsFormLoading(true);
        toast.info("please wait...");
        await axios
            .post(`${serverLink}inventory/order/add`, sendData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Order Added Successfully");
                    setIsFormLoading(false);
                    getData();
                    resetForm();
                    toggleModal();
                } else if (result.data.message === 'exist') {
                    setIsFormLoading(false);
                    showAlert("ERROR", "Order Already Exist", "error");
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

    const onSubmitReceive = async () => {
        if (selectedOrderItem.length === 0) {
            toggleReceiveModal();
            return false;
        } else {
            let error_check = false;
            selectedOrderItem.map(r=> {
                if (r.quantity_received > r.quantity_ordered) {
                    toast.error(`${r.item_name}: Quantity received can't be greater than quantity ordered`)
                    error_check = true;
                    return false;
                }
            })

            if (!error_check) {
                const sendData = {
                    updated_by: initialValue.created_by,
                    status: 'completed',
                    items: selectedOrderItem
                }
                setIsFormLoading(true);
                toast.info("please wait...");
                await axios
                    .post(`${serverLink}inventory/order/receive`, sendData, token)
                    .then((result) => {
                        if (result.data.message === "success") {
                            toast.success("Order Received Successfully");
                            setIsFormLoading(false);
                            getData();
                            toggleReceiveModal();
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
        }

    }

    const handleCancellation = async (id) => {
        toast.info("please wait...");
        const sendData = {
            order_id: id,
            updated_by: initialValue.created_by
        }
        await axios.patch(`${serverLink}inventory/order/cancel`, sendData, token).then((res) => {
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
        if (login.permission.filter(e=>e.permission === 'inventory_order').length < 1) {
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
                                    title='Inventory Order' data={[{title: 'Inventory'}, {title: 'Inventory Order'}]}
                                />
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                <div className="breadcrumb-right dropdown">
                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        resetForm();
                                        setShowModal(true)
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
                                                <h4><List/> Inventory Orders</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2'>
                                        <DataTable
                                            tableID="InventorOrder"
                                            header={header}
                                            body={showTable(orderList, orderItemList)}
                                            title="Inventory Order"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Inventory Order Form"} size={'modal-xl'} open={showModal} toggleSidebar={toggleModal}>
                                <InventoryOrderForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    orderItem={orderItem}
                                    setOrderItem={setOrderItem}
                                    itemList={itemList}
                                    isFormLoading={isFormLoading}
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleModal={toggleModal}
                                />
                            </MiddleModal>

                            <MiddleModal id="modal2" title={"Inventory Receive Order Form"} size={'modal-xl'} open={showReceiveModal} toggleSidebar={toggleReceiveModal}>
                                <InventoryReceiveOrderForm
                                    order={selectedOrder}
                                    orderItem={selectedOrderItem}
                                    setOrderItem={setSelectedOrderItem}
                                    isFormLoading={isFormLoading}
                                    onSubmit={onSubmitReceive}
                                    toggleModal={toggleReceiveModal}
                                />
                            </MiddleModal>

                            <MiddleModal id="modal3" title={"Print Order"} size={'modal-xl'} open={showPrintModal} toggleSidebar={togglePrintModal}>
                                <InventoryOrderPrintForm
                                    order={selectedOrder}
                                    orderItem={selectedOrderItem}
                                />
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

export default connect(mapStateToProps, null)(InventoryOrder)