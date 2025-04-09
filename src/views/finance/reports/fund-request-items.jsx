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
        { "field": "request_id", "headerName": "Req ID", "width": 100 },
        { "field": "agency_name", "headerName": "Agency", "width": 300 },
        { "field": "item_name", "headerName": "Item Name", "width": 380 },
        { "field": "quantity", "headerName": "Qty", "width": 50 },
        { "field": "unit_price", "headerName": "Unit Price", "width": 150 },
        { "field": "total", "headerName": "Total", "width": 150 },
        { "field": "paid_date", "headerName": "Trans Date", "width": 100 }
    ];
    const [datatable, setDatatable] = useState({
        columns: ReportColumns,
        rows: [],
    });
    const [transactionList, setTransactionList] = useState([])
    const [reportData, setReportData] = useState({start_date:'', end_date:''})

    const getData = async () => {
        await axios.get(`${serverLink}request/report/fund_request_items`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    setTransactionList(result.data.data)
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
            let transaction_list = transactionList.filter(item => {return (new Date(item.paid_date).getTime() >= new Date(report_data.start_date).getTime() && new Date(item.paid_date).getTime() <= new Date(report_data.end_date).getTime())});

            if (transaction_list.length > 0) {
                let rows = [];
                transaction_list.map((item, index) => {
                    rows.push({
                        "id": (index+1),
                        "paid_date": formatDateAndTime(item.paid_date, 'short_date'),
                        "request_id": item.request_id,
                        "item_name": item.item_name,
                        "quantity": item.quantity,
                        "agency_name": item.agency_name,
                        "unit_price": currencyConverter(item.unit_price),
                        "total": currencyConverter(item.total),
                    })
                });
                rows.push({
                    "id": '--',
                    "paid_date": '--',
                    "request_id": '--',
                    "item_name": '--',
                    "quantity": '--',
                    "unit_price": '--',
                    "total": currencyConverter(sumObjectArray(transaction_list, 'total')),
                    "agency_name": '--',
                })
                setDatatable({...datatable, columns: datatable.columns, rows: rows})


            } else {
                toast.error("No payment items within the selected date range");
                setDatatable({...datatable, columns: datatable.columns, rows: []})
            }
        }
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'finance_report_fund_request').length < 1) {
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
                                    title='Paid Fund Request Items Report' data={[{title: 'Finance'}, {title: 'Fund Request Items'}]}
                                />
                            </div>
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <div className="row col-md-12">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="start_date">Transaction Start Date</label>
                                                <input type="date" id="start_date" className="form-control"
                                                       value={reportData.start_date} onChange={handleChange}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="end_date">Transaction End Date</label>
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