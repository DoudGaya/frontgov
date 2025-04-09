import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {currencyConverter, serverLink, sumObjectArray} from "@src/resources/constants";
import {toast} from "react-toastify";
import axios from "axios";
import ReportDatatable from "@src/component/common/ReportDatatable/ReportDatatable";

function IncomeStatementReport({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(false);
    const ReportColumns = [
        { "field": "id", "headerName": "S/N", "width": 50 },
        { "field": "account_type", "headerName": "Account Type", "width": 150 },
        { "field": "account_name", "headerName": "Account Name", "width": 500 },
        { "field": "total_credit", "headerName": "Total Credit", "width":200 },
        { "field": "total_debit", "headerName": "Total Debit", "width": 200 },
        { "field": "balance", "headerName": "Balance", "width": 200 }
    ];
    const [datatable, setDatatable] = useState({
        columns: ReportColumns,
        rows: [],
    });
    const [transactionList, setTransactionList] = useState([])
    const [accountList, setAccountList] = useState([])
    const [reportData, setReportData] = useState({start_date:'', end_date:''})

    const getData = async () => {
        await axios.get(`${serverLink}finance/report/balance-sheet`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    setTransactionList(result.data.data)
                    setAccountList(result.data.account)
                }
                setIsLoading(false);
            })
            .catch((err) => {
                toast.error("NETWORK ERROR")
            });
    }

    const handleChange = (e) => {
        const report_data = {
            ...reportData,
            [e.target.id]: e.target.value
        };
        setReportData(report_data)
        if (report_data.start_date !== '' && report_data.end_date !== '')
        {
            let transaction_list = transactionList.filter(item => { return (new Date(item.transaction_date).getTime() >= new Date(report_data.start_date).getTime() && new Date(item.transaction_date).getTime() <= new Date(report_data.end_date).getTime()) });
            if (accountList.length > 0)
            {
                let rows = [];
                let total_debit = 0;
                let total_credit = 0;
                let total_balance = 0;
                accountList.map((r, i) =>
                {
                    const debit_transaction = transaction_list.filter(e => e.debit_account_id === r.account_id);
                    const credit_transaction = transaction_list.filter(e => e.credit_account_id === r.account_id);
                    const debit_total = debit_transaction.length > 0 ? sumObjectArray(debit_transaction, 'amount') : 0;
                    const credit_total = credit_transaction.length > 0 ? sumObjectArray(credit_transaction, 'amount') : 0;
                    const balance = credit_total - debit_total;
                    rows.push({
                        "id": (i+1),
                        "account_type": r.account_type,
                        "account_name": r.account_name,
                        "total_credit": currencyConverter(credit_total),
                        "total_debit": currencyConverter(debit_total),
                        "balance": currencyConverter(balance)
                    })

                    total_debit += debit_total;
                    total_credit += credit_total;
                    total_balance += balance;
                })
                rows.push({
                    "id": '--',
                    "account_type": '--',
                    "account_name": '--',
                    "total_credit": currencyConverter(total_credit),
                    "total_debit": currencyConverter(total_debit),
                    "balance": currencyConverter(total_balance)
                })
                setDatatable({...datatable, columns: datatable.columns, rows: rows})
            } else
            {
                toast.error("No transaction record within the selected date range");
                setDatatable({...datatable, columns: datatable.columns, rows: []})
            }
        }
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'finance_report_income_statement').length < 1) {
            navigate('/')
        }
        getData().then((r) => {});
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
                                    title='Income Statement Report' data={[{title: 'Finance'}, {title: 'Report'}, {title: 'Income Statement'}]}
                                />
                            </div>
                        </div>
                        <div className='blog-wrapper'>

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
                                        <div className="row col-md-12" style={{width: '100%'}}>
                                            <ReportDatatable datatable={datatable}/>
                                        </div>
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

export default connect(mapStateToProps, null)(IncomeStatementReport)