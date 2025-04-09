import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {currencyConverter, formatDateAndTime, serverLink, sumObjectArray} from "@src/resources/constants";
import {toast} from "react-toastify";
import axios from "axios";
import ReportDatatable from "@src/component/common/ReportDatatable/ReportDatatable";

function GeneralLedgerReport({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(false);
    const ReportColumns = [
        { "field": "id", "headerName": "S/N", "width": 50 },
        { "field": "transaction_date", "headerName": "Trans Date", "width": 100 },
        { "field": "description", "headerName": "Description", "width": 250 },
        { "field": "debit_account", "headerName": "Debit Account", "width":250 },
        { "field": "credit_account", "headerName": "Credit Account", "width": 250 },
        { "field": "debit", "headerName": "Debit", "width": 150 },
        { "field": "credit", "headerName": "Credit", "width": 150 },
        { "field": "inserted_date", "headerName": "Added Date", "width": 150 }
    ];
    const [datatable, setDatatable] = useState({
        columns: ReportColumns,
        rows: [],
    });
    const [transactionList, setTransactionList] = useState([])
    const [accountList, setAccountList] = useState([])
    const [reportData, setReportData] = useState({start_date:'', end_date:''})
    const getAccountName = (account_list, account_id) => {
        const list = account_list.filter(r=>r.account_id === account_id);
        return list.length > 0 ? list[0].account_name : 'No Account'
    }

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
        if (report_data.start_date !== '' && report_data.end_date !== '') {
            let transaction_list = transactionList.filter(item => {return (new Date(item.transaction_date).getTime() >= new Date(report_data.start_date).getTime() && new Date(item.transaction_date).getTime() <= new Date(report_data.end_date).getTime())});

            if (transaction_list.length > 0) {
                let rows = [];
                transaction_list.map((item, index) => {
                    rows.push({
                        "id": (index+1),
                        "transaction_date": formatDateAndTime(item.transaction_date, 'short_date'),
                        "description": item.description,
                        "debit_account": getAccountName(accountList, item.debit_account_id),
                        "credit_account": getAccountName(accountList, item.credit_account_id),
                        "debit": currencyConverter(item.debit),
                        "credit": currencyConverter(item.credit),
                        "inserted_date": formatDateAndTime(item.modified_date, 'short_date')
                    })
                });
                rows.push({
                    "id": '--',
                    "transaction_date": '--',
                    "description": '--',
                    "debit_account": '--',
                    "credit_account": '--',
                    "debit": currencyConverter(sumObjectArray(transaction_list, 'debit')),
                    "credit": currencyConverter(sumObjectArray(transaction_list, 'credit')),
                    "inserted_by": '--',
                    "inserted_date": '--'
                })
                setDatatable({...datatable, columns: datatable.columns, rows: rows})


            } else {
                toast.error("No transaction record within the selected date range");
                setDatatable({...datatable, columns: datatable.columns, rows: []})
            }
        }
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'finance_report_general_ledger').length < 1) {
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
                                    title='General Ledger Report' data={[{title: 'Finance'}, {title: 'Report'}, {title: 'General Ledger'}]}
                                />
                            </div>
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <div className="row col-md-12">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="start_date">Ledger Start Date</label>
                                                <input type="date" id="start_date" className="form-control"
                                                       value={reportData.start_date} onChange={handleChange}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="end_date">Ledger End Date</label>
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

export default connect(mapStateToProps, null)(GeneralLedgerReport)