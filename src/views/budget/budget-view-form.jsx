import {Button} from "reactstrap";
import {useEffect, useState} from "react";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {currencyConverter, formatDateAndTime, numberFormat} from "@src/resources/constants";

const BudgetViewForm = ({selectedBudget, selectedBudgetItem, handleBudgetUpdate, handleAddNewBudgetItem, can_modify}) => {
    const formInitial = {  item_name: "", item_description: "", quantity: "", unit_price: "", total: 0}
    const [form, setForm] = useState(formInitial);

    const onAddItem = async () => {
        if (form.item_name.toString().trim() === "") {
            await showAlert("EMPTY FIELD", "Please enter the budget item name", "error");
            return false;
        }
        if (form.unit_price.toString() === "") {
            await showAlert("EMPTY FIELD", "Please enter the budget item unit price", "error");
            return false;
        }
        if (form.quantity.toString() === "") {
            await showAlert("EMPTY FIELD", "Please enter the budget item quantity", "error");
            return false;
        }
        const quantity = parseInt(form.quantity);
        const unit_price = parseFloat(form.unit_price);
        const total = unit_price*quantity;

        if (total === 0) {
            await showAlert("EMPTY FIELD", "Item total price can't be 0", "error");
            return false;
        }
        const items = [...selectedBudgetItem]

        if (items.filter(r=>r.item_name === form.item_name).length > 0) {
            await showAlert("ITEM EXIST", "This item has already been added", "error");
            return false;
        }

        const sendData = {
            item_name: form.item_name.toString().trim(), item_description: form.item_description,
            quantity: quantity, unit_price: unit_price, total: total, budget_id: selectedBudget.budget_id,
        }
        handleAddNewBudgetItem(sendData);
    }

    useEffect(() => {
        setForm(formInitial);
    }, [selectedBudgetItem])

    return(
        <>
            <div className="row">
                <div className={`${can_modify ? 'col-md-6' : 'col-md-12'} table-responsive`}>
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <td><b>Agency/Ministry</b></td>
                                <td>{selectedBudget.agency_name}</td>
                            </tr>
                            <tr>
                                <td><b>Budget Year</b></td>
                                <td>{selectedBudget.budget_year}</td>
                            </tr>
                            <tr>
                                <td><b>Approved Amount</b></td>
                                <td>{currencyConverter(selectedBudget.approved_amount)}</td>
                            </tr>
                            <tr>
                                <td><b>Collected Amount</b></td>
                                <td>{currencyConverter(selectedBudget.collected_amount)}</td>
                            </tr>
                            <tr>
                                <td><b>Balance Amount</b></td>
                                <td>{currencyConverter(selectedBudget.remaining_amount)}</td>
                            </tr>
                            <tr>
                                <td><b>Created By</b></td>
                                <td>{selectedBudget.created_by_name} ({formatDateAndTime(selectedBudget.created_date, 'short_date')})</td>
                            </tr>
                            <tr>
                                <td><b>Modified By</b></td>
                                <td>{selectedBudget.modified_by_name} ({formatDateAndTime(selectedBudget.modified_date, 'date_and_time')})</td>
                            </tr>
                            <tr>
                                <td><b>Status</b></td>
                                <td>{selectedBudget.status}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {
                    can_modify &&
                    <div className="col-md-6 table-responsive">
                        <h4 className={'mb-2 text-center'}>Budget New Item Form</h4>
                        <div className="mb-1 form-group col-md-12">
                            <label htmlFor="">Enter Budget Item</label>
                            <input type="text" id={'item_name'} value={form.item_name} onChange={(e) => {
                                setForm({...form, [e.target.id]: e.target.value})
                            }} className="form-control" placeholder="Budget Item Name"/>
                        </div>
                        <div className="mb-1 form-group col-md-12">
                            <label htmlFor="">Enter Budget Description</label>
                            <input type="text" id={'item_description'} className="form-control"
                                   placeholder="Budget Item Description"
                                   value={form.item_description} onChange={(e) => {
                                setForm({...form, [e.target.id]: e.target.value})
                            }}
                            />
                        </div>
                        <div className="mb-1 form-group col-md-12">
                            <label htmlFor="">Enter Unit Price</label>
                            <input type="number" step={0.01} id={'unit_price'} className="form-control"
                                   placeholder="Enter Unit Price"
                                   value={form.unit_price} onChange={(e) => {
                                setForm({...form, [e.target.id]: e.target.value})
                            }}
                            />
                        </div>

                        <div className="row">
                            <div className="mb-1 form-group col-md-8">
                                <label htmlFor="">Enter Quantity</label>
                                <input type="number" min={1} id={'quantity'} className="form-control"
                                       placeholder="Enter Quantity"
                                       value={form.quantity} onChange={(e) => {
                                    setForm({...form, [e.target.id]: e.target.value})
                                }}
                                />
                            </div>

                            <div className="mb-1 form-group col-md-4 d-flex align-items-end">
                                <Button type='button' className='me-1' color='success' onClick={onAddItem}>
                                    Add New Item
                                </Button>
                            </div>
                        </div>
                    </div>
                }

            </div>

            <hr/>

            <div className="row">
                <div className="col-md-12 table-responsive">
                    <h3 className={"text-center"}>Budget Items</h3>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Item Name</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Created By</th>
                            <th>Created Date</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            selectedBudgetItem.length > 0 && selectedBudgetItem.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.item_name}</td>
                                        <td>{item.item_description}</td>
                                        <td>{numberFormat(item.quantity)}</td>
                                        <td>{currencyConverter(item.unit_price)}</td>
                                        <td>{currencyConverter(item.unit_price * item.quantity)}</td>
                                        <td>{item.created_by_name}</td>
                                        <td>{formatDateAndTime(item.created_date, 'short_date')}</td>
                                        <td>
                                            {
                                                selectedBudget.status === 'Active' && item.quantity_taken === 0 ?
                                                    <a href="#"
                                                       className={"btn btn-danger btn-sm  mb-1"}
                                                       onClick={() => showConfirm("Warning", `Are you sure you want to remove this item?`, "warning")
                                                           .then(async (confirm) => {
                                                               if (confirm) {
                                                                   await handleBudgetUpdate(item);
                                                               }
                                                           })}>
                                                        <i className='fa fa-trash'/>
                                                    </a> : '--'
                                            }

                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default BudgetViewForm;
