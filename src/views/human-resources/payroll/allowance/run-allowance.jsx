import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import {setGeneralDetails} from '@store/actions';
import {useNavigate} from "react-router-dom";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import DataTable from "@src/component/common/Datatable/datatable";
import MiddleModal from "@src/component/common/modal/middle-modal";
import {toast} from "react-toastify";
import {Button, Spinner} from "reactstrap";

function RunSalaryAllowance({loginData}) {
    const token = loginData[0]?.token;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [IsFormLoading, setIsFormLoading] = useState(false)
    const [canSubmit, setCanSubmit] = useState(false);
    const [allowanceList, setAllowanceList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const header = ["S/N", "Employee ID", "Employee Name", "Post Type", "Ledger Acct", "Start", "End", "Frequency", "Amount"];

    const [formData, setFormData] = useState({salary_date: ""});

    const getData = async () => {
        await axios.get(`${serverLink}hr/salary/active-allowance-and-deduction`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setAllowanceList(data.data)
                    showTable(data.data)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (dataset) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.staff_id}</td>
                        <td>{item.employee_name}</td>
                        <td>{item.post_type}</td>
                        <td>{item.description}</td>
                        <td>{formatDateAndTime(item.start_date, 'month_and_year')}</td>
                        <td>{formatDateAndTime(item.end_date, 'month_and_year')}</td>
                        <td>{item.frequency}</td>
                        <td>{currencyConverter(item.amount)}</td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    const onEdit = (e) => {
        const salary_date = e.target.value;
        setFormData({...formData, salary_date: salary_date});
        if (salary_date !== "") {
            setCanSubmit(false)
            const sendData = {salary_date: salary_date};
            toast.info("please wait...");
            axios.post(`${serverLink}hr/salary/check-if-allowance-run`, sendData, token)
                .then(result => {
                    if (result.data.data > 0) {
                        showAlert("DUPLICATE", `Allowance and deduction already ran for ${e.target.value}`, "error");
                        setCanSubmit(false)
                    } else {
                        setCanSubmit(true);
                    }
                })
                .catch(err => {
                    console.log('NETWORK ERROR', err)
                })
        }

    }

    const onSubmit = async () => {
        setIsFormLoading(true);
        const sendData = {
            salary_date: formData.salary_date,
            items: allowanceList,
            created_by: loginData[0]?.user_id
        }
        await axios
            .post(`${serverLink}hr/salary/allowance-and-deduction/run`, sendData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Allowance and Deduction Submitted Successfully");
                    setIsFormLoading(false);
                    getData();
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

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_payroll_run_allowance').length < 1) {
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
                        </div>
                        <div className='blog-wrapper'>
                            <div className="table-responsive">
                                {
                                    allowanceList.length > 0 &&
                                    <div
                                        className="d-flex no-block justify-content-end align-items-center m-b-30 mt-3">
                                        <div className="ml-auto">
                                            <div className="btn-group">
                                                <Button type="button" className="btn btn-info mb-3"
                                                        variant="de-primary"
                                                        onClick={() => {
                                                            setFormData({...formData, salary_date: ""})
                                                            setCanSubmit(false);
                                                            setShowModal(true)
                                                            setIsFormLoading(false)
                                                        }}>
                                                    <i className="fa fa-plus"></i> Run Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <DataTable
                                    tableID="table1"
                                    header={header}
                                    body={showTable(allowanceList)}
                                    title="Run Allowance and Deduction"
                                />
                            </div>
                        </div>
                        <MiddleModal title={"Manage Allowance & Deduction"} size={'modal-xl'} open={showModal} toggleSidebar={toggleModal}>
                            <div>
                                <div className="mb-3 form-group col-md-12">
                                    <label className="form-label">Select Salary Date</label>
                                    <input type={'month'} className="form-control" id="salary_date" value={formData.salary_date} onChange={onEdit} />
                                </div>
                                {
                                    canSubmit ?
                                        IsFormLoading ?
                                            <Button className={'btn btn-info w-100'} disabled>
                                                <Spinner className="spinner-grow-sm me-1" tag="span" color="white" type="grow"/>
                                                Processing...
                                            </Button>
                                            :
                                            <Button type="button" onClick={onSubmit} className={'btn btn-success w-100'}>
                                                Run Now
                                            </Button> : ''
                                }
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RunSalaryAllowance)