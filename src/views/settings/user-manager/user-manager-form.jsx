import {Button} from "reactstrap";

function UserManagementForm(props) {
    return (
        <form>
            <div className="row">
                <div className="form-group col-md-6 mb-1">
                    <label className='form-label'>Staff ID</label>
                    <input type="text" name="staff_id" id="staff_id" className="form-control"
                           value={props.formData.staff_id}
                           onChange={props.onEdit}/>
                </div>
                <div className="form-group col-md-6 mb-1">
                    <label className='form-label'>First Name</label>
                    <input type="text" name="first_name" id="first_name" className="form-control"
                           value={props.formData.first_name}
                           onChange={props.onEdit}/>
                </div>
                <div className="form-group col-md-6  mb-1">
                    <label className='form-label'>Surname</label>
                    <input type="text" name="surname" id="surname" className="form-control"
                           value={props.formData.surname}
                           onChange={props.onEdit}/>
                </div>
                <div className="form-group col-md-6  mb-1">
                    <label className='form-label'>Phone Number</label>
                    <input type="tel" name="phone_number" id="phone_number" className="form-control"
                           value={props.formData.phone_number}
                           onChange={props.onEdit}/>
                </div>
                <div className="form-group col-md-6 mb-1">
                    <label className='form-label'>Email Address</label>
                    <input type="email" name="email_address" id="email_address" className="form-control"
                           value={props.formData.email_address}
                           onChange={props.onEdit}/>
                </div>
                <div className="form-group col-md-6 mb-1">
                    <label className='form-label'>Select Agency/Ministry</label>
                    <select className="form-control" id="agency_id" name="agency_id" value={props.formData.agency_id}
                            onChange={props.onEdit}>
                        <option value="">Select Agency/Ministry</option>
                        {
                            props.agencyList.length > 0 &&
                            props.agencyList.map((item, index) => {
                                return (
                                    <option key={index} value={item.agency_id}>{item.agency_name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="form-group col-md-6 mb-1">
                    <label className='form-label'>Select User Position</label>
                    <select className="form-control" id="position_id" name="position_id"
                            value={props.formData.position_id}
                            onChange={props.onEdit}>
                        <option value="">Select Position</option>
                        {
                            props.positionList.length > 0 &&
                            props.positionList.map((item, index) => {
                                return (
                                    <option key={index} value={item.position_id}>{item.position_name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="form-group col-md-6 mb-1">
                    <label className='form-label'>Select User Role</label>
                    <select className="form-control" id="role_id" name="role_id"
                            value={props.formData.role_id}
                            onChange={props.onEdit}>
                        <option value="">Select Role</option>
                        {
                            props.roleList.length > 0 &&
                            props.roleList.map((item, index) => {
                                return (
                                    <option key={index} value={item.role_id}>{item.role_name}</option>
                                )
                            })
                        }
                    </select>
                </div>

                <div className={`form-group col-md-6  mb-1`}>
                    <label className='form-label'>Status</label>
                    <select className="form-control" id="status" name="status" value={props.formData.status}
                            onChange={props.onEdit}>
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="form-group col-md-6  mb-1">
                    <label className='form-label'>Password</label>
                    <input type="password" name="password" id="password" className="form-control"
                           value={props.formData.password}
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

export default UserManagementForm;