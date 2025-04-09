import {Button} from "reactstrap";
import {currencyConverter, formatDateAndTime} from "@src/resources/constants";
import transaction from "@src/views/inventory/transaction/transaction";

const FinanceFundRequestForm = ({onEdit, onSubmit, toggleModal, formData, accountList, selectedRequest, selectedRequestItems, isFormLoading, selectedTransaction, selectedPayment}) => {
    console.log(formData);
    return(
        <>
            <div className="row">
                <div className="mb-2 table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            selectedRequestItems.length > 0 && selectedRequestItems.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.item_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{currencyConverter(item.unit_price)}</td>
                                        <td>{currencyConverter(item.total)}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
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
                    <label className="form-label">Transaction Amount (Approved)</label>
                    <input
                        type={"text"}
                        // step="0.01"
                        className="form-control"
                        readOnly={true}
                        id="amount"
                        value={currencyConverter(selectedRequest.total_approved)}
                        onChange={onEdit}
                        placeholder="Enter transaction amount"
                    />
                </div>

            </div>

            <div>
                {
                    selectedRequest.paid_by === 0 ?
                    isFormLoading ?
                        <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                            <div role="status" className="spinner-border-sm spinner-border"><span
                                className="visually-hidden">Loading...</span></div>
                            <span className="ms-50">Loading...</span></button>
                        :
                        <Button type='button' className='me-1' color='primary' onClick={onSubmit}>
                            Submit
                        </Button> : null
                }
                <Button type='reset' color='danger' outline onClick={toggleModal}>
                    Cancel
                </Button>
            </div>

            <div className="row mt-5">
                <div className="col-md-12">
                    <h3>Transaction Record</h3>
                    <div className={'table-responsive'}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Trans Date</th>
                                    <th>Debit Acct</th>
                                    <th>Credit Acct</th>
                                    <th>Transaction By</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                selectedTransaction.length > 0 &&
                                selectedTransaction.map((item, index) => {
                                    const debit_account = accountList.filter(e=>e.account_id === item.debit_account_id)[0].account_name;
                                    const credit_account = accountList.filter(e=>e.account_id === item.credit_account_id)[0].account_name;
                                    return (
                                        <tr key={index}>
                                            <td>{currencyConverter(item.amount)}</td>
                                            <td>{formatDateAndTime(item.transaction_date, 'short_date')}</td>
                                            <td>{ debit_account }</td>
                                            <td>{ credit_account }</td>
                                            <td> { item.created_by_name } </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-12">
                    <h3>Payment Record</h3>
                    <div className={'table-responsive'}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Payment Date</th>
                                    <th>Payment Method</th>
                                    <th>Acct Name</th>
                                    <th>Acct No</th>
                                    <th>Bank</th>
                                    <th>Paid By</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                selectedPayment.length > 0 &&
                                selectedPayment.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{currencyConverter(item.amount)}</td>
                                            <td>{formatDateAndTime(item.payment_date, 'short_date')}</td>
                                            <td>{ item.payment_method }</td>
                                            <td>{ item.account_name }</td>
                                            <td>{ item.account_number }</td>
                                            <td>{ item.bank }</td>
                                            <td>{ item.created_by_name }</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default FinanceFundRequestForm;