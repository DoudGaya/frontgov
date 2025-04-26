import {connect} from "react-redux"
import QRCode from "react-qr-code";
// ** React Imports
import {Link} from "react-router-dom";

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
    Card,
    CardBody,
    CardHeader,
    Nav,
    NavItem, NavLink, TabContent, TabPane, Spinner,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, projectTitle, serverLink, showIcon, projectLogo} from "@src/resources/constants";
import { toast } from "react-toastify";
import axios from "axios";
import '@styles/react/pages/page-authentication.scss'
import PublicTrackerTimeline from "@src/views/file-manager/file/file-public-tracking-timeline";
import {ArrowLeft} from "react-feather";

function useQuery() {
    let currentLocation = window.location.search
    return new URLSearchParams(currentLocation);
}
const PublicFileTracking = () => {
    let query = useQuery();
    let queryData = query.get("id");
    const [isLoading, setIsLoading] = useState(true);
    const [trackingData, setTrackingData] = useState([])
    const [actionData, setActionData] = useState([])
    const [activeTab, setTabActive] = useState('tracker');
    const [formData, setFormData] = useState({
            full_name: '',
            file_id: "",
            folder_id: '',
            folder_name: '',
            file_name: "",
            file_size: "",
            file_type: "",
            file_path: "",
            action: "",
            tracking_code: "",
            created_date: "",
        })

    const getData = async (tracking_code) => {
        if (formData.tracking_code.toString().trim() === "" && queryData === null) { toast.error("Please enter your file tracking code"); return false; }
        toast.info("Please wait....")
        await axios.get(`${serverLink}file-manager/tracking/${tracking_code}`)
            .then((result) => {
                if (result.data.message === "success") {
                    setTrackingData(result.data.track)
                    setActionData(result.data.action)
                    if (result.data.file.length > 0){
                        let data = result.data.file[0];
                        setFormData({
                            ...formData,
                            tracking_code: data.tracking_code,
                            file_name: data.file_name,
                            file_size: data.file_size,
                            file_type: data.file_type,
                            file_path: data.file_path,
                            full_name: data.full_name,
                            created_date: data.created_date,
                        })
                    }
                }
                setIsLoading(false);
            })
            .catch(() => {
                toast.error(`NETWORK ERROR`)
            });

    };

    const handleSubmit = () => {
        getData(formData.tracking_code);
    }

    const handleReset = () => {
        setTrackingData([]);
        setActionData([]);
        setFormData({
            full_name: '',
            file_id: "",
            folder_id: '',
            folder_name: '',
            file_name: "",
            file_size: "",
            file_type: "",
            file_path: "",
            action: "",
            tracking_code: "",
            created_date: "",
        })
    }

    useEffect(() => {
        if (queryData !== null) {
            setFormData({
                ...formData,
                tracking_code: queryData
            })
            getData(queryData)
        }else {
            setIsLoading(false)
        }
    }, [])

    const toggleTabs = tab => {
        if (activeTab !== tab) {
            setTabActive(tab)
        }
    }

    return (  isLoading ? <div className="text-center mt-3"><Spinner color='dark' /></div>
            :
            trackingData.length > 0 ?
            <Fragment>
                <div className="auth-wrapper auth-basic px-2">
                    <div className='col-md-8 my-2'>
                        <div className="col-md-12 text-center text-uppercase d-flex justify-content-start" style={{marginTop: '-20px', marginBottom: '5px'}}>
                            <button color='primary' type="button" className="col-md-1 btn btn-primary "  onClick={handleReset}>
                                <ArrowLeft size={15}/>
                            </button>
                        </div>
                        <div className='col-md-12 my-2'>
                            <div className="col-md-12 text-center text-uppercase"><h2>File Tracking Details</h2></div>
                        </div>
                        <Card className='earnings-card'>
                            <CardBody>
                                <Row>
                                    <Col xs='3'>
                                        <QRCode
                                            size={140}
                                            value={formData.tracking_code}
                                            viewBox={`0 0 256 256`}
                                        />
                                        <div className="fw-bolder" style={{fontSize: '20px', marginLeft: '5px', marginTop: '5px'}}><b>{formData.tracking_code}</b></div>
                                    </Col>
                                    <Col xs='9'>
                                        <CardTitle className='mb-1'>{formData.file_name}</CardTitle>
                                        <div className='font-small-2 mb-1' style={{width: '30px'}}>{showIcon(formData.file_type)}</div>
                                        <h5 className='mb-1'>{formData.file_size} MB</h5>
                                        <CardText className='text-muted font-small-4'>
                                            <span className='fw-bolder'>{formatDateAndTime(formData.created_date, 'date_and_time')}</span>
                                        </CardText>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>


                        <Row>
                            <Col md='12'>
                                <Card className='text-center'>
                                    <CardHeader>
                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink
                                                    active={activeTab === 'tracker'}
                                                    onClick={() => {
                                                        toggleTabs('tracker')
                                                    }}
                                                >
                                                    Tracker
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    active={activeTab === 'action'}
                                                    onClick={() => {
                                                        toggleTabs('action')
                                                    }}
                                                >
                                                    Actions
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId='tracker'>
                                                <PublicTrackerTimeline className='ms-50 mb-0' data={trackingData}/>
                                            </TabPane>
                                            <TabPane tabId='action'>
                                                <PublicTrackerTimeline className='ms-50 mb-0' isAction={true} data={actionData}/>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Fragment>
            :
            <div className="auth-wrapper auth-basic px-2">
            <div className='auth-inner my-2'>
                <Card className='mb-0'>
                    <CardBody>
                        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
                            <img className="img-fluid" src={projectLogo} style={{width: 300}} alt="Login Cover"/>
                        </Link>
                        <CardTitle tag='h4' className='mb-1'>
                            Welcome to {projectTitle}
                        </CardTitle>
                        <CardText className='mb-2'>Please enter your file tracking code to track your file</CardText>
                        <Form className='auth-login-form mt-2'>
                            <div className='mb-1'>
                                <Label className='form-label' for='login-email'>
                                   File Tracking Code
                                </Label>
                                <Input
                                    type="text"
                                    id="tracking_code"
                                    placeholder="Enter file tracking code"
                                    autoFocus
                                    value={formData.tracking_code}
                                    onChange={(e) => setFormData({...formData, tracking_code: e.target.value})}
                                />
                            </div>

                            <Button color='primary' type="button"  onClick={handleSubmit} block>
                                Submit
                            </Button>
                            <div className="mt-2 text-center text-decoration-underline"><Link to="/login">Go to home</Link></div>
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

export default connect(mapStateToProps, null)(PublicFileTracking)
