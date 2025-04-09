import {Button} from "reactstrap";

const FinanceJournalTransactionForm = ({onEdit, onSubmit, toggleModal, formData, setFormData, accountList, activeFinancialYear, isFormLoading}) => {

    return(
        <>
            <div className="row">
                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Transaction Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="transaction_date"
                        value={formData.transaction_date}
                        onChange={onEdit}
                        placeholder="Enter transaction date"
                    />
                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Transaction Description</label>
                    <input
                        className="form-control"
                        id="description"
                        value={formData.description}
                        onChange={onEdit}
                        placeholder="Enter transaction description"
                    />
                </div>

                <div className="mb-2 form-group col-md-6">
                    <label className="form-label">Debit Account</label>
                    <select id="debit_account_id" value={formData.debit_account_id} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Debit Account</option>
                        {
                            accountList.length > 0 &&
                            accountList.map((account, index) => {
                                return (
                                    <option key={index} value={account.account_id}>{account.account_name}</option>
                                )
                            })
                        }
                    </select>
                </div>

                <div className="mb-2 form-group col-md-6">
                    <label className="form-label">Credit Account</label>
                    <select id="credit_account_id" value={formData.credit_account_id} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Credit Account</option>
                        {
                            accountList.length > 0 &&
                            accountList.map((account, index) => {
                                return (
                                    <option key={index} value={account.account_id}>{account.account_name}</option>
                                )
                            })
                        }
                    </select>
                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Transaction Amount</label>
                    <input
                        type={"number"}
                        step="0.01"
                        className="form-control"
                        id="amount"
                        value={formData.amount}
                        onChange={onEdit}
                        placeholder="Enter transaction amount"
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
export default FinanceJournalTransactionForm;