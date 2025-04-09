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
import {List, Plus, Trash2} from "react-feather";
import Table from "@src/component/common/table/table";
import Select from "react-select";

function PensionEnrolment({loginData}) {
    const token = loginData[0]?.token;
    const user_id = loginData[0]?.user_id;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [IsFormLoading, setIsFormLoading] = useState(false)
    const [adminList, setAdminList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal);
    const initialValue = {
        enrolment_id: "", employee_id: "", admin_id: "", rsa_pin: "", created_by: user_id, updated_by: user_id
    }
    const [formData, setFormData] = useState(initialValue);
    const resetForm = () => {
        setFormData(initialValue)
    }
    const [datatable, setDatatable] = useState({
        columns: [
            { label: "S/N", field: "sn"},
            { label: "Employee ID", field: "staff_id" },
            { label: "Employee Name", field: "employee_name" },
            { label: "Administrator", field: "admin_name" },
            { label: "RSA PIN", field: "rsa_pin" },
            { label: "Registered By", field: "created_by" },
            { label: "Registered Date", field: "created_date" },
            { label: "Action", field: "action" }
        ],
        rows: [],
    });

    const getData = async () => {
        await axios.get(`${serverLink}hr/pension/enrolment-list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setAdminList(data.admin_list)
                    setEmployeeList(data.employee_list)
                    generateTable(data.enrolment_list)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const generateTable = (table_data) => {
        let rowData = [];
        table_data.map((item, index)=> {
            rowData.push({
                sn: index + 1,
                admin_name: item.admin_name ?? "N/A",
                staff_id: item.staff_id,
                employee_name: item.employee_name,
                rsa_pin: item.rsa_pin,
                created_by: item.created_by_name ?? "N/A",
                created_date: formatDateAndTime(item.created_date, 'date_and_time') ?? "N/A",
                action:  (
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-danger btn-sm"
                            onClick={() => {
                                showConfirm("Warning", `Are you sure you want to delete this enrolment?`, "warning")
                                    .then( async (confirm) => {
                                        if (confirm) {
                                            await handleDelete(item.enrolment_id)
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
                                <h4><List/> Enrolment List</h4>
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
        if (formData.employee_id === "") {
            await showAlert("EMPTY FIELD", "Please select employee", "error");
            return false;
        }
        if (formData.admin_id === "") {
            await showAlert("EMPTY FIELD", "Please select administrator", "error");
            return false;
        }
        if (formData.rsa_pin === "") {
            await showAlert("EMPTY FIELD", "Please enter RSA Pin", "error");
            return false;
        }

        setIsFormLoading(true);
        toast.info("please wait...");
        await axios
            .post(`${serverLink}hr/pension-admin/enrol`, formData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Employee Enrolled Successfully");
                    setIsFormLoading(false);
                    getData();
                    resetForm();
                    toggleModal();
                } else if (result.data.message === 'exist') {
                    setIsFormLoading(false);
                    showAlert("ERROR", "Employee was enrolled before. Please remove the previous enrolment", "error");
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

    const handleDelete = async (id) => {
        toast.info("please wait...");
        await axios.delete(`${serverLink}hr/pension-admin/unenrol/${id}`, token).then((res) => {
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

    const handleEmployeeSelect = (item) => {
        setFormData({...formData, employee_id: item.value})
    }

    const handleAdminSelect = (item) => {
        setFormData({...formData, admin_id: item.value})
    }

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_pension_enrolment').length < 1) {
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
                                <Breadcrumbs title='Pension Enrolment' data={[{title: 'HR Pension'}, {title: 'Pension Enrolment'}]}/>
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-4 d-md-block">
                                <div className="breadcrumb-right dropdown d-flex float-end">

                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleModal();
                                        setFormData(initialValue)
                                    }}>
                                        <Plus size={14}/> Enrol
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>

                            <MiddleModal title={"Pension Enrolment Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <div className="row">
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Select Employee</label>
                                        <Select
                                            id='employee_id'
                                            onChange={handleEmployeeSelect}
                                            isClearable={false}
                                            options={
                                                employeeList.length > 0 ?
                                                    employeeList.map(r=> { return {
                                                        value: r.employee_id,
                                                        label: `${r.employee_name} (${r.position}, ${r.agency_name})`,
                                                    } }) : []
                                            }
                                            className='react-select select-borderless'
                                            classNamePrefix='select'
                                        />
                                    </div>

                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Administrator Name</label>
                                        <Select
                                            id='admin_name'
                                            onChange={handleAdminSelect}
                                            isClearable={false}
                                            options={
                                                adminList.length > 0 ?
                                                    adminList.map(r=> { return {
                                                        value: r.admin_id,
                                                        label: r.admin_name,
                                                    } }) : []
                                            }
                                            className='react-select select-borderless'
                                            classNamePrefix='select'
                                        />
                                    </div>

                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">RSA Pin</label>
                                        <input
                                            type={'text'}
                                            className="form-control"
                                            id="rsa_pin"
                                            value={formData.rsa_pin}
                                            onChange={onEdit}
                                            placeholder="Enter RSA PIN"
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

export default connect(mapStateToProps, mapDispatchToProps)(PensionEnrolment)