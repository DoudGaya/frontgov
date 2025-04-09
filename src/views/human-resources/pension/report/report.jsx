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

function PensionReport({loginData}) {
    const token = loginData[0]?.token;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [reportList, setReportList] = useState([]);

    const header = ["S/N", "Staff ID", "Staff Name", "Admin Name", "Employee Cont", "Employer Cont", "Total Cont", "Cont Date", "Created Date"];

    const getData = async () => {
        await axios.get(`${serverLink}hr/pension-admin/report`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
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

    const  showTable = (dataset) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{index +1}</td>
                        <td>{item.staff_id}</td>
                        <td>{item.employee_name}</td>
                        <td>{item.admin_name}</td>
                        <td>{currencyConverter(item.employee_contribution)}</td>
                        <td>{currencyConverter(item.employer_contribution)}</td>
                        <td>{currencyConverter(item.total_contribution)}</td>
                        <td>{formatDateAndTime(item.contribution_date, 'month_and_year')}</td>
                        <td>{formatDateAndTime(item.created_date, 'date')}</td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_pension_report').length < 1) {
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
                                <Breadcrumbs title='Pension Contribution Report' data={[{title: 'HR Pension'}, {title: 'Pension Report'}]}/>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
                            <div className="table-responsive">
                                <DataTable
                                    tableID="table1"
                                    header={header}
                                    body={showTable(reportList)}
                                    title="Pension Report"
                                />
                            </div>
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

const mapDispatchToProps = (dispatch) => {
    return {
        setOnGeneralDetails: (p) => {
            dispatch(setGeneralDetails(p))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PensionReport)