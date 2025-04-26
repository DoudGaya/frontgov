import {
    Card, CardBody, CardTitle,
    Spinner
} from "reactstrap";
import {useEffect, useRef, useState,forwardRef } from "react";
import {connect} from "react-redux";
import QRCode from "react-qr-code";
import {formatDateAndTime} from "@src/resources/constants";
import {Calendar, MapPin} from "react-feather";
import {useReactToPrint} from "react-to-print";

const FileTrackingDetails = forwardRef((props, ref) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(()=>{
            setIsLoading(false)
        }, 2000)
    }, []);


    return ( isLoading ? <div className="text-center mt-3"><Spinner color='dark' /></div>
            :

            <div className="row">
                <div className='blog-wrapper d-flex justify-content-center'>
                    <Card className='col-md-8 card-developer-meetup'  ref={ref}>
                        <div className='meetup-img-wrapper rounded-top text-center'>
                            <QRCode
                                size={440}
                                value={props.formData.tracking_code}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <CardBody>
                            <div className='meetup-header d-flex align-items-center w-100'>
                                <div className='meetup-day'>
                                    <h6 className='mb-0'>{props.formData.file_type}</h6>
                                    <h5 className='mb-0'>{props.formData.file_size} MB</h5>
                                </div>
                                <div className='my-auto'>
                                    <CardTitle tag='h4' className='mb-25'>
                                        {props.formData.file_name}
                                    </CardTitle>
                                </div>
                            </div>
                            <div className='d-flex'>
                                <div className="d-flex align-items-center">
                                    <div className="avatar rounded bg-light-info" style={{marginRight: '15px'}}>
                                        <span className="avatar-content">
                                            <Calendar size={18} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h6 className='mb-0'>{formatDateAndTime(props.formData.created_date, 'date_and_time')}</h6>
                                    <small>Date Created</small>
                                </div>
                            </div>
                            <div className='d-flex mt-2'>
                                <div className="d-flex align-items-center"><div className="avatar rounded bg-light-info" style={{marginRight: '15px'}}><span className="avatar-content">
                                    <MapPin size={18} />
                                </span>
                                </div>
                                </div>
                                <div>
                                    <h6 className='mb-0'>{props.formData.tracking_code}</h6>
                                    <small>Tracking Code</small>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                </div>
                <button
                    type="button"
                    className="btn btn-sm btn-primary "
                    style={{ marginBottom: "15px" }}
                    onClick={window.print}
                >
                    Print
                </button>
            </div>
    )
})

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(FileTrackingDetails)