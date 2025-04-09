import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import {setGeneralDetails} from '@store/actions';
import {useNavigate} from "react-router-dom";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import Select from "react-select";

function EmployeeProfile({loginData}) {
    const token = loginData[0]?.token;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [employeeList, setEmployeeList] = useState([]);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const getData = async () => {
        await axios.get(`${serverLink}hr/employee-profile/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setEmployeeList(data.employee_list)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const handleEmployeeSelect = (item) => {
        console.log(item.data)
        setSelectedEmployee(item.data)
    }

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_employee_profile').length < 1) {
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
                                <Breadcrumbs title='Employee Profile' data={[{title: 'HR Manager'}, {title: 'Employee Profile'}]}/>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
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
                                                    data: r,
                                                } }) : []
                                        }
                                        className='react-select select-borderless'
                                        classNamePrefix='select'
                                    />
                                </div>
                            </div>
                            <hr/>

                            {
                                selectedEmployee !== null &&
                                <div className="row">
                                    <div className="mb-2 col-md-6 table-responsive">
                                        <h3 className={'text-center'}>Personal Info</h3>
                                        <table className="table table-responsive">
                                            <tbody>
                                            <tr>
                                                <th>Jigawa ID</th>
                                                <td>{selectedEmployee.jigawa_id}</td>
                                            </tr>
                                            <tr>
                                                <th>Title</th>
                                                <td>{selectedEmployee.title}</td>
                                            </tr>
                                            <tr>
                                                <th>First Name</th>
                                                <td>{selectedEmployee.first_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Middle Name</th>
                                                <td>{selectedEmployee.middle_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Surname</th>
                                                <td>{selectedEmployee.surname}</td>
                                            </tr>
                                            <tr>
                                                <th>Gender</th>
                                                <td>{selectedEmployee.gender}</td>
                                            </tr>
                                            <tr>
                                                <th>Date of Birth</th>
                                                <td>{formatDateAndTime(selectedEmployee.dob, 'date')}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mb-2 col-md-6 table-responsive">
                                        <h3 className={'text-center'}>Contact/Address Info</h3>
                                        <table className="table table-responsive">
                                            <tbody>
                                            <tr>
                                                <th>State of Origin</th>
                                                <td>{selectedEmployee.state_of_origin}</td>
                                            </tr>
                                            <tr>
                                                <th>LGA</th>
                                                <td>{selectedEmployee.lga}</td>
                                            </tr>
                                            <tr>
                                                <th>Ward</th>
                                                <td>{selectedEmployee.ward}</td>
                                            </tr>
                                            <tr>
                                                <th>Address</th>
                                                <td>{selectedEmployee.address}</td>
                                            </tr>
                                            <tr>
                                                <th>Maiden Name</th>
                                                <td>{selectedEmployee.maiden_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Marital Status</th>
                                                <td>{selectedEmployee.marital_status}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone/Email</th>
                                                <td>{selectedEmployee.phone_number} / {selectedEmployee.email_address}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mb-2 col-md-6 table-responsive">
                                        <h3 className={'text-center'}>Employment Info</h3>
                                        <table className="table table-responsive">
                                            <tbody>
                                            <tr>
                                                <th>Agency/Ministry</th>
                                                <td>{selectedEmployee.agency_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Employment Status</th>
                                                <td>{selectedEmployee.employment_status}</td>
                                            </tr>
                                            <tr>
                                                <th>Position</th>
                                                <td>{selectedEmployee.position}</td>
                                            </tr>
                                            <tr>
                                                <th>Highest Qualification</th>
                                                <td>{selectedEmployee.highest_qualification}</td>
                                            </tr>
                                            <tr>
                                                <th>Employment Type</th>
                                                <td>{selectedEmployee.employment_type}</td>
                                            </tr>
                                            <tr>
                                                <th>Date of First Appointment</th>
                                                <td>{formatDateAndTime(selectedEmployee.date_of_first_appointment, 'date')}</td>
                                            </tr>
                                            <tr>
                                                <th>Date of Current Appointment</th>
                                                <td>{formatDateAndTime(selectedEmployee.date_of_current_appointment, 'date')}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mb-2 col-md-6 table-responsive">
                                        <h3 className={'text-center'}>Next of Kin / Bank / Reg Info</h3>
                                        <table className="table table-responsive">
                                            <tbody>
                                            <tr>
                                                <th>Next of Kin</th>
                                                <td>{selectedEmployee.nok_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Relationship</th>
                                                <td>{selectedEmployee.nok_relationship}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone Number</th>
                                                <td>{selectedEmployee.nok_phone_number}</td>
                                            </tr>
                                            <tr>
                                                <th>Bank Info</th>
                                                <td>{selectedEmployee.bank_account_name} / {selectedEmployee.bank_account_no}</td>
                                            </tr>
                                            <tr>
                                                <th>Bank</th>
                                                <td>{selectedEmployee.bank_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Created On</th>
                                                <td>{formatDateAndTime(selectedEmployee.created_date, 'date')}</td>
                                            </tr>
                                            <tr>
                                                <th>Last Modified On</th>
                                                <td>{formatDateAndTime(selectedEmployee.updated_date, 'date')}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeProfile);