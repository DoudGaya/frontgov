import {Button} from "reactstrap";

const FinanceLedgerDocumentForm = ({onEdit, onSubmit, toggleModal, formData, isFormLoading}) => {
    return(
        <>
            <div className="row">
                <div className="mb-2 form-group col-md-12">
                    <label className="form-label">Document Type</label>
                    <input
                        name="document_type"
                        className="form-control"
                        id="document_type"
                        value={formData.document_type}
                        onChange={onEdit}
                        placeholder="Document Type"
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
export default FinanceLedgerDocumentForm;