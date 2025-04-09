import {Button} from "reactstrap";

const FinanceAccountForm = ({onEdit, onSubmit, toggleModal, formData, isFormLoading, accountList}) => {
    return(
        <>
            <div className="row">
                <div className="mb-2 form-group col-md-6">
                    <label className="form-label">Account Name</label>
                    <input
                        name="account_name"
                        className="form-control"
                        id="account_name"
                        value={formData.account_name}
                        onChange={onEdit}
                        placeholder="Account Name"
                    />
                </div>
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
                    <label className="form-label">Select Account Type</label>
                    <select name="account_type" id="account_type" value={formData.account_type} onChange={onEdit} className="form-control">
                        <option value="">Select Account Type</option>
                        <option value="Asset">Asset</option>
                        <option value="Liability">Liability</option>
                        <option value="Equity">Equity</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Expense">Expense</option>
                        <option value="Contra">Contra</option>
                    </select>
                </div>
                <div className="mb-2 form-group col-md-6">
                    <label className="form-label">Select Parent Account Number</label>
                    <select name="parent_account_id" id="parent_account_id" value={formData.parent_account_id} onChange={onEdit} className="form-control">
                        <option value="">Select Parent Account Number</option>
                        <option value="0">No Parent Account</option>
                        {
                            accountList.length > 0 && accountList.map((item, index) => {
                                if (formData.account_id !== item.account_id && item.parent_account_id === 0)
                                    return (<option key={index} value={item.account_id}>{item.account_name}</option>)
                            })
                        }
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
export default FinanceAccountForm;
