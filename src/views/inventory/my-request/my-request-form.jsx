import {Button} from "reactstrap";
import {useState} from "react";

const MyInventoryRequestForm = ({onEdit, onSubmit, toggleModal, formData, setFormData, isFormLoading, inventoryList}) => {
    const categories = inventoryList.length > 0 ? inventoryList.reduce((acc, current) => {
        if (!acc.find(item => item.category_id === current.category_id)) {
            acc.push({ category_id: current.category_id, category_name: current.category_name });
        }
        return acc;
    }, []) : [];
    const [inventories, setInventories] = useState([]);
    const [qty, setQty] = useState(0);

    const handleCategoryChange = (e) => {
        setQty(0)
        const value = e.target.value;
        setFormData({...formData, category_id: e.target.value});
        if (value !== "") {
            const invent = inventoryList.filter(r=>r.category_id === parseInt(value));
            setInventories(invent)
        } else {
            setInventories([])
        }

    }
    const handleItemChange = (e) => {
        const item_id = e.target.value;
        setFormData({...formData, item_id: item_id});
        if (item_id === "") {
            setQty(0)
        } else {
            const quantity = inventories.filter(r=>r.item_id === parseInt(item_id))[0].quantity;
            setQty(quantity);
        }
    }

    return(
        <>
            <div className="row">
                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Select Category</label>
                    <select name="category_id" id="category_id" value={formData.category_id}
                            onChange={handleCategoryChange} className="form-control">
                        <option value="">Select Category</option>
                        {
                            categories.length > 0 && categories.map((item, index) => (
                                <option key={index} value={item.category_id}>{item.category_name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Select Item</label>
                    <select name="item_id" id="item_id" value={formData.item_id} onChange={handleItemChange}
                            className="form-control">
                        <option value="">Select Item</option>
                        {
                            inventories.length > 0 && inventories.map((item, index) => (
                                <option key={index} value={item.item_id}>{item.item_name}</option>
                            ))
                        }
                    </select>
                    {
                        formData.item_id !== "" && <p>Total in stock: {qty}</p>
                    }
                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Quantity</label>
                    <input
                        type={"number"}
                        name="quantity"
                        className="form-control"
                        id="quantity"
                        value={formData.quantity}
                        onChange={onEdit}
                        min="1"
                        max={qty}
                        disabled={qty === 0}
                        placeholder="Enter Quantity"
                    />
                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Description</label>
                    <input
                        type={"text"}
                        name="description"
                        className="form-control"
                        id="description"
                        value={formData.description}
                        onChange={onEdit}
                        placeholder="Enter Description"
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
export default MyInventoryRequestForm;
