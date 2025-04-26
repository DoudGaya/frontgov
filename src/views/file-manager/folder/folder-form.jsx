import {Button} from "reactstrap";

export default function FolderForm(props) {
    return (
        <form>
            <div className="row">
                <div className="form-group mb-1">
                    <label className='form-label'>Folder Name</label>
                    <input type="text" name="folder_name" id="folder_name" className="form-control" value={props.formData.folder_name}
                           onChange={props.onEdit}/>
                </div>
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