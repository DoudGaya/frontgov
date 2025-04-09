import {Button} from "reactstrap";

const FinanceGeneralLedgerForm = ({onEdit, onSubmit, toggleModal, formData, isFormLoading}) => {
    return(
        <>
            <div className="row">
                <div className="mb-2 form-group col-md-6">
                    <label className="form-label">Account Number</label>
                    <input
                        name="account_number"
                        className="form-control"
                        id="account_number"
                        value={formData.account_number}
                        onChange={onEdit}
                        placeholder="Account Number"
                    />
                </div>

                <div className="mb-2 form-group col-md-6">
                    <label className="form-label">Description</label>
                    <input
                        name="description"
                        className="form-control"
                        id="description"
                        value={formData.description}
                        onChange={onEdit}
                        placeholder="Description"
                    />
                </div>

                <div className="mb-2 form-group col-md-6">
                    <label className="form-label">Select Account Type</label>
                    <select name="account_type" id="account_type" value={formData.account_type} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Account Type</option>
                        <option value="Heading">Heading</option>
                        <option value="Posting">Posting</option>
                    </select>
                </div>

                <div className="mb-2 form-group col-md-6">
                    <label className="form-label">Select Account Balance/Income</label>
                    <select name="balance_or_income" id="balance_or_income" value={formData.balance_or_income} onChange={onEdit} className="form-control">
                        <option value="">Select Account Balance/Income</option>
                        <option value="Balance Sheet">Balance Sheet</option>
                        <option value="Income Statement">Income Statement</option>
                    </select>
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
export default FinanceGeneralLedgerForm;