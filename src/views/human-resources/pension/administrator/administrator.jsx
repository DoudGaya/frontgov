import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import MiddleModal from "@src/component/common/modal/middle-modal";
import {setGeneralDetails} from '@store/actions';
import {Button, Card, CardBody, CardHeader, Row, Spinner} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import {Edit, List, Plus, Trash2} from "react-feather";
import Table from "@src/component/common/table/table";

function PensionAdministrator({loginData}) {
    const token = loginData[0]?.token;
    const user_id = loginData[0]?.user_id;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [IsFormLoading, setIsFormLoading] = useState(false)
    const [enrolmentList, setEnrolmentList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal);
    const initialValue = {
        admin_id: "", admin_name: "", contact_no: "", contact_email: "", created_by: user_id, updated_by: user_id
    }
    const [formData, setFormData] = useState(initialValue);
    const resetForm = () => {
        setFormData(initialValue)
    }
    const [datatable, setDatatable] = useState({
        columns: [
            { label: "S/N", field: "sn"},
            { label: "Admin Name", field: "admin_name" },
            { label: "Phone No", field: "contact_no" },
            { label: "Email", field: "contact_email" },
            { label: "Enrolments", field: "enrolment" },
            { label: "Modified By", field: "modified_by" },
            { label: "Modified Date", field: "modified_date" },
            { label: "Action", field: "action" },
        ],
        rows: [],
    });

    const getData = async () => {
        await axios.get(`${serverLink}hr/pension-admin/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setEnrolmentList(data.enrolment)
                    generateTable(data.data, data.enrolment)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const generateTable = (table_data, enrolment) => {
        let rowData = [];
        table_data.map((item, index)=> {
            rowData.push({
                sn: index + 1,
                admin_name: item.admin_name ?? "N/A",
                contact_no: item.contact_no,
                contact_email: item.contact_email,
                enrolment: enrolment.filter(r=>r.admin_id===item.admin_id).length ?? "N/A",
                modified_by: item.updated_by_name ?? "N/A",
                modified_date: formatDateAndTime(item.updated_date, 'date_and_time') ?? "N/A",
                action:  (
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-primary btn-sm"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    admin_id: item.admin_id,
                                    admin_name: item.admin_name,
                                    contact_no: item.contact_no,
                                    contact_email: item.contact_email
                                })
                                setShowModal(true);
                            }} style={{marginRight: '5px'}}>
                            <Edit size={11}/>
                        </button>
                        <button
                            className="btn btn-sm btn-danger btn-sm"
                            onClick={() => {
                                showConfirm("Warning", `Are you sure you want to delete this administrator?`, "warning")
                                    .then( async (confirm) => {
                                        if (confirm) {
                                            await handleDelete(item.admin_id)
                                        }
                                    })
                            }} style={{marginRight: '5px'}}>
                            <Trash2 size={11}/>
                        </button>
                    </div>
                ),
            });
        })
        setDatatable({
            ...datatable,
            columns: datatable.columns,
            rows: rowData,
        });
    }

    const DocumentData = () => {
        return (
            <Card>
                <CardHeader>
                    <div className="card-toolbar col-md-12 col-12 p-0">
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className="col-md-4">
                                <h4><List/> Administrator List</h4>
                            </div>

                        </div>
                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                    </div>
                </CardHeader>
                <CardBody>
                    <Row className='gy-2'>
                        <Table data={datatable}/>
                    </Row>
                </CardBody>
            </Card>
        )
    }

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const onSubmit = async () => {
        if (formData.admin_name.toString().trim() === "") {
            await showAlert("EMPTY FIELD", "Please enter admin name", "error");
            return false;
        }
        if (formData.contact_no.toString().trim() === "") {
            await showAlert("EMPTY FIELD", "Please enter contact no", "error");
            return false;
        }
        if (formData.contact_email === "") {
            await showAlert("EMPTY FIELD", "Please enter contact email", "error");
            return false;
        }

        if (formData.admin_id === "") {
            setIsFormLoading(true);
            toast.info("please wait...");
            await axios
                .post(`${serverLink}hr/pension-admin/add`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Admin Added Successfully");
                        setIsFormLoading(false);
                        getData();
                        resetForm();
                        toggleModal();
                    } else if (result.data.message === 'exist') {
                        setIsFormLoading(false);
                        showAlert("ERROR", "Admin Already Exist", "error");
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
        else{
            setIsFormLoading(true);
            await axios
                .patch(`${serverLink}hr/pension-admin/update`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Admin Updated Successfully");
                        setIsFormLoading(false);
                        getData();
                        resetForm()
                        toggleModal()
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
    }

    const handleDelete = async (id) => {
        if (enrolmentList.filter(r=>r.admin_id === id).length > 0) {
            await showAlert("ERROR", "You can't delete this administrator. Enrolees exist", "error");
            return;
        }
        toast.info("please wait...");
        await axios.delete(`${serverLink}hr/pension-admin/delete/${id}`, token).then((res) => {
            if (res.data.message === "success") {
                toast.success("Deleted Successfully");
                getData();
            } else {
                toast.error("NETWORK ERROR. Please try again!");
            }
        }).catch(() => {
            toast.error("NETWORK ERROR. Please try again!");
        });
    }

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_pension_administration').length < 1) {
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
                                <Breadcrumbs title='Pension Administrator' data={[{title: 'HR Pension'}, {title: 'Pension Administrator'}]}/>
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-4 d-md-block">
                                <div className="breadcrumb-right dropdown d-flex float-end">

                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleModal();
                                        setFormData(initialValue)
                                    }}>
                                        <Plus size={14}/> Add Administrator
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>

                            <MiddleModal title={"Pension Administrator Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <div className="row">
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Administrator Name</label>
                                        <input
                                            type={'text'}
                                            className="form-control"
                                            id="admin_name"
                                            value={formData.admin_name}
                                            onChange={onEdit}
                                            placeholder="Enter Administrator Name"
                                        />
                                    </div>

                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Contact Number</label>
                                        <input
                                            type={'tel'}
                                            className="form-control"
                                            id="contact_no"
                                            value={formData.contact_no}
                                            onChange={onEdit}
                                            placeholder="Enter Contact Number"
                                        />
                                    </div>

                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Contact Email</label>
                                        <input
                                            type={'email'}
                                            className="form-control"
                                            id="contact_email"
                                            value={formData.contact_email}
                                            onChange={onEdit}
                                            placeholder="Enter Contact Email"
                                        />
                                    </div>

                                </div>
                                <div className="form-group col-md-12">
                                    {
                                        IsFormLoading ?
                                            <Button variant="de-primary" disabled>
                                                <Spinner className="spinner-grow-sm me-1" tag="span" color="white" type="grow" />
                                                Submitting...
                                            </Button>
                                            :
                                            <Button type="button" onClick={onSubmit} size="lg" variant="de-primary">
                                                Submit
                                            </Button>
                                    }
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

const mapDispatchToProps = (dispatch) => {
    return {
        setOnGeneralDetails: (p) => {
            dispatch(setGeneralDetails(p))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PensionAdministrator)