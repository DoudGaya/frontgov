import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, formatDate, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import {setGeneralDetails} from '@store/actions';
import {useNavigate} from "react-router-dom";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import DataTable from "@src/component/common/Datatable/datatable";
import {Edit2, Plus} from "react-feather";
import MiddleModal from "@src/component/common/modal/middle-modal";
import AllowanceAndDeductionForm from "@src/views/human-resources/payroll/allowance/allowance-form";
import {toast} from "react-toastify";

function SalaryAllowance({loginData}) {
    const token = loginData[0]?.token;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [IsFormLoading, setIsFormLoading] = useState(false)
    const [ledgerList, setLedgerList] = useState([]);
    const [allowanceList, setAllowanceList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const header = ["S/N", "Employee ID", "Employee Name", "Post Type", "Ledger Acct", "Start", "End", "Frequency", "Amount", "Status", "Modified By", "Modified Date", "Action"];

    const initialValue = {
        entry_id: "", employee_id: "", ledger_id: "", post_type: "", start_date: "", end_date: "", frequency: "", amount: "",
        status: "", created_by: loginData[0]?.user_id, updated_by: loginData[0]?.user_id
    }
    const [formData, setFormData] = useState(initialValue);

    const resetForm = () => {
        setFormData(initialValue)
    }

    const getData = async () => {
        await axios.get(`${serverLink}hr/salary/allowance-and-deduction/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setLedgerList(data.ledger_list)
                    setAllowanceList(data.allowance_list)
                    setEmployeeList(data.employee_list)
                    showTable(data.allowance_list, data.ledger_list)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (dataset, ledgers) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                const ledger_name = ledgers.filter(e => e.ledger_id === item.ledger_id).length > 0 ?
                    ledgers.filter(e => e.ledger_id === item.ledger_id)[0].description : '--'
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.staff_id}</td>
                        <td>{item.employee_name}</td>
                        <td>{item.post_type}</td>
                        <td>{ledger_name}</td>
                        <td>{formatDateAndTime(item.start_date, 'month_and_year')}</td>
                        <td>{formatDateAndTime(item.end_date, 'month_and_year')}</td>
                        <td>{item.frequency}</td>
                        <td>{currencyConverter(item.amount)}</td>
                        <td>{item.status}</td>
                        <td>{item.updated_by_name}</td>
                        <td>{formatDateAndTime(item.updated_date, 'date')}</td>
                        <td>
                            <a href="#" className={"btn btn-primary btn-sm mb-1"} style={{marginRight: 2}}
                               onClick={() => {
                                   setFormData({
                                       ...formData,
                                       entry_id: item.entry_id,
                                       employee_id: item.employee_id,
                                       ledger_id: item.ledger_id,
                                       post_type: item.post_type,
                                       start_date: formatDate(item.start_date),
                                       end_date: formatDate(item.end_date),
                                       frequency: item.frequency,
                                       amount: item.amount,
                                       status: item.status
                                   });
                                   toggleModal();
                               }}>
                                <Edit2 size={10} />
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
        if (formData.employee_id === "") {
            await showAlert("EMPTY FIELD", "Please select employee", "error");
            return false;
        }
        if (formData.post_type === "") {
            await showAlert("EMPTY FIELD", "Please enter post type", "error");
            return false;
        }
        if (formData.ledger_id === "") {
            await showAlert("EMPTY FIELD", "Please select ledger account", "error");
            return false;
        }
        if (formData.frequency === "") {
            await showAlert("EMPTY FIELD", "Please select frequency", "error");
            return false;
        }
        if (formData.start_date === "") {
            await showAlert("EMPTY FIELD", "Please select start date", "error");
            return false;
        }
        if (formData.end_date === "") {
            await showAlert("EMPTY FIELD", "Please select end date", "error");
            return false;
        }
        if (formData.status === "") {
            await showAlert("EMPTY FIELD", "Please select status", "error");
            return false;
        }
        if (formData.amount === "") {
            await showAlert("EMPTY FIELD", "Please enter amount", "error");
            return false;
        }

        setIsFormLoading(true);
        toast.info("please wait...");

        if (formData.entry_id === "") {
            await axios
                .post(`${serverLink}hr/salary/allowance-and-deduction/add`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Record Submitted Successfully");
                        setIsFormLoading(false);
                        getData();
                        resetForm();
                        toggleModal();
                    } else if (result.data.message === 'exist') {
                        setIsFormLoading(false);
                        showAlert("ERROR", "This record already exist", "error");
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
        else {
            await axios
                .patch(`${serverLink}hr/salary/allowance-and-deduction/update`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Record Updated Successfully");
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
    }

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_payroll_allowance').length < 1) {
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
                                <Breadcrumbs title='Manage Allowance & Deduction' data={[{title: 'HR Payroll'}, {title: 'Payroll Allowance'}]}/>
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-4 d-md-block">
                                <div className="breadcrumb-right dropdown d-flex float-end">

                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleModal();
                                        setFormData(initialValue)
                                    }}>
                                        <Plus size={14}/> Add New
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
                            <div className="table-responsive">
                                <DataTable
                                    tableID="table1"
                                    header={header}
                                    body={showTable(allowanceList, ledgerList)}
                                    title="Manage Allowance and Deduction"
                                />
                            </div>
                        </div>
                        <MiddleModal title={"Manage Allowance & Deduction"} size={'modal-xl'} open={showModal} toggleSidebar={toggleModal}>
                            <AllowanceAndDeductionForm
                                formData={formData}
                                setFormData={setFormData}
                                IsFormLoading={IsFormLoading}
                                employeeList={employeeList}
                                ledgerList={ledgerList}
                                onEdit={onEdit}
                                onSubmit={onSubmit}
                                toggleModal={toggleModal}
                            />
                        </MiddleModal>
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

export default connect(mapStateToProps, mapDispatchToProps)(SalaryAllowance)