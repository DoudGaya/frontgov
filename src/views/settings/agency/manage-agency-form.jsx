import {Button, Input, Label} from "reactstrap";

export default function ManageAgencyForm(props) {
    return (
        <form>
            <div className="form-group mb-1">
                <label className='form-label'  htmlFor="agency_name">Agency Name</label>
                <input type="text" name="agency_name" id="agency_name" className="form-control" value={props.formData.agency_name}
                       onChange={props.onEdit}/>
            </div>
            <div className="form-group mb-1">
                <label className='form-label'  htmlFor="agency_code">Agency Code</label>
                <input type="text" name="agency_code" id="agency_code" className="form-control" value={props.formData.agency_code}
                       onChange={props.onEdit}/>
            </div>
            <div className="form-group mb-1">
                <label className='form-label'  htmlFor="contact_person">Contact Person</label>
                <input type="text" name="contact_person" id="contact_person" className="form-control" value={props.formData.contact_person}
                       onChange={props.onEdit}/>
            </div>
            <div className="form-group mb-1">
                <label className='form-label'  htmlFor="contact_email">Contact Email</label>
                <input type="email" name="contact_email" id="contact_email" className="form-control" value={props.formData.contact_email}
                       onChange={props.onEdit}/>
            </div>
            <div className="mt-3">
                {
                    props.isFormLoading ?
                        <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                            <div role="status" className="spinner-border-sm spinner-border"><span
                                className="visually-hidden">Loading...</span></div>
                            <span className="ms-50">Loading...</span></button>
                        :
                        <Button type='button' className='me-1' color='primary' onClick={props.onSubmit}>
                            Submit
                        </Button>
                }
                <Button type='reset' color='secondary' outline onClick={props.toggleSidebar}>
                    Cancel
                </Button>
            </div>



        </form>
    )
}