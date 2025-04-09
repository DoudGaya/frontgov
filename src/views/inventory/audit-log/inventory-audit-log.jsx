import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody} from "reactstrap";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";

function InventoryAuditLog({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState([]);

    const header = ["S/N", "#ID", "Item Name", "Category", "Agency", "Qty", "Action", "Status", "Requested By", "Requested On", "Action By", "Action Date"];

    const getData = async () => {
        await axios.get(`${serverLink}inventory/audit-log`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setAuditLogs(data.audit_logs)
                    showTable(data.audit_logs)
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
                        <td>{`${item.request_id}`}</td>
                        <td>{item.item_name}</td>
                        <td>{item.category_name}</td>
                        <td>{item.agency_name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.action}</td>
                        <td>{item.status}</td>
                        <td>{item.request_by}</td>
                        <td>{formatDateAndTime(item.requested_date, 'date')}</td>
                        <td>{item.action_by}</td>
                        <td>{formatDateAndTime(item.created_date, 'date')}</td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'inventory_audit').length < 1) {
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
                                    title='Inventory Audit Logs' data={[{title: 'Inventory'}, {title: 'Inventory Audit Logs'}]}
                                />
                            </div>

                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <DataTable
                                            tableID="InventoryAuditLog"
                                            header={header}
                                            body={showTable(auditLogs)}
                                            title="Inventory Audit Logs"
                                        />
                                    </div>
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

export default connect(mapStateToProps, null)(InventoryAuditLog)