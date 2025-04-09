import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import {setGeneralDetails} from '@store/actions';
import {useNavigate} from "react-router-dom";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import DataTable from "@src/component/common/Datatable/datatable";
import {Card, CardBody, Col, Row} from "reactstrap";

function AllowanceReport({loginData}) {
    const token = loginData[0]?.token;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [reportList, setReportList] = useState([]);
    const [filterReportList, setFilterReportList] = useState([]);

    const header = ["S/N", "Employee ID", "Employee Name", "Ledger Account", "Post Type", "Amount", "Salary Date", "Posted Date"];
    const [reportData, setReportData] = useState({start_date:'', end_date:''})

    const getData = async () => {
        await axios.get(`${serverLink}hr/salary/allowance/report`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setFilterReportList(data.data)
                    setReportList(data.data)
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

    const handleChange = (e) => {
        const report_data = {
            ...reportData,
            [e.target.id]: e.target.value
        };
        setReportData(report_data)

        let result;
        if (report_data.start_date !== '' && report_data.end_date !== '') {
            result = reportList.filter(item => { return (new Date(item.full_salary_date).getTime() >= new Date(report_data.start_date).getTime() && new Date(item.full_salary_date).getTime() <= new Date(report_data.end_date).getTime()) });
        }
        else {
            result = reportList
        }

        setFilterReportList(result)
        showTable(result)
    }

    const  showTable = (dataset) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{index +1}</td>
                        <td>{item.staff_id}</td>
                        <td>{item.employee_name}</td>
                        <td>{item.ledger_name}</td>
                        <td>{item.post_type}</td>
                        <td>{currencyConverter(item.amount)}</td>
                        <td>{formatDateAndTime(item.full_salary_date, 'full_month_and_year')}</td>
                        <td>{formatDateAndTime(item.created_date, 'date')}</td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_payroll_allowance_report').length < 1) {
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
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="start_date">Start Date</label>
                                                    <input type="date" id="start_date" className="form-control"
                                                           value={reportData.start_date} onChange={handleChange}/>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="end_date">End Date</label>
                                                    <input type="date" id="end_date" className="form-control"
                                                           disabled={reportData.start_date === ''} min={reportData.start_date}
                                                           value={reportData.end_date} onChange={handleChange}/>
                                                </div>
                                            </div>

                                            <DataTable
                                                tableID="table1"
                                                header={header}
                                                body={showTable(filterReportList)}
                                                title="Allowance and Deduction Report"
                                            />
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

export default connect(mapStateToProps, mapDispatchToProps)(AllowanceReport)