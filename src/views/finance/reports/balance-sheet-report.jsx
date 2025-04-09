import {connect} from "react-redux"
import {Fragment, useEffect, useRef, useState} from "react";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {useDownloadExcel} from "react-export-table-to-excel";
import {currencyConverter, formatDateAndTime, serverLink} from "@src/resources/constants";
import {toast} from "react-toastify";
import axios from "axios";

function BalanceSheetReport({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const tableRef = useRef(null);
    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: `finance-balance-sheet-report`,
        sheet: 'BalanceSheet'
    })
    const [assetList, setAssetList] = useState([])
    const [liabilityList, setLiabilityList] = useState([])
    const [equityList, setEquityList] = useState([])
    const [dataTable, setDataTable] = useState([]);
    const [accountList, setAccountList] = useState([])
    const [yearList, setYearList] = useState([])
    const [transactionList, setTransactionList] = useState([]);
    const [reportType, setReportType] = useState({report_type:'', year_id:'', start_date:'', end_date:''});
    const [reportTitle, setReportTitle] = useState("");
    const current_year = formatDateAndTime(new Date(), 'year_only');
    const last_five_years = [current_year, current_year-1, current_year-2, current_year-3, current_year-4]

    const getData = async () => {
        await axios.get(`${serverLink}finance/report/balance-sheet`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    setAccountList(result.data.account)
                    setYearList(result.data.year)
                    setTransactionList(result.data.data)
                }
                setIsLoading(false);
            })
            .catch((err) => {
                toast.error("NETWORK ERROR")
            });
    }

    const handleChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        if (id === 'report_type') {
            setReportType({...reportType, report_type: value, year_id:'', start_date:'', end_date:''})
            if (value === 'years') {
                reportFormatter('years', parseInt(value), '', '')
            } else {
                setReportTitle("")
                setDataTable([])
            }
        }
        else {
            setReportType({...reportType, [id]: value});
            if (value !== '') {
                if (id === 'year_id') {
                    reportFormatter('year_id', parseInt(value), '', '')
                } else {
                    if (id === 'start_date')
                        reportFormatter('date', '', value, reportType.end_date)
                    else
                        reportFormatter('date', '', reportType.start_date, value)
                }
            } else {
                setDataTable([])
            }
        }
    }

    const getAccountYear = (year_list, year_id) => {
        const list = year_list.filter(r=>r.year_id === year_id);
        return list.length > 0 ? `${formatDateAndTime(list[0].start_date, 'date')} to ${formatDateAndTime(list[0].end_date, 'date')}` : 'No Date'
    }

    const reportFormatter = (type, year_id='', start_date='', end_date='') => {
        if (type === 'year_id') {
            setReportTitle(`Balance Sheet Report from ${getAccountYear(yearList, year_id)}`)
            let asset_list = [];
            let liability_list = [];
            let equity_list = [];
            if (accountList.length > 0 ) {
                accountList.map(r => {
                    if (r.account_type === 'Asset')
                        asset_list.push({title: r.account_name, id: r.account_id})
                    else if (r.account_type === 'Liability')
                        liability_list.push({title: r.account_name, id: r.account_id})
                    else if (r.account_type === 'Equity')
                        equity_list.push({title: r.account_name, id: r.account_id})
                })
            }
            let sendData = [];
            const year_transaction_list = transactionList.filter(r=>r.year_id === year_id)
            let asset_records = []
            if (asset_list.length > 0) {
                asset_list.map(r => {
                    const transactions = year_transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                    const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    asset_records.push({title: r.title, amount: total})
                })
            }

            let liability_records = []
            if (liability_list.length > 0) {
                liability_list.map(r => {
                    const transactions = year_transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                    const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    liability_records.push({title: r.title, amount: total})
                })
            }

            let equity_records = []
            if (equity_list.length > 0) {
                equity_list.map(r => {
                    const transactions = year_transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                    const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    equity_records.push({title: r.title, amount: total})
                })
            }
            sendData.push(
                {
                    title: 'Assets',
                    items: asset_records,
                    total: asset_records.length > 0 ? asset_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                },
                {
                    title: 'Liabilities',
                    items: liability_records,
                    total: liability_records.length > 0 ? liability_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                },
                {
                    title: 'Equity',
                    items: equity_records,
                    total: equity_records.length > 0 ? equity_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                })

            setAssetList(asset_list)
            setLiabilityList(liability_list)
            setEquityList(equity_list)
            setDataTable(sendData)

        }
        else if (type === 'years') {
            setReportTitle(`Balance Sheet Report for the last Five Years`);
            let asset_list = [];
            let liability_list = [];
            let equity_list = [];
            if (accountList.length > 0 ) {
                accountList.map(r => {
                    if (r.account_type === 'Asset')
                        asset_list.push({title: r.account_name, id: r.account_id})
                    else if (r.account_type === 'Liability')
                        liability_list.push({title: r.account_name, id: r.account_id})
                    else if (r.account_type === 'Equity')
                        equity_list.push({title: r.account_name, id: r.account_id})
                })
            }
            let sendData = [];
            last_five_years.map(year => {
                let transaction_list = transactionList.filter(item => {
                    return (new Date(item.transaction_date).getTime() >= new Date(`${year}-01-01`).getTime() && new Date(item.transaction_date).getTime() <= new Date(`${year}-12-31`).getTime())
                });

                let asset_records = []
                if (asset_list.length > 0) {
                    asset_list.map(r => {
                        const transactions = transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                        const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                        asset_records.push({title: r.title, amount: total})
                    })
                }

                let liability_records = []
                if (liability_list.length > 0) {
                    liability_list.map(r => {
                        const transactions = transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                        const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                        liability_records.push({title: r.title, amount: total})
                    })
                }

                let equity_records = []
                if (equity_list.length > 0) {
                    equity_list.map(r => {
                        const transactions = transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                        const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                        equity_records.push({title: r.title, amount: total})
                    })
                }
                sendData.push([
                    {
                        title: 'Assets',
                        items: asset_records,
                        total: asset_records.length > 0 ? asset_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    },
                    {
                        title: 'Liabilities',
                        items: liability_records,
                        total: liability_records.length > 0 ? liability_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    },
                    {
                        title: 'Equity',
                        items: equity_records,
                        total: equity_records.length > 0 ? equity_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    }])
            })
            setAssetList(asset_list)
            setLiabilityList(liability_list)
            setEquityList(equity_list)
            setDataTable(sendData)
        }
        else {
            if (start_date !== '' && end_date !== '') {
                setReportTitle(`Balance Sheet Report from ${formatDateAndTime(start_date, 'date')} to ${formatDateAndTime(end_date, 'date')}`)
                let transaction_list = transactionList.filter(item => {return (new Date(item.transaction_date).getTime() >= new Date(start_date).getTime() && new Date(item.transaction_date).getTime() <= new Date(end_date).getTime())});
                let asset_list = [];
                let liability_list = [];
                let equity_list = [];
                if (accountList.length > 0 ) {
                    accountList.map(r => {
                        if (r.account_type === 'Asset')
                            asset_list.push({title: r.account_name, id: r.account_id})
                        else if (r.account_type === 'Liability')
                            liability_list.push({title: r.account_name, id: r.account_id})
                        else if (r.account_type === 'Equity')
                            equity_list.push({title: r.account_name, id: r.account_id})
                    })
                }
                let sendData = [];
                let asset_records = []
                if (asset_list.length > 0) {
                    asset_list.map(r => {
                        const transactions = transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                        const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                        asset_records.push({title: r.title, amount: total})
                    })
                }

                let liability_records = []
                if (liability_list.length > 0) {
                    liability_list.map(r => {
                        const transactions = transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                        const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                        liability_records.push({title: r.title, amount: total})
                    })
                }

                let equity_records = []
                if (equity_list.length > 0) {
                    equity_list.map(r => {
                        const transactions = transaction_list.filter(e => e.debit_account_id === r.id || e.credit_account_id === r.id);
                        const total = transactions.length > 0 ? transactions.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                        equity_records.push({title: r.title, amount: total})
                    })
                }
                sendData.push(
                    {
                        title: 'Assets',
                        items: asset_records,
                        total: asset_records.length > 0 ? asset_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    },
                    {
                        title: 'Liabilities',
                        items: liability_records,
                        total: liability_records.length > 0 ? liability_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    },
                    {
                        title: 'Equity',
                        items: equity_records,
                        total: equity_records.length > 0 ? equity_records.map(item => item.amount).reduce((prev, next) => prev + next) : 0
                    })

                setAssetList(asset_list)
                setLiabilityList(liability_list)
                setEquityList(equity_list)
                setDataTable(sendData)

            }
        }
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'finance_report_balance_sheet').length < 1) {
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
                                    title='Balance Sheet Report' data={[{title: 'Finance'}, {title: 'Report'}, {title: 'Balance Sheet'}]}
                                />
                            </div>
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="report_type">Select Report Type</label>
                                                <select id="report_type" className="form-control"
                                                        value={reportType.report_type} onChange={handleChange}>
                                                    <option value="">Select Option</option>
                                                    <option value="financial_year">Report By Financial Year</option>
                                                    <option value="date">Report By Transaction Date</option>
                                                    <option value="years">Report By Last Five Years</option>
                                                </select>
                                            </div>
                                            {
                                                reportType.report_type === 'financial_year' &&
                                                <div className="col-md-8 mb-3">
                                                    <label htmlFor="year_id">Select Financial Year</label>
                                                    <select id="year_id" className="form-control" value={reportType.year_id}
                                                            onChange={handleChange}>
                                                        <option value="">Select Option</option>
                                                        {
                                                            yearList.length > 0 && yearList.map((r, i) => {
                                                                return <option key={i}
                                                                               value={r.year_id}>{`${formatDateAndTime(r.start_date, 'date')} to ${formatDateAndTime(r.end_date, 'date')}`}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            }
                                            {
                                                reportType.report_type === 'date' &&
                                                <>
                                                    <div className="col-md-4 mb-3">
                                                        <label htmlFor="start_date">Report Start Date</label>
                                                        <input type="date" id="start_date" className="form-control"
                                                               value={reportType.start_date} onChange={handleChange}/>
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label htmlFor="end_date">Report End Date</label>
                                                        <input type="date" id="end_date" className="form-control"
                                                               disabled={reportType.start_date === ''}
                                                               min={reportType.start_date} value={reportType.end_date}
                                                               onChange={handleChange}/>
                                                    </div>
                                                </>
                                            }
                                        </div>

                                        {
                                            dataTable.length > 0 &&
                                            <button onClick={onDownload} className="btn btn-primary"> Export excel </button>

                                        }
                                        <div ref={tableRef} className="row" style={{width: '100%'}}>

                                            <h2>{reportTitle}</h2>
                                            {/*REPORT BY LAST FIVE YEARS START*/}
                                            {
                                                reportType.report_type === 'years' && dataTable.length > 0 &&
                                                <div className="col-md-12 table-responsive printable">
                                                    <table className="table table-striped">
                                                        <thead>
                                                        <tr>
                                                            <th>--</th>
                                                            {
                                                                last_five_years.map((year, index) => {
                                                                    return <th key={index}>{year}</th>
                                                                })
                                                            }
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td colSpan="6"><b>ASSETS</b></td>
                                                        </tr>
                                                        {
                                                            assetList.length > 0 && assetList.map((data, index) => {
                                                                return <tr key={index}>
                                                                    <td>{data.title}</td>
                                                                    <td>{currencyConverter(dataTable[0].filter(r => r.title === 'Assets')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[1].filter(r => r.title === 'Assets')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[2].filter(r => r.title === 'Assets')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[3].filter(r => r.title === 'Assets')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[4].filter(r => r.title === 'Assets')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                </tr>
                                                            })
                                                        }
                                                        <tr>
                                                            <th><strong>TOTAL</strong></th>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[0].filter(r => r.title === 'Assets')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[1].filter(r => r.title === 'Assets')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[2].filter(r => r.title === 'Assets')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[3].filter(r => r.title === 'Assets')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[4].filter(r => r.title === 'Assets')[0].total)}</strong>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td colSpan="6"><b>LIABILITIES</b></td>
                                                        </tr>
                                                        {
                                                            liabilityList.length > 0 && liabilityList.map((data, index) => {
                                                                return <tr key={index}>
                                                                    <td>{data.title}</td>
                                                                    <td>{currencyConverter(dataTable[0].filter(r => r.title === 'Liabilities')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[1].filter(r => r.title === 'Liabilities')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[2].filter(r => r.title === 'Liabilities')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[3].filter(r => r.title === 'Liabilities')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[4].filter(r => r.title === 'Liabilities')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                </tr>
                                                            })
                                                        }
                                                        <tr>
                                                            <th><strong>TOTAL</strong></th>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[0].filter(r => r.title === 'Liabilities')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[1].filter(r => r.title === 'Liabilities')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[2].filter(r => r.title === 'Liabilities')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[3].filter(r => r.title === 'Liabilities')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[4].filter(r => r.title === 'Liabilities')[0].total)}</strong>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td colSpan="6"><b>EQUITY</b></td>
                                                        </tr>
                                                        {
                                                            equityList.length > 0 && equityList.map((data, index) => {
                                                                return <tr key={index}>
                                                                    <td>{data.title}</td>
                                                                    <td>{currencyConverter(dataTable[0].filter(r => r.title === 'Equity')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[1].filter(r => r.title === 'Equity')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[2].filter(r => r.title === 'Equity')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[3].filter(r => r.title === 'Equity')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                    <td>{currencyConverter(dataTable[4].filter(r => r.title === 'Equity')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                </tr>
                                                            })
                                                        }
                                                        <tr>
                                                            <th><strong>TOTAL</strong></th>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[0].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[1].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[2].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[3].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[4].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th><strong>TOTAL LIABILITY + EQUITY</strong></th>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[0].filter(r => r.title === 'Liabilities')[0].total + dataTable[0].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[1].filter(r => r.title === 'Liabilities')[0].total + dataTable[1].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[2].filter(r => r.title === 'Liabilities')[0].total + dataTable[2].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[3].filter(r => r.title === 'Liabilities')[0].total + dataTable[3].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable[4].filter(r => r.title === 'Liabilities')[0].total + dataTable[4].filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            }
                                            {/*REPORT BY LAST FIVE YEARS END*/}

                                            {/*REPORT BY FINANCIAL YEAR START*/}
                                            {
                                                reportType.report_type !== 'years' && dataTable.length > 0 &&
                                                <div className="col-md-12 table-responsive printable">
                                                    <table className="table table-striped">
                                                        <thead>
                                                        <tr>
                                                            <th>--</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td colSpan="6"><b>ASSETS</b></td>
                                                        </tr>
                                                        {
                                                            assetList.length > 0 && assetList.map((data, index) => {
                                                                return <tr key={index}>
                                                                    <td>{data.title}</td>
                                                                    <td>{currencyConverter(dataTable.filter(r => r.title === 'Assets')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                </tr>
                                                            })
                                                        }
                                                        <tr>
                                                            <th><strong>TOTAL</strong></th>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable.filter(r => r.title === 'Assets')[0].total)}</strong>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td colSpan="6"><b>LIABILITIES</b></td>
                                                        </tr>
                                                        {
                                                            liabilityList.length > 0 && liabilityList.map((data, index) => {
                                                                return <tr key={index}>
                                                                    <td>{data.title}</td>
                                                                    <td>{currencyConverter(dataTable.filter(r => r.title === 'Liabilities')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                </tr>
                                                            })
                                                        }
                                                        <tr>
                                                            <th><strong>TOTAL</strong></th>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable.filter(r => r.title === 'Liabilities')[0].total)}</strong>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td colSpan="6"><b>EQUITY</b></td>
                                                        </tr>
                                                        {
                                                            equityList.length > 0 && equityList.map((data, index) => {
                                                                return <tr key={index}>
                                                                    <td>{data.title}</td>
                                                                    <td>{currencyConverter(dataTable.filter(r => r.title === 'Equity')[0].items.filter(r => r.title === data.title)[0].amount)}</td>
                                                                </tr>
                                                            })
                                                        }
                                                        <tr>
                                                            <th><strong>TOTAL</strong></th>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable.filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th><strong>TOTAL LIABILITY + EQUITY</strong></th>
                                                            <td>
                                                                <strong>{currencyConverter(dataTable.filter(r => r.title === 'Liabilities')[0].total + dataTable.filter(r => r.title === 'Equity')[0].total)}</strong>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            }
                                            {/*REPORT BY FINANCIAL YEAR END*/}
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

export default connect(mapStateToProps, null)(BalanceSheetReport)