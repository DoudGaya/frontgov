import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import MiddleModal from "@src/component/common/modal/middle-modal";
import {setGeneralDetails} from '@store/actions';
import {Button, Spinner} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";

function PensionSettings({loginData}) {
    const token = loginData[0]?.token;
    const user_id = loginData[0]?.user_id;
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true);
    const [IsFormLoading, setIsFormLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal);
    const initialValue = {
        settings_id: "", employee_contribution: "", employer_contribution: "", created_by: user_id, updated_by: user_id
    }
    const [formData, setFormData] = useState(initialValue);
    const [tableData, setTableData] = useState({
        employer_contribution: "", employee_contribution: "", created_by: "", created_date: "", updated_by: "", updated_date: ""
    });

    const getData = async () => {
        await axios.get(`${serverLink}hr/pension-settings/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    const output = data.data;
                    if (output.length > 0) {
                        const d = output[0]
                        setTableData({
                            ...tableData,
                            employee_contribution: d.employee_contribution,
                            employer_contribution: d.employer_contribution,
                            created_by: d.created_by_name,
                            created_date: d.created_date,
                            updated_by: d.updated_by_name,
                            updated_date: d.updated_date,
                        })
                        setFormData({
                            ...formData,
                            employee_contribution: d.employee_contribution,
                            employer_contribution: d.employer_contribution,
                            settings_id: d.settings_id
                        })
                    }
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const onSubmit = async () => {
        if (formData.employee_contribution.toString().trim() === "") {
            await showAlert("EMPTY FIELD", "Please enter employee contribution", "error");
            return false;
        }
        if (formData.employer_contribution.toString().trim() === "") {
            await showAlert("EMPTY FIELD", "Please enter employer contribution", "error");
            return false;
        }

        setIsFormLoading(true);
        await axios
            .patch(`${serverLink}hr/pension-settings/update`, formData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Settings Updated Successfully");
                    setIsFormLoading(false);
                    getData();
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

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_pension_settings').length < 1) {
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
                                <Breadcrumbs title='Pension Settings' data={[{title: 'HR Pension'}, {title: 'Pension Settings'}]}/>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
                            {
                                tableData.employee_contribution !== "" &&
                                <div>
                                    <table className="table table-striped">
                                        <tbody>
                                        <tr>
                                            <th>Employee Contribution</th>
                                            <td>{tableData.employee_contribution}%</td>
                                        </tr>
                                        <tr>
                                            <th>Employer Contribution</th>
                                            <td>{tableData.employer_contribution}%</td>
                                        </tr>
                                        <tr>
                                            <th>Modified By</th>
                                            <td>{tableData.updated_by}</td>
                                        </tr>
                                        <tr>
                                            <th>Modified Date</th>
                                            <td>{formatDateAndTime(tableData.updated_date, 'date_and_time')}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <Button type="button" className={'m-2'} onClick={toggleModal} size="lg" variant="de-primary">
                                        Update
                                    </Button>
                                </div>
                            }


                            <MiddleModal title={"Pension Settings Management Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <div className="row">
                                    <div className="mb-3 form-group col-md-12">
                                        <label className="form-label">Employee Contribution (% of Basic Salary)</label>
                                        <input
                                            type={'number'}
                                            step={0.01}
                                            className="form-control"
                                            id="employee_contribution"
                                            value={formData.employee_contribution}
                                            onChange={onEdit}
                                            placeholder="Employee Contribution"
                                        />
                                    </div>

                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Employer Contribution (% of Basic Salary)</label>
                                        <input
                                            type={'number'}
                                            step={0.01}
                                            className="form-control"
                                            id="employer_contribution"
                                            value={formData.employer_contribution}
                                            onChange={onEdit}
                                            placeholder="Employer Contribution"
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

export default connect(mapStateToProps, mapDispatchToProps)(PensionSettings)