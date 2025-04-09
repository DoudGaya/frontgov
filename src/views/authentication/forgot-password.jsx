// ** React Imports
import {Link} from "react-router-dom";

// ** Custom Hooks

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Reactstrap Imports
import {
    Row,
    Col,
    CardTitle,
    CardText,
    Form,
    Label,
    Input,
    Button,
} from "reactstrap";

// ** Illustrations Imports

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import {useState} from "react";
import {randomToken, serverLink} from "@src/resources/constants";
import {toast} from "react-toastify";
import axios from "axios";
import Logo from "@src/assets/images/logo/logo.png";

const ForgotPassword = () => {
    const [formData, setFormData] = useState({email_address: '', token: ''})
    // ** Hooks

    const handlePasswordReset = async () => {
        const sendData = {
            ...formData,
            token: randomToken()+randomToken()
        }
        if (formData.email_address === '') {
            toast.error("Please enter your registered email address")
            return false;
        }
        if (!formData.email_address.includes('@') || !formData.email_address.includes('.')) {
            toast.error('Please enter a valid email address');
            return false;
        }
        toast.info('Submitting...')
        await axios.patch(`${serverLink}login/forget_password/add_token`, sendData)
            .then(res => {
                if (res.data.message === 'success') {
                    toast.success('A reset password has been sent to your registered email')
                    setFormData({...formData, email_address: ''})
                } else {
                    toast.error(res.data.message)
                }
            }).catch(err => {
                toast.error('Network error')
            })
    }

    return (
        <div className="auth-wrapper auth-cover">
            <Row className="auth-inner m-0">
                <Col
                    className="d-flex align-items-center auth-bg px-2 p-lg-5 offset-4"
                    lg="4"
                    sm="12"
                >
                    <Col className="px-xl-2 mx-auto text-center" sm="8" md="6" lg="12">
                        <img className="img-fluid align-content-between" src={Logo} style={{width: 200}} alt="Login Cover"/>

                        <CardTitle tag="h2" className="fw-bold mb-1">
                            Forgot Password? 🔒
                        </CardTitle>
                        <CardText className="mb-2">
                            Enter your email and we'll send you instructions to reset your
                            password
                        </CardText>
                        <Form
                            className="auth-forgot-password-form mt-2"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="mb-1">
                                <Label className="form-label" for="login-email">
                                    Email
                                </Label>
                                <Input type="email" id="login-email"
                                       onChange={(e) => setFormData({...formData, email_address: e.target.value})}
                                       placeholder="Enter your registered email" autoFocus/>
                            </div>
                            <Button color="primary" block onClick={handlePasswordReset}>
                                Send reset link
                            </Button>
                        </Form>
                        <p className="text-center mt-2">
                            <Link to="/login">
                                <ChevronLeft className="rotate-rtl me-25" size={14}/>
                                <span className="align-middle">Back to login</span>
                            </Link>
                        </p>
                    </Col>
                </Col>
            </Row>
        </div>
    );
};

export default ForgotPassword;
