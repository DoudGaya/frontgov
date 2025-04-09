import {connect} from "react-redux"
import {List, Plus} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Button, Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";
import FinanceFundRequestForm from "@src/views/finance/finance-fund-request/finance-fund-request-form";
import Select, {components} from "react-select";
import {bank_list} from "@src/resources/bank_list";

function FinanceFundRequest({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [requestList, setRequestList] = useState([]);
    const [requestItemList, setRequestItemList] = useState([]);
    const [accountList, setAccountList] = useState([]);
    const [transactionList, setTransactionList] = useState([]);
    const [paymentList, setPaymentList] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState({});
    const [selectedRequestItems, setSelectedRequestItems] = useState([]);
    const [requestOptions, setRequestOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
    const toggleModal2 = () => {
        setShowModal(!showModal);
        resetForm();
    }

    const header = ["S/N", "Req ID", "Agency", "Request Date", "Amount Requested", "Amount Approved", "Amount Paid", "Status", "Paid By", "Paid On", "Action"];

    const initialValue = {
        transaction_date: "", description: "", amount: "", debit_account_id: "", credit_account_id: "",
        modified_by: loginData[0]?.user_id, year_id: "", request_id: ""
    }
    const [formData, setFormData] = useState(initialValue);

    const [showProcessModal, setShowProcessModal] = useState(false);
    const toggleProcessModal = () => setShowProcessModal(!showProcessModal);
    const initialProcessFormData = {
        journal_id: "", request_id: "", amount: "", payment_date: "", created_by: login.user_id,
        payment_method: "", account_number: "", account_name: "", bank: "" }
    const [processFormData, setProcessFormData] = useState(initialProcessFormData);
    const resetProcessForm = () => setProcessFormData(initialProcessFormData);

    const resetForm = () => {
        setFormData({...formData, transaction_date: "", description: "", amount: "", debit_account_id: "", credit_account_id: "", request_id: ""});
    }

    const getData = async () => {
        await axios.get(`${serverLink}request/history`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    const requests = data.requests;
                    const transactions = data.transactions
                    setAccountList(data.account_list)
                    setRequestList(requests)
                    setRequestItemList(data.request_items)
                    setPaymentList(data.payments)
                    setTransactionList(transactions)
                    setFormData({...formData, year_id: data.year_id})

                    if (requests.length > 0) {
                        let req_list = [];
                        requests.map(r => {
                            if (transactions.filter(e=>e.request_id === r.request_id).length > 0 && data.payments.filter(e=>e.request_id === r.request_id).length === 0) {
                                req_list.push({value: r.request_id, label: `${r.agency_name_from} (D: ${formatDateAndTime(r.created_date, 'short_date')}, ID: ${r.request_id})`});
                            }
                        })
                        setRequestOptions(req_list);
                    }

                    showTable(requests, data.request_items, data.payments, transactions)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (dataset, request_items, payments, transactions) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                const items = request_items.filter(r=>r.request_id === item.request_id);
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.request_id}</td>
                        <td>{item.agency_name_from}</td>
                        <td>{formatDateAndTime(item.created_date, 'short_date')}</td>
                        <td>{currencyConverter(item.total_requested)}</td>
                        <td>{currencyConverter(item.total_approved)}</td>
                        <td>{currencyConverter(item.total_paid)}</td>
                        <td>{item.payment_status}</td>
                        <td>{item.paid_by_name}</td>
                        <td>{item.paid_by === 0 ? '--' : formatDateAndTime(item.paid_date, 'short_date') }</td>
                        <td>
                            <a href="#" className={"btn btn-outline-dark btn-sm  mb-1"}
                               onClick={() => {
                                   setSelectedRequest(item);
                                   setSelectedRequestItems(items)
                                   setSelectedTransaction(transactions.filter(r => r.request_id === item.request_id))
                                   setSelectedPayment(payments.filter(r => r.request_id === item.request_id))
                                   toggleModal();
                               }}>
                                <i className='fa fa-check-circle'/>
                            </a>
                        </td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const onSubmitPaymentRequest = async () => {
        if (processFormData.request_id === "") {
            showAlert("EMPTY FIELD", "Please select the request", "error");
            return false;
        }
        if (processFormData.payment_method.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please select the payment method", "error");
            return false;
        }
        if (processFormData.payment_date.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please select the payment date", "error");
            return false;
        }
        if (processFormData.account_name.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please enter the account name", "error");
            return false;
        }
        if (processFormData.account_number.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please enter the account number", "error");
            return false;
        }
        if (processFormData.account_number.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please select the bank", "error");
            return false;
        }

        setIsFormLoading(true);
        toast.info("Processing...");
        await axios
            .post(`${serverLink}finance/process-payment`, processFormData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Payment Added Successfully");
                    setIsFormLoading(false);
                    getData();
                    resetProcessForm();
                    toggleProcessModal();
                } else if (result.data.message === 'exist') {
                    setIsFormLoading(false);
                    showAlert("ERROR", "Payment Already Exist", "error");
                } else {
                    setIsFormLoading(false);
                    showAlert("ERROR", result.data.message, "error");
                }
            })
            .catch(() => {
                setIsFormLoading(false);
                showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
            });
    }

    const onSubmit = async () => {
        if (formData.transaction_date.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please select transaction date", "error");
            return false;
        }
        if (formData.description.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please enter transaction description", "error");
            return false;
        }
        if (formData.debit_account_id.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please select the debit account", "error");
            return false;
        }
        if (formData.credit_account_id.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please select the credit account", "error");
            return false;
        }
        if (formData.credit_account_id.toString().trim() === formData.debit_account_id.toString().trim()) {
            showAlert("EMPTY FIELD", "Credit and Debit Accounts cannot be the same", "error");
            return false;
        }
        const sendData = {...formData, request_id: selectedRequest.request_id, amount: selectedRequest.total_approved};

        setIsFormLoading(true);
        toast.info("please wait...");
        await axios
            .post(`${serverLink}finance/journal/add-request`, sendData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Transaction Added Successfully");
                    setIsFormLoading(false);
                    getData();
                    resetForm();
                    toggleModal();
                } else if (result.data.message === 'exist') {
                    setIsFormLoading(false);
                    showAlert("ERROR", "Transaction Already Exist", "error");
                } else {
                    setIsFormLoading(false);
                    showAlert("ERROR", result.data.message, "error");
                }
            })
            .catch(() => {
                setIsFormLoading(false);
                showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
            });
    }

    const SelectComponent = ({ data, ...props }) => {
        return (
            <components.Option {...props}>
                <div className='d-flex flex-wrap align-items-center'>
                    {data.label}
                </div>
            </components.Option>
        )
    };

    const handleRequestSelect = (item) => {
        const requestId = item.value;
        const transaction = transactionList.filter(r=>r.request_id === requestId)[0];
        setProcessFormData({...processFormData, journal_id: transaction.journal_id, request_id: requestId, amount: transaction.amount});
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'finance_payment_request').length < 1) {
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
                                    title='Fund Requests' data={[{title: 'Finance'}, {title: 'Fund Requests'}]}
                                />
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                <div className="breadcrumb-right dropdown">
                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleProcessModal();
                                        resetProcessForm();
                                    }}>
                                        <Plus size={14}/> Process Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardHeader>
                                    <div className="card-toolbar col-md-12 col-12 p-0">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className="col-md-4">
                                                <h4><List/> Finance Fund Requests</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2 table-responsive'>
                                        <DataTable
                                            tableID="table1"
                                            header={header}
                                            body={showTable(requestList, requestItemList, paymentList, transactionList)}
                                            title="Finance Fund Requests"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Finance Fund Request Form"} size={'modal-xl'} open={showModal} toggleSidebar={toggleModal2}>
                                <FinanceFundRequestForm
                                    formData={formData}
                                    accountList={accountList}
                                    selectedRequest={selectedRequest}
                                    selectedRequestItems={selectedRequestItems}
                                    isFormLoading={isFormLoading}
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleModal={toggleModal2}
                                    selectedPayment={selectedPayment}
                                    selectedTransaction={selectedTransaction}
                                />
                            </MiddleModal>

                            <MiddleModal id="modal" title={"Process Payment Form"} size={'modal-lg'} open={showProcessModal} toggleSidebar={toggleProcessModal}>
                                <div className="row">
                                    <div className={'col-md-12'}>
                                        <div className="form-group mb-2">
                                            <label className="form-label">Select Request</label>
                                            <Select
                                                id='select-item'
                                                onChange={handleRequestSelect}
                                                isClearable={false}
                                                options={requestOptions}
                                                className='react-select select-borderless'
                                                classNamePrefix='select'
                                                components={{Option: SelectComponent}}
                                            />
                                        </div>

                                        <div className="form-group mb-2">
                                            <label className="form-label">Payment Method</label>
                                            <select name="payment_method" id="payment_method"
                                                    className={'form-control'}
                                                    value={processFormData.payment_method}
                                                    onChange={(e) => {
                                                        setProcessFormData({
                                                            ...processFormData,
                                                            payment_method: e.target.value
                                                        })
                                                    }}
                                            >
                                                <option value="">Select Option</option>
                                                <option value="Bank">Bank</option>
                                                <option value="Bank Draft">Bank Draft</option>
                                                <option value="Cheque">Cheque</option>
                                                <option value="Direct Debit">Direct Debit</option>
                                                <option value="Transfer">Transfer</option>
                                            </select>
                                        </div>

                                        <div className="form-group mb-2">
                                            <label className="form-label">Payment Date</label>
                                            <input type="date" className={'form-control'}
                                                   value={processFormData.payment_date}
                                                   onChange={(e) => {
                                                       setProcessFormData({
                                                           ...processFormData,
                                                           payment_date: e.target.value
                                                       })
                                                   }}
                                            />
                                        </div>

                                        <div className="form-group mb-2">
                                            <label className="form-label">Account Name</label>
                                            <input type="text" className={'form-control'}
                                                   placeholder={'Enter Account Name'}
                                                   value={processFormData.account_name}
                                                   onChange={(e) => {
                                                       setProcessFormData({
                                                           ...processFormData,
                                                           account_name: e.target.value
                                                       })
                                                   }}
                                            />
                                        </div>

                                        <div className="form-group mb-2">
                                            <label className="form-label">Account Number</label>
                                            <input type="text" className={'form-control'}
                                                   placeholder={"Enter Account Number"}
                                                   value={processFormData.account_number}
                                                   onChange={(e) => {
                                                       setProcessFormData({
                                                           ...processFormData,
                                                           account_number: e.target.value
                                                       })
                                                   }}
                                            />
                                        </div>

                                        <div className="form-group mb-2">
                                            <label className="form-label">Bank</label>
                                            <select name="payment_method" id="payment_method"
                                                    className={'form-control'}
                                                    value={processFormData.bank}
                                                    onChange={(e) => {
                                                        setProcessFormData({
                                                            ...processFormData,
                                                            bank: e.target.value
                                                        })
                                                    }}
                                            >
                                                <option value="">Select Option</option>
                                                {
                                                    bank_list.map((bank, index) => {
                                                        return (
                                                            <option key={index} value={bank}>{bank}</option>
                                                        )
                                                    })
                                                }

                                            </select>
                                        </div>


                                        <div className="form-group mb-2">
                                            <label className="form-label">Payment Amount</label>
                                            <input type="text" className={'form-control'}
                                                   value={currencyConverter(processFormData.amount)} readOnly={true}/>
                                        </div>

                                        <div className="form-group mb-2">
                                            {
                                                isFormLoading ?
                                                    <button className="btn btn-outline-primary disabled"
                                                            style={{marginRight: '10px'}}>
                                                        <div role="status" className="spinner-border-sm spinner-border"><span
                                                            className="visually-hidden">Loading...</span></div>
                                                        <span className="ms-50">Loading...</span></button>
                                                    :
                                                    <Button type='button' className='me-1' color='primary'
                                                            onClick={onSubmitPaymentRequest}>
                                                        Submit
                                                    </Button>
                                            }
                                            <Button type='reset' color='danger' outline onClick={toggleProcessModal}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </MiddleModal>
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

export default connect(mapStateToProps, null)(FinanceFundRequest)