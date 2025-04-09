import {Button, Spinner} from "react-bootstrap";
import Select from "react-select";

const AllowanceAndDeductionForm = ({onEdit, onSubmit, toggleModal, formData, setFormData, employeeList, ledgerList, IsFormLoading}) => {
    let employee_list = [];
    employeeList.length > 0 &&
    employeeList.map((staff) => {
        employee_list.push({value: staff.employee_id, label: `${staff.employee_name} - ${staff.staff_id} (${staff.position}, ${staff.agency_name})`});
    })

    let ledger_list = [];
    ledgerList.length > 0 &&
    ledgerList.map((ledger) => {
        ledger_list.push({value: ledger.ledger_id, label: ledger.description });
    })

    const handleStaffSelect = (item) => {
        setFormData({...formData, employee_id: item.value})
    }

    const handleLedgerSelect = (item) => {
        setFormData({...formData, ledger_id: item.value})
    }

    return(
        <>
            <div className="row">

                {
                    formData.entry_id === "" &&
                    <div className="mb-1 form-group col-md-6">
                        <label className="form-label">Select Staff</label>
                        <Select
                            id='staff_id'
                            onChange={handleStaffSelect}
                            isClearable={false}
                            options={employee_list}
                            className='react-select select-borderless'
                            classNamePrefix='select'
                        />
                    </div>
                }

                <div className="mb-1 form-group col-md-6">
                    <label className="form-label">Select Post Type</label>
                    <select id="post_type" className="form-control" onChange={onEdit} value={formData.post_type}>
                        <option value="">Select Option</option>
                        <option value="Allowance">Allowance</option>
                        <option value="Deduction">Deduction</option>
                    </select>
                </div>

                {
                    formData.entry_id === "" &&
                    <div className="mb-1 form-group col-md-6">
                        <label className="form-label">Select Ledger</label>
                        <Select
                            id='staff_id'
                            onChange={handleLedgerSelect}
                            isClearable={false}
                            options={ledger_list}
                            className='react-select select-borderless'
                            classNamePrefix='select'
                        />
                    </div>
                }

                <div className="mb-1 form-group col-md-6">
                    <label className="form-label">Select Frequency</label>
                    <select id="frequency" className="form-control" onChange={onEdit} value={formData.frequency}>
                        <option value="">Select Option</option>
                        <option value="Once">Once</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Annually">Annually</option>
                    </select>
                </div>

                <div className="mb-1 form-group col-md-6">
                    <label className="form-label">Start Date</label>
                    <input
                        type={'date'}
                        className="form-control"
                        id="start_date"
                        value={formData.start_date}
                        max={formData.end_date}
                        onChange={(e) => {
                            setFormData({...formData, start_date: e.target.value, end_date: ""});
                        }}
                    />
                </div>

                <div className="mb-1 form-group col-md-6">
                    <label className="form-label">End Date</label>
                    <input
                        type={'date'}
                        className="form-control"
                        id="end_date"
                        disabled={formData.start_date === ""}
                        min={formData.start_date}
                        value={formData.end_date}
                        onChange={onEdit}
                    />
                </div>

                <div className="mb-1 form-group col-md-6">
                    <label className="form-label">Select Status</label>
                    <select id="status" className="form-control" onChange={onEdit} value={formData.status}>
                        <option value="">Select Option</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {
                    formData.entry_id === "" &&
                    <div className="mb-1 form-group col-md-6">
                        <label className="form-label">Enter Amount</label>
                        <input
                            type={'number'}
                            step={0.01}
                            className="form-control"
                            id="amount"
                            value={formData.amount}
                            onChange={onEdit}
                            placeholder="Enter Amount"
                        />
                    </div>
                }

            </div>
            <div className="mt-3">
                {
                    IsFormLoading ?
                        <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                            <div role="status" className="spinner-border-sm spinner-border"><span
                                className="visually-hidden">Loading...</span></div>
                            <span className="ms-50">Loading...</span></button>
                        :
                        <Button type='button' className='me-1 btn-block' color='primary' onClick={onSubmit}>
                            Submit
                        </Button>
                }
                <Button type='reset' className={'btn btn-danger'} outline onClick={toggleModal}>
                    Close
                </Button>
            </div>

        </>
    )
}
export default AllowanceAndDeductionForm;