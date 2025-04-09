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
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import {Eye, List, Plus} from "react-feather";
import Table from "@src/component/common/table/table";
import Select from "react-select";

function EmployeeTransferRequest({loginData}) {
    const token = loginData[0]?.token;
    const user_id = loginData[0]?.user_id;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [IsFormLoading, setIsFormLoading] = useState(false)
    const [agencyList, setAgencyList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal);
    const initialValue = {
        transfer_id: "", employee_id: "", from_agency_code: "", to_agency_code: "", effective_date: "",
        transfer_status: "Submitted", created_by: user_id, decision_by: user_id
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
            { label: "From Agency", field: "from_agency" },
            { label: "To Agency", field: "to_agency" },
            { label: "Effective Date", field: "effective_date" },
            { label: "Status", field: "status" },
            { label: "Decision By", field: "decision_by" },
            { label: "Decision Date", field: "decision_date" },
            { label: "Created By", field: "created_by" },
            { label: "Created Date", field: "created_date" },
            { label: "Action", field: "action" },
        ],
        rows: [],
    });

    const [showActionModal, setShowActionModal] = useState(false)
    const toggleActionModal = () => setShowActionModal(!showActionModal);
    const [actionFormData, setActionFormData] = useState(
        { transfer_id: "", transfer_status: "", decision_by: user_id, effective_date: "" }
    );

    const getData = async () => {
        await axios.get(`${serverLink}hr/transfer-request/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setAgencyList(data.agency_list)
                    setEmployeeList(data.employee_list)
                    generateTable(data.transfer_list)
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
                staff_id: item.staff_id ?? "N/A",
                employee_name: item.employee_name,
                from_agency: item.from_agency_name,
                to_agency: item.to_agency_name,
                effective_date: formatDateAndTime(item.effective_date, 'short_date') ?? "N/A",
                status: item.transfer_status ?? "N/A",
                decision_by: item.decision_by_name ?? "N/A",
                created_by: item.created_by_name ?? "N/A",
                decision_date: formatDateAndTime(item.decision_date, 'short_date') ?? "N/A",
                created_date: formatDateAndTime(item.created_date, 'short_date') ?? "N/A",
                action: item.decision_by === null
                    ?
                    (
                        <div className="d-flex">
                            <button
                                className="btn btn-sm btn-primary btn-sm"
                                onClick={() => {
                                    setActionFormData({
                                        ...actionFormData,
                                        transfer_id: item.transfer_id,
                                        employee_id: item.employee_id,
                                        agency_code: item.to_agency_code,
                                        transfer_status: "",
                                        effective_date: "",
                                    })
                                    setShowActionModal(true);
                                }} style={{marginRight: '5px'}}>
                                <Eye size={11}/>
                            </button>
                        </div>
                    )
                    : '--',
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
                                <h4><List/> Transfer List</h4>
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

    const handleEmployeeSelect = (item) => {
        setFormData({...formData, employee_id: item.value, from_agency_code: item.agency_code})
    }

    const handleAgencySelect = (item) => {
        setFormData({...formData, to_agency_code: item.value})
    }

    const onSubmit = async () => {
        if (formData.employee_id === "") { await showAlert("EMPTY FIELD", "Please select employee", "error");return false;}

        if (formData.to_agency_code.toString().trim() === "") {await showAlert("EMPTY FIELD", "Please select the agency", "error");return false;}

        if (formData.to_agency_code === formData.from_agency_code) {await showAlert("EMPTY FIELD", "Employee is already a staff of the selected agency", "error");return false;}

        setIsFormLoading(true);
        toast.info("Submitting...");
        await axios
            .post(`${serverLink}hr/transfer-request/add`, formData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Transfer Request Submitted Successfully");
                    setIsFormLoading(false);
                    getData();
                    resetForm();
                    toggleModal();
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

    const onSubmitAction = async () => {
        if (actionFormData.transfer_status === "") { await showAlert("EMPTY FIELD", "Please select transfer status", "error");return false;}

        if (actionFormData.transfer_status === "Approved") {
            if (actionFormData.effective_date === "") {await showAlert("EMPTY FIELD", "Please enter the transfer effective date", "error");return false;}
        }

        setIsFormLoading(true);
        toast.info("Submitting...");
        await axios
            .patch(`${serverLink}hr/transfer-request/action`, actionFormData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Action Submitted Successfully");
                    setIsFormLoading(false);
                    getData();
                    toggleActionModal();
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

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_employee_transfer_request').length < 1) {
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
                                <Breadcrumbs title='Transfer Request' data={[{title: 'HR Manager'}, {title: 'Transfer Request'}]}/>
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-4 d-md-block">
                                <div className="breadcrumb-right dropdown d-flex float-end">

                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleModal();
                                        setFormData(initialValue)
                                    }}>
                                        <Plus size={14}/> Add Request
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>

                            <MiddleModal title={"Pension Administrator Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
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
                                                        agency_code: r.agency_code,
                                                    } }) : []
                                            }
                                            className='react-select select-borderless'
                                            classNamePrefix='select'
                                        />
                                    </div>

                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Select Agency</label>
                                        <Select
                                            id='employee_id'
                                            onChange={handleAgencySelect}
                                            isClearable={false}
                                            options={
                                                agencyList.length > 0 ?
                                                    agencyList.map(r=> { return {
                                                        value: r.agency_code,
                                                        label: r.agency_name,
                                                    } }) : []
                                            }
                                            className='react-select select-borderless'
                                            classNamePrefix='select'
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

                            <MiddleModal title={"Action Form"} size={'modal-lg'} open={showActionModal} toggleSidebar={toggleActionModal}>
                                <div className="row">
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Select Transfer Status</label>
                                        <select
                                            className={'form-control'}
                                            value={actionFormData.transfer_status}
                                            onChange={
                                                (e) => {
                                                    setActionFormData({...actionFormData, transfer_status: e.target.value});
                                                }
                                            }
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Approved">Approve</option>
                                            <option value="Rejected">Reject</option>
                                        </select>
                                    </div>

                                    {
                                        actionFormData.transfer_status === 'Approved' &&
                                        <div className="mb-1 form-group col-md-12">
                                            <label className="form-label">Select Effective Date</label>
                                            <input
                                                type={'date'}
                                                className="form-control"
                                                id="contact_email"
                                                value={actionFormData.effective_date}
                                                onChange={
                                                    (e) => {
                                                        setActionFormData({...actionFormData, effective_date: e.target.value});
                                                    }
                                                }
                                                placeholder="Enter Transfer Effective Date"
                                            />
                                        </div>
                                    }

                                </div>
                                <div className="form-group col-md-12">
                                    {
                                        IsFormLoading ?
                                            <Button variant="de-primary" disabled>
                                                <Spinner className="spinner-grow-sm me-1" tag="span" color="white" type="grow" />
                                                Submitting...
                                            </Button>
                                            :
                                            <Button type="button" onClick={onSubmitAction} size="lg" variant="de-primary">
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeTransferRequest);