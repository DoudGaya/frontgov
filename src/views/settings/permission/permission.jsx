import {connect} from "react-redux"
import {
    Edit,
    List, Plus,
} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import { serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import {Badge, Button, Card, CardBody, CardHeader, Row} from "reactstrap";
import Table from "../../../component/common/table/table";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import {useNavigate} from "react-router-dom";
import Select from "react-select";

const permission_list = [
    "dashboard_super_admin", "dashboard_admin", "dashboard_officer", "fund_request_module", "fund_request", "fund_request_secretariat", "fund_request_calender", "finance_module",
    "finance_account", "finance_general_ledger", "finance_ledger_branch", "finance_ledger_entry", "finance_ledger_document", "finance_fund_request",
    "finance_year", "finance_journal", "finance_payment_request", "finance_report_module", "budget_module", "budget_manager", "fund_request_calender",
    "budget_my_budget", "inventory_module", "inventory_item", "inventory_audit", "inventory_category", "inventory_inventory",
    "inventory_manufacturer", "inventory_my_request", "inventory_order", "inventory_requests", "transaction", "inventory_vendor",
    "settings_module", "settings_user_manager", "settings_agency_manager", "settings_user_position", "settings_permission", "finance_report_general_ledger",
    "finance_report_balance_sheet", "finance_report_bank_reconciliation", "finance_report_income_statement", "finance_report_trial_balance",
    "finance_report_fund_request", "finance_payment_report", "hr_manager", "hr_employee_profile", "hr_employee_transfer_request", "employee_manager", "pension_manager", "salary_manager",
    "hr_payroll", "hr_payroll_settings", "hr_payroll_allowance", "hr_payroll_run_allowance", "hr_payroll_post_schedule", "hr_payroll_allowance_report",
    "hr_payroll_salary_report", "hr_payroll_bank_payment",
    "hr_pension", "hr_pension_settings", "hr_pension_administration", "hr_pension_enrolment", "hr_pension_report",
]
let permission_options = [];
permission_list.map((item) => {
    permission_options.push({value: item, label: item})
})

function PermissionRole(props) {
    const token = props.loginData[0]?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate()
    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "Role Name",
                field: "role_name",
            },
            {
                label: "Permissions",
                field: "permissions",
            },
            {
                label: "action",
                field: "action"
            },
        ],
        rows: [],
    });
    const initialFormValues = {
        user_id: "",
        permission_id: "",
        role_id: "",
        role_name: "",
        description: "",
        permission_list: [],
        created_by: props.loginData[0]?.user_id,
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }

    const getData = async () => {
        await axios.get(`${serverLink}hr/permission-role/list`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data, result.data.permissions)
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("NETWORK ERROR");
            });
    };

    const generateTable = (table_data, permissions) => {
        let rowData = [];
        table_data.map((item, index)=> {
            let perms = [];
            const permission_list = permissions.filter(r=>r.role_id === item.role_id)
            if (permission_list.length > 0) {
                permission_list.map((p) => {
                    perms.push({value: p.permission, label: p.permission})
                })
            }
            rowData.push({
                sn: index + 1,
                role_name: item.role_name ?? "N/A",
                permissions: (
                    permission_list === 0 ? '--' :
                        permission_list.map((p,index) => {
                            return <Badge key={index} color={'primary'} pill className="mb-1">{p.permission}</Badge>
                        })
                ),
                action:  (
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-success btn-sm"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    role_id: item.role_id,
                                    role_name: item.role_name,
                                    description: item.description,
                                    permission_list: perms
                                })
                                setModalOpen(true);
                            }} style={{marginRight: '5px'}}>
                            <Edit size={11}/>
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
    const onSubmit = async (e) => {
        e.preventDefault();
        if (formData.role_name.toString().trim() === "") {
            toast.error("Please enter role name");
            return false;
        }

        if (formData.role_id === "") {
            setIsFormLoading(true);
            await axios.post(`${serverLink}hr/permission-role/add`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Permission Role Added Successfully");
                    setIsFormLoading(false)
                    getData()
                    toggleSidebar()
                    resetForm()
                } else if (result.data.message === "exist") {
                    toast.error("Permission Role already exist!");
                    setIsFormLoading(false)
                } else {
                    toast.error(result.data.message);
                    setIsFormLoading(false)
                }
            }).catch((error) => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
        } else {
            setIsFormLoading(true);
            await axios.patch(`${serverLink}hr/permission-role/update`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Permission Role Updated Successfully");
                    setIsFormLoading(false)
                    getData()
                    toggleSidebar()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                    setIsFormLoading(false)
                }
            }).catch((error) => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
        }
    }

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const DocumentData = () => {
        return (
            <Card>
                <CardHeader>
                    <div className="card-toolbar col-md-12 col-12 p-0">
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className="col-md-4">
                                <h4><List/> Permission Role</h4>
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
    const toggleSidebar = () => setModalOpen(!modalOpen)

    const onPermissionChange = (e) => {
        setFormData({
            ...formData,
            permission_list: e
        })
    }
    useEffect(() => {
        if (props.loginData[0].permission.filter(e=>e.permission === 'settings_permission').length < 1) {
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
                                <Breadcrumbs title='Permission' data={[{title: 'Settings'}, {title: 'Permission'}]} />
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                <div className="breadcrumb-right dropdown">
                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleSidebar();
                                        resetForm();
                                    }}>
                                        <Plus size={14}/> Add Role
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>
                            <MiddleModal title={"Role Form"} size={'modal-lg'} open={modalOpen} toggleSidebar={toggleSidebar}>
                                <form>
                                    <div className="form-group mb-1">
                                        <label className='form-label'>Role Name</label>
                                        <input type="text" name="role_name" id="role_name" className="form-control"
                                               value={formData.role_name}
                                               onChange={onEdit}/>
                                    </div>
                                    <div className="form-group mb-1">
                                        <label className='form-label'>Description</label>
                                        <textarea name="description" id="description" rows={3} cols={3}
                                                  className="form-control" value={formData.description}
                                                  onChange={onEdit}></textarea>
                                    </div>
                                    <div className=" form-group mb-1">
                                        <label className="form-label">Select Permission</label>
                                        <Select
                                            isMulti
                                            isSearchable
                                            options={permission_options}
                                            name="permission"
                                            id="permission"
                                            value={formData.permission_list}
                                            onChange={onPermissionChange}
                                        />

                                    </div>
                                    <div className="mt-3">
                                        {
                                            isFormLoading ?
                                                <button className="btn btn-outline-primary disabled"
                                                        style={{marginRight: '10px'}}>
                                                    <div role="status"
                                                         className="spinner-border-sm spinner-border"><span
                                                        className="visually-hidden">Loading...</span></div>
                                                    <span className="ms-50">Loading...</span></button>
                                                :
                                                <Button type='button' className='me-1' color='primary'
                                                        onClick={onSubmit}>
                                                    Submit
                                                </Button>
                                        }
                                        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
                                            Cancel
                                        </Button>
                                    </div>

                                </form>
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

export default connect(mapStateToProps, null)(PermissionRole)