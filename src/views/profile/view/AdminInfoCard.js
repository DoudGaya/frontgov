// ** React Imports
import { useState, Fragment } from 'react'
// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Form,
    CardBody,
    Button,
    Badge,
    Modal,
    Input,
    Label,
    ModalBody,
    ModalHeader,
    Alert
} from 'reactstrap'
// ** Third Party Components
import Swal from 'sweetalert2'
import {Check, Briefcase, X, FileText, Layers} from 'react-feather'
import withReactContent from 'sweetalert2-react-content'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import {formatDate, formatDateAndTime, generate_token, numberFormat, serverLink} from "@src/resources/constants";
import {StateData} from "@src/resources/state_data";
import {toast} from "react-toastify";
import axios from "axios";
import {connect} from "react-redux";
import {decryptData, encryptData} from "../../../resources/constants";

const statusColors = {
    active: 'light-success',
    pending: 'light-warning',
    inactive: 'light-secondary'
}

const MySwal = withReactContent(Swal)

const AdminInfoCard = ({ profile, reload, setRebuildDashboard, token, loginData }) => {
    const user_id = loginData[0].user_id

    const data = profile.length > 0 ? profile[0] : []
    const [formDataImageUpdate, setFormDataImageUpdate] = useState({image_path: '', image_name: '', user_id: data.user_id, updated_by: user_id})
    const [formDataPassword, setFormDataPassword] = useState({current_password: '', new_password: '', confirm_password: ''});
    const [showSignature, setShowSignature] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // ** render user img
    const renderUserSignature = () => {
        if (profile.length > 0 && typeof data.signature !== null) {
            return (
                <img crossOrigin="annonymous" height='50' width='50' alt={data.full_name} src={`${serverLink}public/upload/user/${data.signature}`} className='img-fluid rounded mt-3 mb-2'/>
            )
        }
    }

    const onSubmitPasswordUpdate = async (e) => {
        e.preventDefault();
        if (formDataPassword.current_password.toString().trim() === "") { toast.error("Enter your current password"); return false; }
        if (encryptData(formDataPassword.current_password.toString().trim()) !== data.password) { toast.error("Invalid current password"); return false; }
        if (formDataPassword.new_password.toString().trim() === "") { toast.error("Please enter your new password"); return false; }
        if (formDataPassword.new_password.toString().trim().length < 8) { toast.error("Password must be at least 8 characters long"); return false; }
        if (formDataPassword.confirm_password.toString().trim() === "") { toast.error("Please enter your confirm password"); return false; }
        if (formDataPassword.new_password.toString().trim() !== formDataPassword.confirm_password.toString().trim()) { toast.error("New password and confirm password didn't match"); return false; }
        toast.info("Updating...");
        const sendData = {
            password: encryptData(formDataPassword.new_password.toString().trim()),
            user_id: data.user_id,
            updated_by: user_id
        }
        await axios.patch(`${serverLink}login/password/update`, sendData, token)
            .then(res => {
                if (res.data.message === 'success') {
                    toast.success("Password Updated Successfully")
                    reload()
                    setRebuildDashboard(generate_token(5))
                    setFormDataPassword({...formDataPassword, current_password: '', new_password: '', confirm_password: ''})
                    setShowPassword(false)
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => {
                console.log("NETWORK ERROR", err)
                toast.error(`NETWORK ERROR`)
            })
    }

    const onSignatureChange = e => {
        const file = e.target.files[0]
        if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
        } else {
            toast.error("Only .png, .jpg and .jpeg format allowed!")
            return false
        }
        if (file.size > 1000000) {
            toast.error("Max file size allowed is 1MB")
            return false
        }

        setFormDataImageUpdate({
            ...formDataImageUpdate,
            image_path: file,
            image_name: file.name
        })
    }

    const onSubmitSignatureUpdate = async (e) => {
        e.preventDefault()
        if (formDataImageUpdate.image_path === "") { toast.error("Please select a valid signature to upload"); return false; }
        toast.info("Updating...")
        const formDocument = new FormData()
        formDocument.append('file', formDataImageUpdate.image_path)
        formDocument.append('user_id', data.user_id)
        formDocument.append('updated_by', data.user_id)
        await axios.patch(`${serverLink}hr/user/uploadSignature`, formDocument, token)
            .then(res => {
                if (res.data.message === 'success') {
                    toast.success("Signature Updated Successfully")
                    reload()
                    setRebuildDashboard(generate_token(5))
                    setFormDataImageUpdate({...formDataImageUpdate, image_path: '', image_name: '', user_id: data.user_id, updated_by: user_id})
                    setShowSignature(false)
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => {
                console.log("NETWORK ERROR", err)
                toast.error(`NETWORK ERROR`)
            })
    }

    return (
        <Fragment>
            <Card>
                <CardBody>
                    <div className='user-avatar-section'>
                        <div className='d-flex align-items-center flex-column'>
                            <Avatar initials color={'light-primary'} className='rounded mt-3 mb-2' content={data.full_name}
                                    contentStyles={{ borderRadius: 0, fontSize: 'calc(48px)', width: '100%', height: '100%'}}
                                    style={{ height: '110px', width: '110px' }}
                            />
                            <div className='d-flex flex-column align-items-center text-center'>
                                <div className='user-info'>
                                    <h4>{profile.length > 0 ? data.full_name : 'No Name'}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 className='fw-bolder border-bottom pb-50 mb-1'>Personal Details</h4>
                    <div className='info-container'>
                        {profile.length > 0 ? (
                            <ul className='list-unstyled'>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Email Address:</span>
                                    <span>{data.email_address}</span>
                                </li>

                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Phone Number:</span>
                                    <span className='text-capitalize'>{data.phone_number}</span>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Role:</span>
                                    <span>{data.role_name}</span>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Position:</span>
                                    <span>{data.position_name}</span>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Agency:</span>
                                    <span>{data.agency_name}</span>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Status:</span>
                                    <Badge className='text-capitalize' color={statusColors[data.status]}>
                                        {data.status}
                                    </Badge>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Added On:</span>
                                    <span>{formatDateAndTime(data.created_date, 'date')}</span>
                                </li>
                            </ul>
                        ) : null}
                    </div>
                    { renderUserSignature() }
                    <div className='d-flex justify-content-between pt-2'>
                        <Button className="ms-0" color='success' onClick={() => setShowSignature(true)}>Upload Signature</Button>
                        {
                            user_id === data.user_id &&
                            <Button className='ms-1' color='info' onClick={() => setShowPassword(true)}>
                                Change Password
                            </Button>
                        }

                    </div>
                </CardBody>
            </Card>

            <Modal isOpen={showPassword} toggle={() => setShowPassword(!showPassword)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setShowPassword(!showPassword)}/>
                <ModalBody className='px-sm-5 pt-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Change User Password</h1>
                    </div>
                    <Form onSubmit={onSubmitPasswordUpdate}>
                        <Alert color='warning' className='mb-2'>
                            <h4 className='alert-heading'>Ensure that this requirement is met</h4>
                            <div className='alert-body'>Minimum 8 characters long</div>
                        </Alert>
                        <Row className='gy-1 pt-75'>
                            <Col md={12} xs={12}>
                                <Label className='form-label' for='current_password'>Current Password <span className="text-danger">*</span></Label>
                                <Input type={'password'} placeholder='Enter your current password' id="current_password" value={formDataPassword.current_password} onChange={(e)=>setFormDataPassword({...formDataPassword, [e.target.id]: e.target.value})} />
                            </Col>
                            <Col md={12} xs={12}>
                                <Label className='form-label' for='new_password'>Enter New Password <span className="text-danger">*</span></Label>
                                <Input type={'password'} placeholder='Enter the new password' id="new_password" value={formDataPassword.new_password} onChange={(e)=>setFormDataPassword({...formDataPassword, [e.target.id]: e.target.value})} />
                            </Col>
                            <Col md={12} xs={12}>
                                <Label className='form-label' for='confirm_password'>Confirm Password <span className="text-danger">*</span></Label>
                                <Input type={'password'} placeholder='Confirm new password' id="confirm_password" value={formDataPassword.confirm_password} onChange={(e)=>setFormDataPassword({...formDataPassword, [e.target.id]: e.target.value})} />
                            </Col>

                            <Col xs={12} className='text-center mt-2 pt-50'>
                                <Button type='submit' className='me-1' color='danger'>Reset</Button>
                                <Button type='reset' color='secondary' outline onClick={() => {setShowPassword(false)}}>
                                    Discard
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={showSignature} toggle={() => setShowSignature(!showSignature)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setShowSignature(!showSignature)}/>
                <ModalBody className='px-sm-5 pt-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Upload Signature</h1>
                    </div>
                    <Form onSubmit={onSubmitSignatureUpdate}>
                        <Row className='gy-1 pt-75'>
                            <Col md={12} xs={12}>
                                <Label className='form-label' for='image_path'>Select Photo <span className="text-danger">*</span></Label>
                                <Input type={'file'} accept={`.png, .jpg, .jpeg`} id="image_path" onChange={onSignatureChange} />
                                <Badge color='danger'>Only .png or .jpg is allowed. Max of 1MB</Badge>
                            </Col>

                            <Col xs={12} className='text-center mt-2 pt-50'>
                                <Button type='submit' className='me-1' color='primary'>Upload</Button>
                                <Button type='reset' color='secondary' outline onClick={() => {setShowSignature(false)}}>
                                    Discard
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails
    }
}
export default connect(mapStateToProps, null)(AdminInfoCard)

