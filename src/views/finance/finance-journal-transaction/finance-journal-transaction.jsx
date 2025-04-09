import {connect} from "react-redux"
import {List, Plus} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";
import FinanceJournalTransactionForm
    from "@src/views/finance/finance-journal-transaction/finance-journal-transaction-form";

function FinanceJournalTransaction({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false)
    const [journalList, setJournalList] = useState([]);
    const [activeFinancialYear, setActiveFinancialYear] = useState({ year_id: "", start_date: "", end_date: "" });
    const [financialYearList, setFinancialYearList] = useState([]);
    const [accountList, setAccountList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const header = ["S/N", "Req ID", "Description", "Trans Date", "Amount", "Debit Acct", "Credit Acct", "Trans Year", "Created By", "Created Date", "Archive"];

    const initialValue = {
        transaction_date: "", description: "", amount: "", debit_account_id: "", credit_account_id: "",
        modified_by: loginData[0]?.user_id, year_id: ""
    }
    const [formData, setFormData] = useState(initialValue);

    const resetForm = () => {
        setFormData(initialValue)
    }

    const getData = async () => {
        await axios.get(`${serverLink}finance/journal/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setAccountList(data.account_list)
                    setJournalList(data.data)
                    setFinancialYearList(data.financial_year_list)
                    setActiveFinancialYear({ year_id: data.year_id, start_date: data.start_date, end_date: data.end_date })
                    showTable(data.data, data.account_list, data.financial_year_list)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (dataset, accounts, years) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                const debit_account = accounts.filter(e=>e.account_id === item.debit_account_id)[0].account_name;
                const credit_account = accounts.filter(e=>e.account_id === item.credit_account_id)[0].account_name;
                const start_date = years.filter(e=>e.year_id === item.year_id)[0].start_date;
                const end_date = years.filter(e=>e.year_id === item.year_id)[0].end_date;
                const financial_year = `${formatDateAndTime(start_date, 'short_date')} - ${formatDateAndTime(end_date, 'short_date')}`;

                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.request_id === 0 ? '--' : item.request_id}</td>
                        <td>{item.description}</td>
                        <td>{formatDateAndTime(item.transaction_date, 'short_date')}</td>
                        <td>{currencyConverter(item.amount)}</td>
                        <td>{debit_account}</td>
                        <td>{credit_account}</td>
                        <td>{financial_year}</td>
                        <td>{item.modified_by_name}</td>
                        <td>{formatDateAndTime(item.modified_date, 'short_date')}</td>
                        <td>
                            {
                                item.status === 'posted' && activeFinancialYear.year_id === item.year_id ?
                                    <a href="#" className={"btn btn-danger btn-sm  mb-1"}
                                       onClick={() => showConfirm("warning", `Are you sure you want to archive this transaction?`, "warning")
                                           .then(async (confirm) => {
                                               if (confirm) {
                                                   await handleArchive(item.journal_id)
                                               }
                                           })}>
                                        <i className='fa fa-x'/>
                                    </a> : '--'
                            }

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
        if (formData.amount === "") {
            showAlert("EMPTY FIELD", "Please enter transaction amount", "error");
            return false;
        }
        const sendData = {...formData, year_id: activeFinancialYear.year_id}

        setIsFormLoading(true);
        toast.info("please wait...");
        await axios
            .post(`${serverLink}finance/journal/add`, sendData, token)
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
            .catch((error) => {
                setIsFormLoading(false);
                showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
            });
    }

    const handleArchive = async (id) => {
        toast.info("please wait...");
        const sendData = {
            journal_id: id,
            modified_by: initialValue.modified_by
        }
        await axios.patch(`${serverLink}finance/journal/archive`, sendData, token).then((res) => {
            if (res.data.message === "success") {
                toast.success("Transaction Archived Successfully");
                getData();
            } else {
                toast.error("NETWORK ERROR. Please try again!");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("NETWORK ERROR. Please try again!");
        });
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'finance_journal').length < 1) {
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
                                    title='Journal Transaction' data={[{title: 'Finance'}, {title: 'Journal Transaction'}]}
                                />
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                <div className="breadcrumb-right dropdown">
                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleModal();
                                        resetForm();
                                    }}>
                                        <Plus size={14}/>
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
                                                <h4><List/> Finance Journal Transaction</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2'>
                                        <DataTable
                                            tableID="table1"
                                            header={header}
                                            body={showTable(journalList, accountList, financialYearList)}
                                            title="Finance Journal Transaction"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Finance Journal Transaction Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <FinanceJournalTransactionForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    accountList={accountList}
                                    activeFinancialYear={activeFinancialYear}
                                    isFormLoading={isFormLoading}
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleModal={toggleModal}
                                />
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

export default connect(mapStateToProps, null)(FinanceJournalTransaction)