import {connect} from "react-redux"
import {List, Plus} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";
import FinanceLedgerDocumentForm from "@src/views/finance/finance-ledger-document/finance-ledger-document-form";

function FinanceLedgerDocument({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false)
    const [ledgerDocumentList, setLedgerDocumentList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const header = ["S/N", "Document Type", "Modified By", "Modified Date", "Action"];

    const initialValue = {
        document_id: "", document_type: "", modified_by: loginData[0]?.user_id,
    }
    const [formData, setFormData] = useState(initialValue);

    const resetForm = () => {
        setFormData(initialValue)
    }

    const getData = async () => {
        await axios.get(`${serverLink}finance/ledger-document/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setLedgerDocumentList(data.data)
                    showTable(data.data)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (dataset) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.document_type}</td>
                        <td>{item.modified_by_name}</td>
                        <td>{formatDateAndTime(item.modified_date, 'date')}</td>
                        <td>
                            <a href="#" className={"btn btn-primary btn-sm mb-1"} style={{marginRight: 2}}
                               onClick={() => {
                                   setFormData({
                                       ...formData,
                                       document_id: item.document_id,
                                       document_type: item.document_type,
                                   });
                                   toggleModal();
                               }}>
                                <i className='fa fa-pencil'/>
                            </a>
                            <a href="#" className={"btn btn-danger btn-sm  mb-1"}
                               onClick={() => showConfirm("Warning", `Are you sure you want to delete this ledger document?`, "warning")
                                   .then(async (confirm) => {
                                       if (confirm) {
                                           await handleDelete(item.document_id)
                                       }
                                   })}>
                                <i className='fa fa-trash'/>
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

    const onSubmit = async () => {
        if (formData.document_type.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please enter document type", "error");
            return false;
        }

        if (formData.document_id === "") {
            setIsFormLoading(true);
            toast.info("please wait...");
            await axios
                .post(`${serverLink}finance/ledger-document/add`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Ledger Document Added Successfully");
                        setIsFormLoading(false);
                        getData();
                        resetForm();
                        toggleModal();
                    } else if (result.data.message === 'exist') {
                        setIsFormLoading(false);
                        showAlert("ERROR", "Ledger Document Already Exist", "error");
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
        else{
            setIsFormLoading(true);
            await axios
                .patch(`${serverLink}finance/ledger-document/update`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Ledger Document Updated Successfully");
                        setIsFormLoading(false);
                        getData();
                        resetForm()
                        toggleModal()
                    } else {
                        setIsFormLoading(false);
                        showAlert("ERROR", "Something went wrong. Please try again!", "error");
                    }
                })
                .catch((error) => {
                    setIsFormLoading(false);
                    showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
                });
        }
    }

    const handleDelete = async (id) => {
        toast.info("please wait...");
        await axios.delete(`${serverLink}finance/ledger-document/delete/${id}`, token).then((res) => {
            if (res.data.message === "success") {
                toast.success("Deleted Successfully");
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
        if (login.permission.filter(e=>e.permission === 'finance_ledger_document').length < 1) {
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
                                    title='Finance Ledger Document' data={[{title: 'Finance'}, {title: 'Finance Ledger Document'}]}
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
                                                <h4><List/> Finance Ledger Document</h4>
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
                                            body={showTable(ledgerDocumentList)}
                                            title="Finance Ledger Document"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Finance Ledger Document Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <FinanceLedgerDocumentForm
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleModal={toggleModal}
                                    formData={formData}
                                    setFormData={setFormData}
                                    isFormLoading={isFormLoading}
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

export default connect(mapStateToProps, null)(FinanceLedgerDocument)