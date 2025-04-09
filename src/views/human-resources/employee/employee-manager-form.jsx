import {Button} from "reactstrap";
import {toast} from "react-toastify";
import axios from "axios";
import {
    formatDate,
    jigawaOneAPIKey,
    jigawaOneAPILink,
    jigawaOneAPIPassport,
    serverLink
} from "@src/resources/constants";
import {useEffect, useState} from "react";
import Select from "react-select";
import {StateData} from "@src/resources/state_data";
import {bank_list} from "@src/resources/bank_list";
const titles = ["Admire", "Ambassador", "Baron", "Baroness", "Bishop", "Brigadier", "Brother", "Canon", "Captain", "Chief", "Colonel", "Commander", "Commodore", "Count", "Countess", "Dame", "Deacon", "Dean", "Dr", "Duke", "Elder", "Father", "General", "Governor", "Honourable", "Judge", "Lady", "Lord", "Madam", "Major", "Marchioness", "Marquis", "Master", "Miss", "Mister", "Monsignor", "Mother", "Mr", "Mrs", "Ms", "Pastor", "Prince", "Princess", "Professor", "Rabbi", "Reverend", "Senator", "Sergeant", "Sheikh", "Sir", "Sister", "Viscount", "Viscountess"].sort();
const state_list = [...new Set(StateData.map(item => item.StateName))];
function EmployeeManagementForm({ toggleSidebar, agencyList, reload, selectedEmployee, user_id, token }) {
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [selectedLGA, setSelectedLGA] = useState([]);
    const [selectedWard, setSelectedWard] = useState([]);
    const e = selectedEmployee;
    const initialFormValues = {
        employee_id: e !== null ? e.employee_id : "", staff_id: e !== null ? e.staff_id : "",
        jigawa_id: e !== null ? e.jigawa_id : "", title: e !== null ? e.title : "",
        first_name: e !== null ? e.first_name : "", middle_name: e !== null ? e.middle_name : "",
        surname: e !== null ? e.surname : "", agency_code: e !== null ? e.agency_code : "",
        gender: e !== null ? e.gender : "", dob: e !== null ? formatDate(e.dob) : "", state_of_origin: e !== null ? e.state_of_origin : "Jigawa",
        lga: e !== null ? e.lga : "", ward: e !== null ? e.ward : "", address: e !== null ? e.address : "",
        phone_number: e !== null ? e.phone_number : "", email_address: e !== null ? e.email_address : "",
        marital_status: e !== null ? e.marital_status : "", maiden_name: e !== null ? e.maiden_name : "",
        nok_name: e !== null ? e.nok_name : "", nok_relationship: e !== null ? e.nok_relationship : "",
        nok_phone_number: e !== null ? e.nok_phone_number : "", highest_qualification: e !== null ? e.highest_qualification : "",
        employment_status: e !== null ? e.employment_status : "", employment_type: e !== null ? e.employment_type : "", position: e !== null ? e.position : "",
        gross_pay: e !== null ? e.gross_pay : "", bank_name: e !== null ? e.bank_name : "", bank_account_no: e !== null ? e.bank_account_no : "",
        bank_account_name: e !== null ? e.bank_account_name : "", date_of_first_appointment: e !== null ? formatDate(e.date_of_first_appointment) : "",
        date_of_current_appointment: e !== null ? formatDate(e.date_of_current_appointment) : "", created_by: user_id,
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }
    let agency_options = [];
    agencyList.length > 0 && agencyList.map((item) => {
        agency_options.push({value: item.agency_code, label: item.agency_name})
    })
    const [selectedAgency, setSelectedAgency] = useState(
        e === null ? {} : { value: e.agency_code, label: e.agency_name }
    )

    const onSubmit = async (e) => {
        e.preventDefault();
        if (formData.staff_id.toString().trim() === "") { toast.error("Please enter employee's staff ID"); return false;}
        if (formData.title.toString().trim() === "") { toast.error("Please select employee's title"); return false;}
        if (formData.first_name.toString().trim() === "") { toast.error("Please enter employee's first name"); return false;}
        if (formData.surname.toString().trim() === "") { toast.error("Please enter employee's surname"); return false; }
        if (formData.agency_code === "") { toast.error("Please select employee's agency/ministry"); return false; }
        if (formData.gender === "") { toast.error("Please select employee's gender"); return false; }
        if (formData.dob === "") { toast.error("Please select employee's date of birth"); return false; }
        if (formData.phone_number === "") { toast.error("Please enter employee's phone number"); return false; }
        if (formData.state_of_origin === "") { toast.error("Please select employee's state of origin"); return false; }
        if (formData.lga === "") { toast.error("Please select employee's LGA"); return false; }
        if (formData.ward === "") { toast.error("Please select employee's ward"); return false; }
        if (formData.address === "") { toast.error("Please enter employee's address"); return false; }
        if (formData.marital_status === "") { toast.error("Please select employee's marital status"); return false; }
        if (formData.nok_name === "") { toast.error("Please enter employee's next of kin name"); return false; }
        if (formData.nok_relationship === "") { toast.error("Please enter employee's next of kin relationship"); return false; }
        if (formData.highest_qualification === "") { toast.error("Please select employee's highest qualification"); return false; }
        if (formData.employment_status === "") { toast.error("Please select employee's employment status"); return false; }
        if (formData.employment_type === "") { toast.error("Please select employee's employment type"); return false; }
        if (formData.gross_pay === "") { toast.error("Please enter employee's gross pay"); return false; }
        if (formData.date_of_first_appointment === "") { toast.error("Please select employee's date of first appointment"); return false; }
        if (formData.date_of_current_appointment === "") { toast.error("Please select employee's date of current appointment"); return false; }

        if (formData.employee_id === "") {
            setIsFormLoading(true);
            await axios.post(`${serverLink}hr/employee/add`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("User Added Successfully");
                    setIsFormLoading(false)
                    reload();
                    toggleSidebar()
                    resetForm()
                } else if (result.data.message === "exist") {
                    toast.error("Employee already exist!");
                    setIsFormLoading(false)
                } else {
                    toast.error(result.data.message);
                    setIsFormLoading(false)
                }
            }).catch(() => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
        } else {
            setIsFormLoading(true);
            await axios.patch(`${serverLink}hr/employee/update`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Employee Updated Successfully");
                    setIsFormLoading(false)
                    reload();
                    toggleSidebar()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                    setIsFormLoading(false)
                }
            }).catch(() => {
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

    const onAgencyChange = (e) => {
        setSelectedAgency(e)
        setFormData({
            ...formData,
            agency_code: e.value
        })
    }

    const handleJigawaIDVerify = async () => {
        const jigawa_id = formData.jigawa_id.toString().trim();
        if (jigawa_id === "") {
            toast.error("Please enter the employee's Jigawa ID")
            return false;
        }

        const sendData = {
            jigawa_id: jigawa_id
        }
        toast.info("Fetching...");
        const headers = {
            'api_key': jigawaOneAPIKey,
        };

        await axios.post(`${jigawaOneAPILink}all-info`, sendData, { headers })
            .then(res => {
                const status = res.data.status;
                if (status === 'success') {
                    const r = res.data.result;
                    setFormData({
                        ...formData,
                        title: r.title, first_name: r.first_name, middle_name: r.middle_name, surname: r.surname,
                        passport: `${jigawaOneAPIPassport}${r.passport}`, phone_number: r.phone_number,
                        email_address: r.email_address, gender: r.gender, dob: formatDate(r.dob), state_of_origin: "Jigawa",
                        lga: r.lga, ward: r.ward, address: r.address, marital_status: r.marital_status, maiden_name: r.maiden_name,
                        nok_name: r.nok, nok_relationship: r.nok_relationship, nok_phone_number: r.nok_phone_no
                    });
                    toast.success(res.data.message)
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => {
                console.log("Network Error", err)
                toast.error("Network Error: Try again!")
            })
    }

    useEffect(() => {
        if (formData.state_of_origin !== "") {
            setSelectedLGA([...new Set(StateData.filter(r=>r.StateName === formData.state_of_origin).map(item => item.LGAName))])
            setSelectedWard([])
        }
        if (formData.lga !== "") {
            setSelectedWard([...new Set(StateData
                .filter(r=>r.StateName === formData.state_of_origin && r.LGAName === formData.lga)
                .map(item => item.WardName))])
        }
    }, [formData.state_of_origin, formData.lga]);

    return (
        <form>
            <div className="row">
                <div className="col-md-4">
                    <h4>Personal Info</h4>
                    {
                        selectedEmployee === null ?
                            <div className="form-group mb-1">
                                <label className='form-label'>Jigawa ID</label>
                                <div className="input-group">
                                    <input type="text" id="jigawa_id" className="form-control" value={formData.jigawa_id} onChange={onEdit}/>
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-warning" type={"button"} onClick={handleJigawaIDVerify}>Verify</button>
                                    </div>
                                </div>
                            </div> :
                            <div className="form-group mb-1">
                                <label className='form-label'>Jigawa ID</label>
                                <input type="text" id="jigawa_id" className="form-control" value={formData.jigawa_id} onChange={onEdit}/>
                            </div>
                    }


                    <div className="form-group mb-1">
                        <label className='form-label'>Employee ID <span className={'text-danger'}>*</span></label>
                        <input type="text" id="staff_id" className="form-control" value={formData.staff_id}
                               onChange={onEdit}/>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Title <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="title" value={formData.title}
                                onChange={onEdit}>
                            <option value="">Select Title</option>
                            {
                                titles.map((item, index) => (<option key={index} value={item}>{item}</option>))
                            }
                        </select>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>First Name <span className={'text-danger'}>*</span></label>
                        <input type="text" id="first_name" className="form-control" value={formData.first_name}
                               onChange={onEdit}/>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Middle Name</label>
                        <input type="text" id="middle_name" className="form-control" value={formData.middle_name}
                               onChange={onEdit}/>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Surname <span className={'text-danger'}>*</span></label>
                        <input type="text" id="surname" className="form-control" value={formData.surname}
                               onChange={onEdit}/>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Gender <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="gender" value={formData.gender}
                                onChange={onEdit}>
                            <option value="">Select Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Date of Birth <span className={'text-danger'}>*</span></label>
                        <input type="date" id="dob" className="form-control" value={formData.dob} onChange={onEdit}/>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Marital Status <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="marital_status" value={formData.marital_status}
                                onChange={onEdit}>
                            <option value="">Select Marital Status</option>
                            {
                                ["Divorced", "Married", "Separated", "Single", "Widowed"].map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Maiden Name </label>
                        <input type="text" id="maiden_name" className="form-control" value={formData.maiden_name}
                               onChange={onEdit}/>
                    </div>
                </div>

                <div className="col-md-4">
                    <h4>Address & Contact Info</h4>
                    <div className="form-group mb-1">
                        <label className='form-label'>Phone Number <span className={'text-danger'}>*</span></label>
                        <input type="tel" id="phone_number" className="form-control" value={formData.phone_number} onChange={onEdit}/>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Email Address</label>
                        <input type="email" id="email_address" className="form-control" value={formData.email_address} onChange={onEdit}/>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>State of Origin <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="state_of_origin" value={formData.state_of_origin} onChange={onEdit}>
                            <option value="">Select State of Origin</option>
                            {
                                state_list.map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Local Government <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="lga" value={formData.lga} onChange={onEdit}>
                            <option value="">Select LGA</option>
                            {
                                selectedLGA.map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group mb-1">
                        <label className='form-label'>Ward <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="ward" value={formData.ward} onChange={onEdit}>
                            <option value="">Select Ward</option>
                            {
                                selectedWard.map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group mb-1">
                        <label className='form-label'>Address <span className={'text-danger'}>*</span></label>
                        <input type="text" id="address" className="form-control" value={formData.address} onChange={onEdit}/>
                    </div>

                    <div className="form-group mb-1">
                        <label className='form-label'>Next of Kin <span className={'text-danger'}>*</span></label>
                        <input type="text" id="nok_name" className="form-control" value={formData.nok_name} onChange={onEdit}/>
                    </div>

                    <div className="form-group mb-1">
                        <label className='form-label'>Next of Phone Number</label>
                        <input type="text" id="nok_phone_number" className="form-control" value={formData.nok_phone_number} onChange={onEdit}/>
                    </div>

                    <div className="form-group mb-1">
                        <label className='form-label'>Relationship <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="nok_relationship" value={formData.nok_relationship} onChange={onEdit}>
                            <option value="">Select Next of Kin Relationship</option>
                            {
                                ["Brother", "Daughter", "Father", "Mother", "Nephew", "Niece", "Sister", "Son", "Spouse", "Uncle", "Aunt", "Cousin", "Guardian", "Grandfather", "Grandmother"].map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className={`form-group  mb-1`}>
                        <label className='form-label'>Highest Qualification <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="highest_qualification" value={formData.highest_qualification} onChange={onEdit}>
                            <option value="">Select Highest Qualification</option>
                            {
                                ["Doctorate (PhD)", "Master's Degree", "Bachelor's Degree", "Higher National Diploma (HND)", "National Diploma (ND)", "NCE (Nigeria Certificate in Education)", "Secondary School Certificate", "Primary School Certificate", "No Formal Education"].map((item, index) => (
                                    <option key={index} value={item}>{item}</option>))
                            }
                        </select>
                    </div>

                </div>

                <div className="col-md-4">
                    <h4>Work Info</h4>
                    <div className="form-group mb-1">
                        <label className='form-label'>Select Agency/Ministry <span className={'text-danger'}>*</span></label>
                        <Select
                            isSearchable
                            options={agency_options}
                            name="agency_code"
                            id="agency_code"
                            value={selectedAgency}
                            onChange={onAgencyChange}
                        />
                    </div>

                    <div className={`form-group  mb-1`}>
                        <label className='form-label'>Position/Rank <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="position" value={formData.position}
                                onChange={onEdit}>
                            <option value="">Select Position</option>
                            {
                                ["Assistant Director", "Chief Accountant", "Chief Administrative Officer", "Chief Auditor", "Chief Executive Officer", "Chief Medical Officer", "Commissioner", "Deputy Director", "Deputy Governor", "Director", "Executive Officer", "Graduate Assistant", "Governor", "Head of Department", "Junior Clerk", "Lecturer I", "Lecturer II", "Permanent Secretary", "Principal Accountant", "Principal Administrative Officer", "Principal Auditor", "Secretary to the State Government", "Senior Accountant", "Senior Administrative Officer", "Senior Auditor", "Senior Lecturer", "Special Adviser", "Special Assistant", "Technical Officer"].sort().map((item, index) => (
                                    <option key={index} value={item}>{item}</option>))
                            }
                        </select>
                    </div>

                    <div className={`form-group  mb-1`}>
                        <label className='form-label'>Employment Type <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="employment_type" value={formData.employment_type}
                                onChange={onEdit}>
                            <option value="">Select Employment Type</option>
                            {
                                ["Casual", "Contract", "Freelance", "Full-time", "Internship", "Part-time", "Permanent", "Probation", "Self-employed", "Temporary", "Volunteer"].map((item, index) => (
                                    <option key={index} value={item}>{item}</option>))
                            }
                        </select>
                    </div>

                    <div className={`form-group  mb-1`}>
                        <label className='form-label'>Employment Status <span className={'text-danger'}>*</span></label>
                        <select className="form-control" id="employment_status" value={formData.employment_status} onChange={onEdit}>
                            <option value="">Select Employment Status</option>
                            {
                                ["Active", "Inactive", "Retired", "Sacked", "Suspended", "Terminated", "Resigned"].map((item, index) => (
                                    <option key={index} value={item}>{item}</option>))
                            }
                        </select>
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Gross Pay <span className={'text-danger'}>*</span></label>
                        <input type="text" id="gross_pay" className="form-control" value={formData.gross_pay} onChange={onEdit} />
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Date of First Appointment <span className={'text-danger'}>*</span></label>
                        <input type="date" id="date_of_first_appointment" className="form-control" value={formData.date_of_first_appointment} onChange={onEdit} />
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Date of Current Appointment <span className={'text-danger'}>*</span></label>
                        <input type="date" id="date_of_current_appointment" className="form-control" value={formData.date_of_current_appointment} onChange={onEdit} />
                    </div>

                    <div className="form-group mb-1">
                        <label className='form-label'>Bank Account Name </label>
                        <input type="text" id="bank_account_name" className="form-control" value={formData.bank_account_name} onChange={onEdit} />
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Account Number </label>
                        <input type="text" id="bank_account_no" className="form-control" value={formData.bank_account_no} onChange={onEdit} />
                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Bank <span className={'text-danger'}>*</span></label>
                        <select id="bank_name" className="form-control" value={formData.bank_name} onChange={onEdit}>
                            <option value="">Select Bank</option>
                            {
                                bank_list.map((item, index) => (<option key={index} value={item}>{item}</option>))
                            }
                        </select>
                    </div>

                </div>

            </div>


            <div className="mt-3">
                {
                    isFormLoading ?
                        <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                            <div role="status" className="spinner-border-sm spinner-border"><span
                                className="visually-hidden">Loading...</span></div>
                            <span className="ms-50">Loading...</span></button>
                        :
                        <Button type='button' className='me-1 btn-block' color='primary' onClick={onSubmit}>
                            Submit
                        </Button>
                }
                <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
                    Cancel
                </Button>
            </div>

        </form>
    )
}

export default EmployeeManagementForm;