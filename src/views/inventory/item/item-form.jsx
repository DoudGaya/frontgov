import {Button} from "reactstrap";

const InventoryItemForm = ({onEdit, onSubmit, toggleModal, formData, isFormLoading, vendorList, manufacturerList, categoryList}) => {
    return(
        <>
            <div className="row">
                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Item Name</label>
                    <input
                        name="item_name"
                        className="form-control"
                        id="item_name"
                        value={formData.item_name}
                        onChange={onEdit}
                        placeholder="Item Name"
                    />
                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Select Category</label>
                    <select name="category_id" id="category_id" value={formData.category_id} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Category</option>
                        {
                            categoryList.length > 0 && categoryList.map((item, index) => (
                                <option key={index} value={item.category_id}>{item.category_name}</option>
                            ))
                        }
                    </select>

                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Select Vendor</label>
                    <select name="vendor_id" id="vendor_id" value={formData.vendor_id} onChange={onEdit}
                            className="form-control">
                        <option value="">Select Vendor</option>
                        {
                            vendorList.length > 0 && vendorList.map((item, index) => (
                                <option key={index} value={item.vendor_id}>{item.vendor_name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Select Manufacturer</label>
                    <select name="manufacturer_id" id="manufacturer_id" value={formData.manufacturer_id}
                            onChange={onEdit} className="form-control">
                        <option value="">Select Manufacturer</option>
                        {
                            manufacturerList.length > 0 && manufacturerList.map((item, index) => (
                                <option key={index} value={item.manufacturer_id}>{item.manufacturer_name}</option>
                            ))
                        }
                    </select>
                </div>

                {/*{*/}
                {/*    formData.item_id === "" &&*/}
                {/*    <div className="mb-3 form-group col-md-12">*/}
                {/*        <label className="form-label">Quantity</label>*/}
                {/*        <input*/}
                {/*            type={"number"}*/}
                {/*            name="quantity"*/}
                {/*            className="form-control"*/}
                {/*            id="quantity"*/}
                {/*            value={formData.quantity}*/}
                {/*            onChange={onEdit}*/}
                {/*            min="0"*/}
                {/*            placeholder="Enter Quantity"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*}*/}

                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        name="price"
                        className="form-control"
                        id="price"
                        value={formData.price}
                        onChange={onEdit}
                        step="0.01"
                        min="0"
                        placeholder="Enter Unit Price"
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
export default InventoryItemForm;
