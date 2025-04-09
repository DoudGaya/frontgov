import {Button} from "reactstrap";

const FinanceLedgerBranchForm = ({onEdit, onSubmit, toggleModal, formData, isFormLoading}) => {
    return(
        <>
            <div className="row">
                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Branch Code</label>
                    <input
                        name="branch_code"
                        className="form-control"
                        id="branch_code"
                        value={formData.branch_code}
                        onChange={onEdit}
                        placeholder="Branch Code"
                    />
                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Branch Name</label>
                    <input
                        name="branch_name"
                        className="form-control"
                        id="branch_name"
                        value={formData.branch_name}
                        onChange={onEdit}
                        placeholder="Branch Name"
                    />
                </div>


            </div>
            <div>
                {
                    isFormLoading ?
                        <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                            <div role="status" className="spinner-border-sm spinner-border"><span
                                className="visually-hidden">Loading...</span></div>
                            <span className="ms-50">Loading...</span></button>
                        :
                        <Button type='button' className='me-1' color='primary' onClick={onSubmit}>
                            Submit
                        </Button>
                }
                <Button type='reset' color='danger' outline onClick={toggleModal}>
                    Cancel
                </Button>
            </div>
        </>
    )
}
export default FinanceLedgerBranchForm;