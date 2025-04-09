import {Button} from "reactstrap";

const LedgerEntriesForm = ({onEdit, onSubmit, toggleModal, formData, ledgerList, documentList, branchList, isFormLoading}) => {
    return(
        <>
            <div className="row">
                <div className="mb-3 form-group col-md-6">
                    <label className="form-label">General Ledger Account</label>
                    <select id="ledger_id" value={formData.ledger_id} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Account</option>
                        {
                            ledgerList.length > 0 &&
                            ledgerList.map((item, index) => (
                                <option key={index}
                                        value={item.ledger_id}>{`${item.description} (${item.account_number})`}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="mb-3 form-group col-md-6">
                    <label className="form-label">Posting Type</label>
                    <select id="posting_type" value={formData.posting_type} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Posting Type</option>
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                    </select>
                </div>

                <div className="mb-3 form-group col-md-6">
                    <label className="form-label">Transaction Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="transaction_date"
                        value={formData.transaction_date}
                        onChange={onEdit}
                        placeholder="Select Transaction Date"
                    />
                </div>

                <div className="mb-3 form-group col-md-6">
                    <label className="form-label">Value Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="value_date"
                        value={formData.value_date}
                        onChange={onEdit}
                        placeholder="Select Value Date"
                    />
                </div>

                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Transaction Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="amount"
                        value={formData.amount}
                        onChange={onEdit}
                        placeholder="Enter Amount"
                    />
                </div>

                <div className="mb-3 form-group col-md-6">
                    <label className="form-label">Ledger Document</label>
                    <select id="document_id" value={formData.document_id} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Document</option>
                        {
                            documentList.length > 0 &&
                            documentList.map((item, index) => (
                                <option key={index}
                                        value={item.document_id}>{item.document_type}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="mb-3 form-group col-md-6">
                    <label className="form-label">Ledger Branch</label>
                    <select id="branch_id" value={formData.branch_id} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Branch</option>
                        {
                            branchList.length > 0 &&
                            branchList.map((item, index) => (
                                <option key={index}
                                        value={item.branch_id}>{`${item.branch_name} (${item.branch_code})`}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Description</label>
                    <input
                        name="description"
                        className="form-control"
                        id="description"
                        value={formData.description}
                        onChange={onEdit}
                        placeholder="Transaction Description"
                    />
                </div>

                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Is Last Entry?</label>
                    <select id="is_last_entry" value={formData.is_last_entry} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Option</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                    {
                        formData.is_last_entry === '1' &&
                        <span className={'badge bg-danger'}>The selected ledger account will be close after this transaction</span>
                    }
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
export default LedgerEntriesForm;