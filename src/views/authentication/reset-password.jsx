// ** React Imports
import {Link, useNavigate, useParams} from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

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
import illustrationsLight from "@src/assets/images/pages/forgot-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/forgot-password-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import {useEffect, useState} from "react";
import {encryptData, serverLink} from "../../resources/constants";
import {toast} from "react-toastify";
import axios from "axios";
import SpinnerLoader from "../../component/common/spinner-loader/spinner-loader";
import Logo from "@src/assets/images/logo/logo.png";

const ResetPassword = () => {
    const { slug } = useParams();
    // ** Hooks
    const { skin } = useSkin();
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({password: '', confirm_password: '', token: slug});

    const source = skin === "dark" ? illustrationsDark : illustrationsLight;

    const verifyToken = async () => {
        await axios.get(`${serverLink}login/forget_password/validate_token/${slug}`)
            .then(res => {
                if (res.data.message === 'success') {
                    setIsLoading(false);
                } else {
                    toast.error("Invalid Password Reset Token")
                }
            })
            .catch(e => {
                console.log(e)
                toast.error("Network error")
            })
    }

    const resetPassword = async () => {
        if (formData.password === '') {
            toast.error("Please enter your new password")
            return false;
        }
        if (formData.password.toString().length < 8) {
            toast.error("Your password cannot be less than 8 characters")
            return false;
        }
        if (formData.confirm_password === '') {
            toast.error("Please enter your confirm password")
            return false;
        }
        if (formData.password !== formData.confirm_password) {
            toast.error('Miss match password. Try again!');
            return false;
        }
        const sendData = {
            ...formData,
            password: encryptData(formData.password),
            confirm_password: encryptData(formData.confirm_password),
            token: slug
        }

        toast.info('Submitting...')
        await axios.patch(`${serverLink}login/forget_password/change_password`, sendData)
            .then(res => {
                if (res.data.message === 'success') {
                    toast.success('Password Changed Successfully');
                    setTimeout(() => navigate('/login'), 3000)
                } else {
                    toast.error(res.data.message)
                }
            }).catch(err => {
                toast.error('Network error')
            })
    }

    useEffect(() => {
        verifyToken();
    }, [])

    return (
        <div className="auth-wrapper auth-cover">
            {
                isLoading ? <SpinnerLoader /> : (
                    <Row className="auth-inner m-0">
                        <Col
                            className="d-flex align-items-center auth-bg px-2 p-lg-5 offset-4"
                            lg="4"
                            sm="12"
                        >
                            <Col className="px-xl-2 mx-auto text-center" sm="8" md="6" lg="12">
                                <img className="img-fluid align-content-between" src={Logo} style={{width: 200}}
                                     alt="Login Cover"/>

                                <CardTitle tag="h2" className="fw-bold mb-1">
                                    Reset Password Form 🔒
                                </CardTitle>
                                <Form
                                    className="auth-forgot-password-form mt-2"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    <div className="mb-1">
                                        <Label className="form-label" for="login-email">
                                            New Password
                                        </Label>
                                        <Input type="password" id="password"
                                               onChange={(e) => setFormData({...formData, password: e.target.value})}
                                               placeholder="Enter your new password" autoFocus/>
                                    </div>
                                    <div className="mb-1">
                                        <Label className="form-label" for="login-email">
                                            Confirm Password
                                        </Label>
                                        <Input type="password" id="confirm_password" onChange={(e) => setFormData({
                                            ...formData,
                                            confirm_password: e.target.value
                                        })} placeholder="Enter your confirm password" autoFocus/>
                                    </div>
                                    <Button color="primary" block onClick={resetPassword}>
                                        Reset Now
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
                )
            }
        </div>
    );
};

export default ResetPassword;
