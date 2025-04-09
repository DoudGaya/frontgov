import {Button} from "reactstrap";

const FinanceYearForm = ({onEdit, onSubmit, toggleSidebar, formData, setFormData, IsFormLoading}) => {

    return(
        <>
            <div className="row">
                <div className="mb-1 form-group col-md-12">
                    <label className="form-label">Start Date</label>
                    <input
                        type={'date'}
                        name="start_date"
                        className="form-control"
                        id="start_date"
                        value={formData.start_date}
                        onChange={(e) => {
                            setFormData({...formData, start_date: e.target.value, end_date: ''});
                        }}
                        placeholder="Start Date"
                    />
                </div>

                <div className="mb-1 form-group col-md-12">
                    <label className="form-label">End Date</label>
                    <input
                        type={'date'}
                        name="end_date"
                        className="form-control"
                        id="end_date"
                        disabled={formData.start_date === ""}
                        min={formData.start_date}
                        value={formData.end_date}
                        onChange={onEdit}
                        placeholder="End Date"
                    />
                </div>

                <div className="mb-1 form-group col-md-12">
                    <label className="form-label">Is Active</label>
                    <select name="is_active" id="is_active" className="form-control" value={formData.is_active} onChange={onEdit}>
                        <option value="">Select Option</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>

            </div>
            <div>
                {
                    IsFormLoading ?
                        <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                            <div role="status" className="spinner-border-sm spinner-border"><span
                                className="visually-hidden">Loading...</span></div>
                            <span className="ms-50">Loading...</span></button>
                        :
                        <Button type='button' className='me-1' color='primary' onClick={onSubmit}>
                            Submit
                        </Button>
                }
                <Button type='reset' color='danger' outline onClick={toggleSidebar}>
                    Cancel
                </Button>
            </div>
        </>
    )
}
export default FinanceYearForm;