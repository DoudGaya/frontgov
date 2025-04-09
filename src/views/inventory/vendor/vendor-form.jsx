import {Button} from "reactstrap";

const InventoryVendorForm = ({onEdit, onSubmit, toggleModal, formData, isFormLoading}) => {
    return(
        <>
            <div className="row">
                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Vendor Name</label>
                    <input
                        name="vendor_name"
                        className="form-control"
                        id="vendor_name"
                        value={formData.vendor_name}
                        onChange={onEdit}
                        placeholder="Vendor Name"
                    />
                </div>
                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Contact Number</label>
                    <input
                        type={'tel'}
                        name="contact_phone"
                        className="form-control"
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={onEdit}
                        placeholder="Phone Number"
                    />
                </div>
                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Contact Email</label>
                    <input
                        type={'email'}
                        name="contact_email"
                        className="form-control"
                        id="contact_email"
                        value={formData.contact_email}
                        onChange={onEdit}
                        placeholder="Email Address"
                    />
                </div>
                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Address</label>
                    <input
                        type={'text'}
                        name="address"
                        className="form-control"
                        id="address"
                        value={formData.address}
                        onChange={onEdit}
                        placeholder="Address"
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
export default InventoryVendorForm;
