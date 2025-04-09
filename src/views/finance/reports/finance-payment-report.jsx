import {connect} from "react-redux"
import {List} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";

function FinancePaymentReport ({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [paymentList, setPaymentList] = useState([]);

    const header = ["S/N", "Jnl ID", "Req ID", "Amount", "Payment Date", "Method", "Account Name", "Account Number", "Bank", "Created By", "Created Date"];

    const getData = async () => {
        await axios.get(`${serverLink}finance/report/payment-report`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setPaymentList(data.data)
                    showTable(data.data)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (dataset) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.journal_id}</td>
                        <td>{item.request_id}</td>
                        <td>{currencyConverter(item.amount)}</td>
                        <td>{formatDateAndTime(item.payment_date, 'date')}</td>
                        <td>{item.payment_method}</td>
                        <td>{ item.account_name }</td>
                        <td>{ item.account_number }</td>
                        <td>{ item.bank }</td>
                        <td>{ item.created_by_name }</td>
                        <td>{ formatDateAndTime(item.created_date, 'short_date') }</td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };


    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'finance_payment_report').length < 1) {
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
                                    title='Finance Payment Report' data={[{title: 'Finance'}, {title: 'Report'}]}
                                />
                            </div>
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardHeader>
                                    <div className="card-toolbar col-md-12 col-12 p-0">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className="col-md-4">
                                                <h4><List/> Finance Payment Report</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2'>
                                        <DataTable
                                            tableID="FinancePaymentReport"
                                            header={header}
                                            body={showTable(paymentList)}
                                            title="Finance Payment Report"
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

export default connect(mapStateToProps, null)(FinancePaymentReport)