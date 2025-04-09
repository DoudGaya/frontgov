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
import LedgerEntriesForm from "@src/views/finance/finance-ledger-entries/ledger-entries-form";

function LedgerEntries({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false)
    const [ledgerList, setLedgerList] = useState([]);
    const [entryList, setEntryList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [documentList, setDocumentList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const header = ["S/N", "Account", "Post Type", "Value Date", "Trans Date", "Description", "Document", "Branch", "Amount", "Account Bal.", "Post By", "Post Date"];

    const initialValue = {
        ledger_id: "", posting_type: "", description: "", amount: "", inserted_by: loginData[0]?.user_id,
        value_date: "", transaction_date: "", document_id: "", branch_id: "", is_last_entry: "0"
    }
    const [formData, setFormData] = useState(initialValue);

    const resetForm = () => {
        setFormData(initialValue)
    }

    const getData = async () => {
        await axios.get(`${serverLink}finance/ledger-entries/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    const entries = data.data;
                    const ledgers = data.ledger_list;
                    const document_list = data.document_list;
                    const branch_list = data.branch_list;

                    setEntryList(entries)
                    setLedgerList(ledgers)
                    setDocumentList(document_list)
                    setBranchList(branch_list)

                    showTable(entries, ledgers, document_list, branch_list)
                } else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (dataset, ledger_list, document_list, branch_list) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                const ledger_name = ledger_list.filter(e=>e.ledger_id === item.ledger_id)[0].description;
                const document_type = document_list.filter(e=>e.document_id === item.document_id)[0].document_type;
                const branch_name = branch_list.filter(e=>e.branch_id === item.branch_id)[0].branch_name;
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{ledger_name}</td>
                        <td>{item.posting_type}</td>
                        <td>{formatDateAndTime(item.value_date, 'short_date')}</td>
                        <td>{formatDateAndTime(item.transaction_date, 'short_date')}</td>
                        <td>{item.description}</td>
                        <td>{document_type}</td>
                        <td>{branch_name}</td>
                        <td>{currencyConverter(item.amount)}</td>
                        <td>{currencyConverter(item.account_balance)}</td>
                        <td>{item.inserted_by_name}</td>
                        <td>{formatDateAndTime(item.posting_date, 'short_date')}</td>
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
        if (formData.ledger_id === "") { showAlert("EMPTY FIELD", "Please select ledger account", "error"); return false;}
        if (formData.posting_type.toString().trim() === "") { showAlert("EMPTY FIELD", "Please select posting type", "error");return false;}
        if (formData.transaction_date === "") { showAlert("EMPTY FIELD", "Please select transaction date", "error");return false;}
        if (formData.value_date === "") { showAlert("EMPTY FIELD", "Please select value date", "error");return false;}
        if (formData.amount === "") { showAlert("EMPTY FIELD", "Please enter transaction amount", "error");return false;}
        if (formData.document_id === "") { showAlert("EMPTY FIELD", "Please select ledger document", "error");return false;}
        if (formData.branch_id === "") { showAlert("EMPTY FIELD", "Please select ledger branch", "error");return false;}
        if (formData.description.toString().trim() === "") {showAlert("EMPTY FIELD", "Please enter transaction description", "error");return false;}

        const sendData = {
            ...formData, amount: parseFloat(formData.amount),
        }
        setIsFormLoading(true);
        toast.info("please wait...");
        await axios
            .post(`${serverLink}finance/ledger-entries/add`, sendData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Ledger Entry Added Successfully");
                    setIsFormLoading(false);
                    getData();
                    resetForm();
                    toggleModal();
                } else if (result.data.message === 'exist') {
                    setIsFormLoading(false);
                    showAlert("ERROR", "Ledger Entry Already Exist", "error");
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

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'finance_ledger_entry').length < 1) {
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
                                    title='Finance Ledger Entries' data={[{title: 'Finance'}, {title: 'Finance Ledger Entries'}]}
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
                                                <h4><List/> Finance Ledger Entries</h4>
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
                                            body={showTable(entryList, ledgerList, documentList, branchList)}
                                            title="Finance Ledger Entries"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Finance Ledger Entries Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <LedgerEntriesForm
                                    formData={formData}
                                    ledgerList={ledgerList}
                                    documentList={documentList}
                                    branchList={branchList}
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

export default connect(mapStateToProps, null)(LedgerEntries)