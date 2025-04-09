import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, serverLink, sumObjectArray} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import {setGeneralDetails} from '@store/actions';
import {useNavigate} from "react-router-dom";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import DataTable from "@src/component/common/Datatable/datatable";
import {Card, CardBody, Col, Row} from "reactstrap";
import {toast} from "react-toastify";

function BankPaymentReport({loginData}) {
    const token = loginData[0]?.token;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const header = ["S/N", "Employee ID", "Employee Name", "Agency", "Salary Amount", "Account Name", "Account Number", "Bank Name"];
    const [reportBody, setReportBody] = useState([])
    const [reportData, setReportData] = useState({salary_month:''})
    const [total, setTotal] = useState(0)

    const getData = async (salary_date) => {
        toast.info('Loading...')
        setIsLoading(true)
        const sendData = {
            salary_date: salary_date
        }
        await axios.post(`${serverLink}hr/bank-payment/report`, sendData, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setReportBody(data.data)
                    showTable(data.data)
                    if(data.data.length > 0) {
                        setTotal(sumObjectArray(data.data, 'total'))
                    } else {
                        showAlert("NO RECORD", "NO RECORD FOR THE SELECTED DATE", "error");
                    }
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const handleChange = (e) => {
        const value = e.target.value;
        const report_data = {
            ...reportData,
            [e.target.id]: value
        };
        setReportData(report_data)
        getData(value)
    }

    const  showTable = (dataset) => {
        return dataset.length > 0 && dataset.map((item, index) => {
            return <tr key={index}>
                <td>{index +1}</td>
                <td>{item.staff_id}</td>
                <td>{item.employee_name}</td>
                <td>{item.agency_name}</td>
                <td>{currencyConverter(item.total)}</td>
                <td>{item.bank_account_name}</td>
                <td>{item.bank_account_no}</td>
                <td>{item.bank_name}</td>
            </tr>
        });
    };

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_payroll_bank_payment').length < 1) {
            navigate('/')
        }
    }, []);

    return (
        <Fragment>
            {
                isLoading ? <SpinnerLoader/>
                    :
                    <>
                        <div className="row">
                            <div className="col-md-9 col-8">
                                <Breadcrumbs title='Allowance Report' data={[{title: 'HR Payroll'}, {title: 'Allowance Report'}]}/>
                            </div>
                        </div>
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <div className="table-responsive">
                                            <div className="row col-md-12">
                                                <div className="col-md-12 mb-3">
                                                    <label htmlFor="salary_month">Select Salary Month</label>
                                                    <input type="month" id="salary_month" className="form-control"
                                                           value={reportData.salary_month} onChange={handleChange}/>
                                                </div>
                                            </div>

                                            {
                                                reportBody.length > 0 &&
                                                <div>
                                                    <h3>TOTAL: {currencyConverter(total)}</h3>
                                                    <DataTable
                                                        tableID="table1"
                                                        header={header}
                                                        body={showTable(reportBody)}
                                                        title="Bank Payment Report"
                                                    />
                                                </div>
                                            }


                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
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

const mapDispatchToProps = (dispatch) => {
    return {
        setOnGeneralDetails: (p) => {
            dispatch(setGeneralDetails(p))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BankPaymentReport)