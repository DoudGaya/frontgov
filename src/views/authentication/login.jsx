import {connect} from "react-redux"

// ** React Imports
import {Link, useNavigate} from "react-router-dom";
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
    CardTitle,
    CardText,
    Form,
    Label,
    Input,
    Button, Card, CardBody,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import {setGeneralDetails, setLoginDetails} from "@store/actions";
import {useContext, useEffect, useState} from "react";
import {projectTitle, serverLink} from "@src/resources/constants";
import { toast } from "react-toastify";
import axios from "axios";
import {encryptData} from "@src/resources/constants";
import Logo from "@src/assets/images/logo/logo.png";
import '@styles/react/pages/page-authentication.scss'


const LoginPage = (props) => {
    const navigate = useNavigate();
    const ability = useContext(AbilityContext)
    const [formData, setFormData] = useState({username: '', password: '', login_type: 'user'})

    const handleLogin = async (e) => {
        e.preventDefault();
        if (formData.username.toString().trim() === "") { toast.error("Please enter your email address"); return false; }
        if (formData.password.toString().trim() === "") { toast.error("Please enter your password"); return false; }
        let sendData =  {...formData, password: encryptData(formData.password)}
        toast.info("Login....")

        await axios.post(`${serverLink}login/user`, sendData)
            .then(res => {
                if (res.data.message === 'success') {
                    props.setOnLoginDetails(res.data.userData)
                    const ability_setup = {...res.data.userData[0], ability: [{action: "manage", subject: "all"}]}
                    localStorage.setItem("userData", JSON.stringify(ability_setup))
                    ability.update([{action: "manage", subject: "all"}])
                    toast.success("Login successful");
                    setTimeout(()=> {
                        navigate("/dashboard");
                    },2000)
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.log(err)
                toast.error("Network error, please try again!");
            })
    }

    useEffect(() => {
        props.setOnLoginDetails([]);
        props.setOnGeneralDetails({});
        localStorage.removeItem("userData")
    },[])

    return (
        <div className="auth-wrapper auth-basic px-2">
            <div className='auth-inner my-2'>
                <Card className='mb-0'>
                    <CardBody>
                        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
                            <img className="img-fluid" src={Logo} style={{width: 300}} alt="Login Cover"/>
                        </Link>
                        <CardTitle tag='h4' className='mb-1 text-center'>
                            Welcome to {projectTitle}
                        </CardTitle>
                        <CardText className='mb-2 text-center'>Please sign-in to your account here</CardText>
                        <Form className='auth-login-form mt-2' onSubmit={handleLogin}>
                            <div className='mb-1'>
                                <Label className='form-label' for='login-email'>
                                    Email
                                </Label>
                                <Input
                                    type="text"
                                    id="login-email"
                                    placeholder="account@youremail.com"
                                    autoFocus
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                            <div className='mb-1'>
                                <div className='d-flex justify-content-between'>
                                    <Label className='form-label' for='login-password'>
                                        Password
                                    </Label>
                                    <Link to='/forgot-password'>
                                        <small>Forgot Password?</small>
                                    </Link>
                                </div>
                                <InputPasswordToggle
                                    className="input-group-merge"
                                    id="login-password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            
                            <Button color='primary' block>
                                Sign in
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </div>

        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setOnLoginDetails: (p) => {
            dispatch(setLoginDetails(p))
        },
        setOnGeneralDetails: (p) => {
            dispatch(setGeneralDetails(p))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
