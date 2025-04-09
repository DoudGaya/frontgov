import {connect} from "react-redux"
import {List} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader} from "reactstrap";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";

function Inventory({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [inventoryList, setInventoryList] = useState([]);
    const [transactionList, setTransactionList] = useState([]);
    const [itemTransaction, setItemTransaction] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const header = ["S/N", "Item Name", "Category", "Manufacturer", "Vendor", "Qty", "Transaction"];

    const getData = async () => {
        await axios.get(`${serverLink}inventory/inventory`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setInventoryList(data.inventory)
                    setTransactionList(data.transaction)
                    showTable(data.inventory)
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
                        <td>{item.manufacturer_name}</td>
                        <td>{item.vendor_name}</td>
                        <td>{item.quantity}</td>
                        <td>
                            <a href="#" className={"btn btn-primary btn-sm mb-1"} style={{ marginRight: 2 }}
                               onClick={() => {
                                   setItemTransaction(transactionList.filter(r=>r.item_id === item.item_id))
                                   toggleModal();
                               }}>
                                <i className='fa fa-list' />
                            </a>
                        </td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'inventory_inventory').length < 1) {
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
                                    title='Inventory' data={[{title: 'Inventory'}, {title: 'Inventory'}]}
                                />
                            </div>
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardHeader>
                                    <div className="card-toolbar col-md-12 col-12 p-0">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className="col-md-4">
                                                <h4><List/> Inventory</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <DataTable
                                            tableID="Inventory"
                                            header={header}
                                            body={showTable(inventoryList)}
                                            title="Inventory"
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Item Transactions"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <DataTable
                                    tableID="InventoryTransaction"
                                    header={["S/N","Type","Agency","Staff","Qty","Date"]}
                                    body={
                                        itemTransaction.length > 0 && itemTransaction.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index+1}</td>
                                                    <td>{item.transaction_type}</td>
                                                    <td>{item.agency_name}</td>
                                                    <td>{item.staff_name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatDateAndTime(item.created_date, 'date')}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    title="Inventory Transactions"
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

export default connect(mapStateToProps, null)(Inventory)