import {Button} from "reactstrap";
import {useState} from "react";
import Select, {components} from "react-select";
import {toast} from "react-toastify";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {currencyConverter, numberFormat} from "@src/resources/constants";

const BudgetForm = ({onEdit, onSubmit, toggleModal, formData, setFormData, budgetItem, setBudgetItem, isFormLoading, agencyList}) => {
    const formInitial = {  item_name: "", item_description: "", quantity: "", unit_price: "", total: 0}
    const [form, setForm] = useState(formInitial);

    let agencyOptions = [];
    agencyList.length > 0 && agencyList.forEach(item => {
        agencyOptions.push({value: item.agency_id, label: item.agency_name, data: item});
    });

    const currentYear = new Date().getFullYear();
    const yearList = Array.from({ length: 10 }, (_, i) => currentYear + 1 - i);


    const handleAgencyChange = (item) => {
        setFormData({
            ...formData,
            agency_id: item.value,
        })
    }

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
        const items = [...budgetItem]

        if (items.filter(r=>r.item_name === form.item_name).length > 0) {
            await showAlert("ITEM EXIST", "This item has already been added", "error");
            return false;
        }

        items.push({
            item_name: form.item_name.toString().trim(), item_description: form.item_description,
            quantity: quantity, unit_price: unit_price, total: total
        })
        setBudgetItem(items);
        setForm(formInitial)
        setFormData({
            ...formData,
            approved_amount: formData.approved_amount + total,
            collected_amount: 0,
            remaining_amount: formData.approved_amount + total,
        })
        toast.success("Budget item added successfully.")
    }

    const handleItemRemoval = (item_name, total) => {
        setBudgetItem([
            ...budgetItem.filter(r => r.item_name !== item_name),
        ])
        setFormData({
            ...formData,
            approved_amount: formData.approved_amount - total
        })
    }

    const SelectComponent = ({ data, ...props }) => {
        return (
            <components.Option {...props}>
                <div className='d-flex flex-wrap align-items-center'>
                    {data.label}
                </div>
            </components.Option>
        )
    };

    return(
        <>
            <div className="row">

                {
                    agencyList.length > 0 &&
                    <div className="mb-2 form-group col-md-4">
                        <label className="form-label">Select Agency</label>
                        <Select
                            id='select-item'
                            onChange={handleAgencyChange}
                            isClearable={false}
                            options={agencyOptions}
                            className='react-select select-borderless'
                            classNamePrefix='select'
                            components={{Option: SelectComponent}}
                        />
                    </div>
                }

                <div className={`mb-2 form-group ${agencyList.length > 0 ? 'col-md-4' : 'col-md-6'}`}>
                    <label className="form-label">Select Budget Year</label>
                    <select id="budget_year" className={"form-control"} value={formData.budget_year}
                            onChange={onEdit}>
                        <option value="">Select Budget Year</option>
                        {
                            yearList.map(item => {
                                return <option key={item} value={item}>{item}</option>
                            })
                        }
                    </select>
                </div>

                <div className={`mb-2 form-group ${agencyList.length > 0 ? 'col-md-4' : 'col-md-6'}`}>
                    <label className="form-label">Select Budget Status</label>
                    <select id="status" className={"form-control"} value={formData.status}
                            onChange={onEdit}>
                        <option value="">Select Budget Status</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <hr/>

                <h4 className={'mb-2'}>Budget Item Form</h4>
                <div className="mb-2 form-group col-md-6">
                    <label htmlFor="">Enter Budget Item</label>
                    <input type="text" id={'item_name'} value={form.item_name} onChange={(e)=> { setForm({...form, [e.target.id]: e.target.value}) }} className="form-control" placeholder="Budget Item Name"/>
                </div>
                <div className="mb-2 form-group col-md-6">
                    <label htmlFor="">Enter Budget Description</label>
                    <input type="text" id={'item_description'} className="form-control"
                           placeholder="Budget Item Description"
                           value={form.item_description} onChange={(e)=> { setForm({...form, [e.target.id]: e.target.value}) }}
                    />
                </div>

                <div className="mb-2 form-group col-md-5">
                    <label htmlFor="">Enter Unit Price</label>
                    <input type="number" step={0.01} id={'unit_price'} className="form-control"
                           placeholder="Enter Unit Price"
                           value={form.unit_price} onChange={(e)=> { setForm({...form, [e.target.id]: e.target.value}) }}
                    />
                </div>

                <div className="mb-2 form-group col-md-5">
                    <label htmlFor="">Enter Quantity</label>
                    <input type="number" min={1} id={'quantity'} className="form-control"
                           placeholder="Enter Quantity"
                           value={form.quantity} onChange={(e)=> { setForm({...form, [e.target.id]: e.target.value}) }}
                    />
                </div>

                <div className="mb-2 form-group col-md-2 d-flex align-items-end">
                    <Button type='button' className='me-1' color='success' onClick={onAddItem}>
                        Add Item
                    </Button>
                </div>

                <hr/>


                <div className="mb-2 form-group col-md-12 table-responsive">
                    <h4>Budget Items</h4>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Item Name</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            budgetItem.length > 0 && budgetItem.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.item_name}</td>
                                        <td>{item.item_description}</td>
                                        <td>{numberFormat(item.quantity)}</td>
                                        <td>{currencyConverter(item.unit_price)}</td>
                                        <td>{currencyConverter(item.total)}</td>
                                        <td>
                                            <a href="#" className={"btn btn-danger btn-sm  mb-1"}
                                               onClick={() => showConfirm("Warning", `Are you sure you want to remove this item?`, "warning")
                                                   .then(async (confirm) => {
                                                       if (confirm) {
                                                           handleItemRemoval(item.item_name, item.total);
                                                       }
                                                   })}>
                                                <i className='fa fa-trash'/>
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>

                </div>

                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Budget Total</label>
                    <h4>{numberFormat(formData.approved_amount)}</h4>
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
export default BudgetForm;
