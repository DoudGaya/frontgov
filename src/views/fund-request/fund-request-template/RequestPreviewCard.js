import {
    Card,
    CardBody,
    CardText,
    Row,
    Col
} from 'reactstrap'
import {useReactToPrint} from "react-to-print";
import logo from '../../../assets/images/logo/logo.png'
import './style.css';
import {currencyConverter, formatDateAndTime, projectTitle, serverLink} from "@src/resources/constants";
import MinuteTimeline from "@src/views/fund-request/MinuteTimeline";

const RequestPreviewCard = ({ actions, employeeList, loginData, reloadData, requestData, requestItems, componentRef}) => {
    const signature =  requestData.length > 0 && employeeList.filter(e=>e.user_id === requestData[0].request_from_id).length > 0 ?
        employeeList.filter(e=>e.user_id === requestData[0].request_from_id)[0].signature : null;
    console.log(employeeList);
    console.log(signature);
    useReactToPrint({
        content: () => componentRef.current,
    });
    return <div ref={componentRef}>
        <Card className='invoice-preview-card break-after'>
            <CardBody className='invoice-padding pb-0 inner-content'>
                {/* Header */}
                <div className='custom-container d-flex justify-content-between align-content-start  invoice-spacing mt-0'>
                    <div className="custom-logo">
                        <div className='logo-wrapper'>
                            <img src={logo} width={160} height={150} alt={projectTitle}/>
                        </div>
                        <h2>{projectTitle}</h2>

                    </div>
                    <div className='custom-date mt-md-0 mt-2'>
                        <h4 className='invoice-title move-right'>
                            Requested Date: <span className='invoice-number'>{requestData.length > 0 && formatDateAndTime(requestData[0].created_date, 'date')}</span>
                        </h4>
                    </div>
                </div>
                <div className='text-center move-center mb-5' style={{marginTop: '-15px'}}>
                    <p className='text-uppercase  h3'><b>{requestData.length > 0 && `${requestData[0].agency_name_from} Fund Request` }</b></p>
                </div>

                <div className="header-card" style={{display: 'none', marginTop: '40px', padding: '5px'}}>
                    <div className="caption-header d-flex justify-content-start align-content-start ">
                        <div className="caption-msg">To:</div>
                        <div className="title-msg">{requestData.length > 0 && `${requestData[0].request_to_name} (${requestData[0].request_to_position}, ${requestData[0].agency_name_to})`}</div>
                    </div>

                    <div className="caption-header d-flex justify-content-start align-content-start ">
                        <div className="caption-msg">From:</div>
                        <div className="title-msg">{requestData.length > 0 && `${requestData[0].request_from_name} (${requestData[0].request_from_position}, ${requestData[0].agency_name_from})`}</div>
                    </div>
                    <p></p>
                    <div className="caption-header d-flex justify-content-start align-content-start ">
                        <div className="caption-msg">Subject: </div>
                        <div className="title-msg"><b className="text-uppercase">{requestData.length > 0 && requestData[0].subject}</b></div>
                    </div>
                    <hr style={{ width: '100%', border: '1px solid #050505'}}  />
                </div>

                <table className="hide-on-print" style={{textAlign: 'left', marginTop: '20px'}}>
                    <thead>
                    <tr>
                        <th width={90}><h6>To: </h6></th>
                        <td><h6>{requestData.length > 0 && `${requestData[0].request_to_name} (${requestData[0].request_to_position}, ${requestData[0].agency_name_to})`}</h6></td>
                    </tr>
                    <tr>
                        <th width={90}><h6>From: </h6></th>
                        <td><h6><b>{requestData.length > 0 && `${requestData[0].request_from_name} (${requestData[0].request_from_position}, ${requestData[0].agency_name_from})`}</b></h6></td>
                    </tr>
                    <tr><td>&nbsp;</td></tr>
                    <tr>
                        <th width={90}><h6>Subject: </h6></th>
                        <td><h6 className="text-uppercase"><b>{requestData.length > 0 && requestData[0].subject}</b></h6></td>
                    </tr>
                    </thead>
                </table>
                {/* /Header */}
            </CardBody>

            <hr className="hide-on-print" style={{marginLeft: '35px', marginRight: '40px', marginTop: '3px', border: '1px solid #050505'}}  />

            <CardBody className='invoice-padding pt-0 inner-content'>
                <CardText dangerouslySetInnerHTML={{__html: requestData.length > 0 && requestData[0].body}}/>

                <div className={'mt-2 mb-2'}>
                    <h4>Budget Details</h4>

                    <table className="table table-striped table-bordered">
                        <tbody>
                        <tr>
                            <th>Agency/Ministry</th>
                            <td>{requestData.length > 0 && requestData[0].agency_name_from}</td>
                        </tr>
                        <tr>
                            <th>Budget Code</th>
                            <td>{requestItems.length > 0 && requestItems[0].budget_code}</td>
                        </tr>
                        <tr>
                            <th>Budget Year</th>
                            <td>{requestItems.length > 0 && requestItems[0].budget_year}</td>
                        </tr>
                        <tr>
                            <th>Budget Description</th>
                            <td>{requestItems.length > 0 && requestItems[0].budget_description}</td>
                        </tr>
                        <tr>
                            <th>Budget Total</th>
                            <td>{requestItems.length > 0 && currencyConverter(requestItems[0].approved_amount)}</td>
                        </tr>
                        <tr>
                            <th>Total Collected</th>
                            <td>{requestItems.length > 0 && currencyConverter(requestItems[0].collected_amount)}</td>
                        </tr>
                        <tr>
                            <th>Budget Total Balance</th>
                            <td>{requestItems.length > 0 && currencyConverter(requestItems[0].remaining_amount)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className={'mt-2 mb-2'}>
                    <h4>Requested Items</h4>

                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Decision</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            requestItems.length > 0 &&
                            requestItems.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.item_name}</td>
                                        <td>{item.item_description}</td>
                                        <td>{item.quantity}</td>
                                        <td>{currencyConverter(item.unit_price)}</td>
                                        <td>{currencyConverter(item.total)}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>

                <div className={'mt-2 mb-2'}>
                    <h4>Budget Decision</h4>

                    <table className="table table-striped table-bordered">
                        <tbody>
                        <tr>
                            <th>Total Requested</th>
                            <td>{requestData.length > 0 && currencyConverter(requestData[0].total_requested)}</td>
                        </tr>
                        <tr>
                            <th>Total Approved</th>
                            <td>{requestData.length > 0 && currencyConverter(requestData[0].total_approved)}</td>
                        </tr>
                        <tr>
                            <th>Total Paid</th>
                            <td>{requestData.length > 0 && currencyConverter(requestData[0].total_paid)}</td>
                        </tr>
                        <tr>
                            <th>Request Status</th>
                            <td>{requestData.length > 0 && requestData[0].status}</td>
                        </tr>
                        <tr>
                            <th>Payment Status</th>
                            <td>{requestData.length > 0 && requestData[0].payment_status}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </CardBody>

            <CardBody className='invoice-padding pb-0 inner-content'>
                <Row className='invoice-sales-total-wrapper'>
                    <Col className='mt-md-0 mt-3' md='6' order={{md: 1, lg: 2}}>
                        {
                            signature !== null &&
                            <img crossOrigin="anonymous" src={`${serverLink}public/upload/user/${signature}`} width={'60px'}
                                 style={{backgroundColor: 'transparent'}}
                                 alt={`${requestData.length > 0 && requestData[0].request_from_name} signature`}/>
                        }
                        <CardText className='mb-0'>
                            <h4>{requestData.length > 0 && requestData[0].request_from_name}</h4>
                            <span>
                                        {
                                            requestData.length > 0 && requestData[0].request_from_position}, {requestData.length > 0 &&
                            employeeList.filter(e => e.user_id === requestData[0].request_from_id).length > 0 ?
                                employeeList.filter(e => e.user_id === requestData[0].request_from_id)[0].agency_name : null
                            }
                                    </span>
                        </CardText>
                    </Col>
                </Row>
            </CardBody>

            <hr className='invoice-spacing'/>
        </Card>
        {
            actions.length > 0 ?
                <Col md='12'>
                    <Card className='text-center'>
                        <CardBody>
                            <div className="col-md-12 mt-3" style={{paddingLeft: '30px', paddingRight: '30px'}}>
                                <hr/>
                                <h3>Memo Minutes & Actions</h3>
                                <hr/>
                            </div>
                            <MinuteTimeline
                                className='ms-50 mb-0'
                                actions={actions}
                                actionFiles={[]}
                                employeeList={employeeList}
                                loginData={loginData}
                                reloadData={reloadData}
                                requestData={requestData}

                            />
                        </CardBody>
                    </Card>
                </Col>
                : <></>
        }

    </div>
}
export default RequestPreviewCard;