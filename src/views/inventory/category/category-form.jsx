import {Button} from "reactstrap";

const InventoryCategoryForm = ({onEdit, onSubmit, toggleModal, formData, isFormLoading}) => {
    return(
        <>
            <div className="row">
                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Category Name</label>
                    <input
                        name="category_name"
                        className="form-control"
                        id="category_name"
                        value={formData.category_name}
                        onChange={onEdit}
                        placeholder="Category Name"
                    />
                </div>
                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Description</label>
                    <input
                        name="description"
                        className="form-control"
                        id="description"
                        value={formData.description}
                        onChange={onEdit}
                        placeholder="Category Description"
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
export default InventoryCategoryForm;
