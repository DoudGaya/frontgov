// ** Reactstrap Imports
import {Alert, Badge, Button, Card, CardBody, CardHeader, Col, Form, Input, Label, Row, Spinner} from 'reactstrap';

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {serverLink} from "@src/resources/constants";
import {encryptData} from "@src/resources/constants";
import {toast} from "react-toastify";
import axios from "axios";
import {useEffect, useState} from "react";
import Select from "react-select";
import {connect} from "react-redux";

const UpdateUser = ({profile, loginData}) => {
    const user_id = loginData[0]?.user_id;
    const token = loginData[0]?.token
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([])
    const data = profile.length > 0 ? profile[0] : []
    const [formData, setFormData] = useState({
        ...data,
        user_list: '',
        image_path: '',
        image_name: '',
        current_password: '',
        new_password: '',
        confirm_password: '',
        updated_by: '',
        operation: '0',
        user_data: {}
    })
    const getData = async () => {
        await axios.get(`${serverLink}hr/user-profile/list`, token)
            .then((result) => {
                let user_data = [];
                if (result.data.message === "success") {
                    result.data.data.map((e) => {
                        user_data.push({value: e.user_id, label: `${e.full_name} (${e.position_name}, ${e.agency_name})`})
                    })
                    setUsers(user_data)
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("NETWORK ERROR");
            });

    };

    const onUserChange = (e) => {
        setFormData({
            ...formData,
            user_list: e.value,
            user_id: e.value,
            user_data: e
        })
    }

    useEffect(() => {
        getData();
    }, []);

    const onSubmitPasswordUpdate = async (e) => {
        e.preventDefault();
        if (formData.operation.toString() === '1') {
            if(formData.image_path !== ''){
                const formDocument = new FormData()
                formDocument.append('file', formData.image_path)
                formDocument.append('user_id', formData.user_id)
                formDocument.append('updated_by', formData.user_id)
                await axios.patch(`${serverLink}hr/user/uploadSignature`, formDocument, token)
                    .then(result => {
                        if (result.data.message === 'success') {
                            toast.success("Signature Updated Successfully")
                            getData()
                            setFormData({...formData, image_path: '', image_name: '', current_password: '', new_password: '', confirm_password: ''})
                        } else {
                            toast.error(result.data.message)
                        }
                    })
                    .catch(err => {
                        console.log("NETWORK ERROR", err)
                        toast.error(`NETWORK ERROR`)
                    })
            }else{
                toast.error("Please select a photo")
                return false;
            }
        }else{
            if (formData.user_id.toString().trim() === "") { toast.error("Please select staff to proceed"); return false; }
            if (formData.new_password.toString().trim() === "") { toast.error("Please enter your new password"); return false; }
            if (formData.new_password.toString().trim().length < 8) { toast.error("Password must be at least 8 characters long"); return false; }
            if (formData.confirm_password.toString().trim() === "") { toast.error("Please enter your confirm password"); return false; }
            if (formData.new_password.toString().trim() !== formData.confirm_password.toString().trim()) { toast.error("New password and confirm password didn't match"); return false; }
            toast.info("Updating...");
            const sendData = {
                password: encryptData(formData.new_password.toString().trim()),
                user_id: formData.user_id,
                updated_by: user_id
            }

            await axios.patch(`${serverLink}login/password/update`, sendData, token)
                .then( async res => {
                    if (res.data.message === 'success') {
                        if(formData.image_path !== ''){
                            const formDocument = new FormData()
                            formDocument.append('file', formData.image_path)
                            formDocument.append('user_id', formData.user_id)
                            formDocument.append('updated_by', formData.user_id)
                            await axios.patch(`${serverLink}hr/user/uploadSignature`, formDocument, token)
                                .then(result => {
                                    if (result.data.message === 'success') {
                                        toast.success("Password & Signature Updated Successfully")
                                        getData()
                                        setFormData({...formData, image_path: '', image_name: '', current_password: '', new_password: '', confirm_password: ''})
                                    } else {
                                        toast.error(result.data.message)
                                    }
                                })
                                .catch(err => {
                                    console.log("NETWORK ERROR", err)
                                    toast.error(`NETWORK ERROR`)
                                })
                        }else{
                            toast.success("Password Updated Successfully")
                            getData()
                            setFormData({...formData, current_password: '', new_password: '', confirm_password: ''})
                        }

                    } else {
                        toast.error(res.data.message)
                    }
                })
                .catch(err => {
                    console.log("NETWORK ERROR", err)
                    toast.error(`NETWORK ERROR`)
                })
        }

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

        setFormData({
            ...formData,
            image_path: file,
            image_name: file.name
        })
    }

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };


    const onEditRadio = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    return (isLoading ? <div className="text-center mt-3 d-flex justify-content-center"><Spinner color='dark' size='sm' style={{marginRight: '8px'}}  />
               Please wait...</div>
            :
        <Card>
            <CardHeader tag='h4'>Update User's Password & Signature</CardHeader>
            <div className='react-dataTable user-view-account-projects'>
                <Card>
                    <CardBody>
                        <Form onSubmit={onSubmitPasswordUpdate}>
                            <div className=" form-group mb-1">
                                <label className="form-label">Select User</label>
                                <Select
                                    isSearchable
                                    options={users}
                                    name="users"
                                    id="users"
                                    value={formData.user_data}
                                    onChange={onUserChange}
                                />
                            </div>

                            <>
                                {
                                    formData.user_list !== '' ?
                                        <Row className='gy-1 pt-75'>
                                            <CardBody style={{marginTop: '-20px'}}>
                                                <div className='demo-inline-spacing'>
                                                    <div className='form-check'>
                                                        <Input type='radio' id='ex1-active' name='operation' defaultChecked value={'0'} onChange={onEditRadio} />
                                                        <Label className='form-check-label' for='ex1-active'>
                                                            Password & Signature
                                                        </Label>
                                                    </div>
                                                    <div className='form-check'>
                                                        <Input type='radio' name='operation' id='ex1-inactive' value={'1'} onChange={onEditRadio} />
                                                        <Label className='form-check-label' for='ex1-inactive'>
                                                            Signature only
                                                        </Label>
                                                    </div>
                                                </div>
                                            </CardBody>
                                            {
                                                formData.operation.toString() === '0' ?
                                                    <>
                                                        <Alert color='warning' className='mb-2 mt-1'>
                                                            <h4 className='alert-heading'>Ensure that this requirement is met</h4>
                                                            <div className='alert-body'>Minimum 8 characters long</div>
                                                        </Alert>
                                                        <Col md={12} xs={12}>
                                                            <Label className='form-label' for='new_password'>Enter New Password <span className="text-danger">*</span></Label>
                                                            <Input type={'password'} placeholder='Enter the new password' id="new_password" value={formData.new_password} onChange={onEdit} />
                                                        </Col>
                                                        <Col md={12} xs={12}>
                                                            <Label className='form-label' for='confirm_password'>Confirm Password <span className="text-danger">*</span></Label>
                                                            <Input type={'password'} placeholder='Confirm new password' id="confirm_password" value={formData.confirm_password} onChange={onEdit} />
                                                        </Col>
                                                        <div className='divider mt-3'>
                                                            <div className='divider-text'>Upload Signature</div>
                                                        </div>
                                                        <Col md={12} xs={12}>
                                                            <Label className='form-label' for='image_path'>Select Photo <span className="text-danger">*</span></Label>
                                                            <Input type={'file'} accept={`.png, .jpg, .jpeg`} id="image_path" onChange={onSignatureChange} />
                                                            <Badge color='danger'>Only .png or .jpg is allowed. Max of 1MB</Badge>
                                                        </Col>

                                                        <Col xs={12} className='text-center mt-2 pt-50'>
                                                            <Button type='submit' className='me-1' color='info'>Update</Button>
                                                        </Col>
                                                    </> : <div>
                                                        <div className='divider mt-3'>
                                                            <div className='divider-text'>Upload Signature</div>
                                                        </div>
                                                        <Col md={12} xs={12}>
                                                            <Label className='form-label' for='image_path'>Select Photo <span className="text-danger">*</span></Label>
                                                            <Input type={'file'} accept={`.png, .jpg, .jpeg`} id="image_path" onChange={onSignatureChange} />
                                                            <Badge color='danger'>Only .png or .jpg is allowed. Max of 1MB</Badge>
                                                        </Col>

                                                        <Col xs={12} className='text-center mt-2 pt-50'>
                                                            <Button type='submit' className='me-1' color='info'>Update</Button>
                                                        </Col>
                                                    </div>

                                            }
                                        </Row>

                                    : <></>
                                }
                            </>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </Card>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(UpdateUser);