import {connect} from "react-redux"
import {List, Plus} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, formatDate, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import FinanceAccountForm from "@src/views/finance/finance-account/finance-account-form";
import DataTable from "@src/component/common/Datatable/datatable";

function InventoryTransaction({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [transactionList, setTransactionList] = useState([]);

    const header = ["S/N", "Item Name", "Category", "Manufacturer", "Vendor", "Agency", "Qty", "Type", "Handled By", "Date"];

    const getData = async () => {
        await axios.get(`${serverLink}inventory/transaction`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setTransactionList(data.transactions)
                    showTable(data.transactions)
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
                        <td>{item.agency}</td>
                        <td>{item.quantity}</td>
                        <td>{item.transaction_type}</td>
                        <td>{item.staff_name}</td>
                        <td>{formatDateAndTime(item.created_date, 'short_date')}</td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'inventory_transaction').length < 1) {
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
                                    title='Inventory Transactions' data={[{title: 'Inventory'}, {title: 'Inventory Transactions'}]}
                                />
                            </div>
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardHeader>
                                    <div className="card-toolbar col-md-12 col-12 p-0">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className="col-md-4">
                                                <h4><List/> Inventory Transactions</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2'>
                                        <DataTable
                                            tableID="InventoryTransactions"
                                            header={header}
                                            body={showTable(transactionList)}
                                            title="Inventory Transactions"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

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

export default connect(mapStateToProps, null)(InventoryTransaction)