// ** React Imports
import {Fragment, useEffect, useState} from 'react'
// ** Third Party Components
import classnames from 'classnames'

import {ChevronLeft, Paperclip, File, Download, X, MessageSquare, MessageCircle} from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import {
    Row,
    Col,
    Badge,
    Card,
    Table,
    CardBody,
    CardHeader,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    CardFooter,
    Nav,
    NavItem,
    NavLink,
    Button,
    TabPane,
    TabContent,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap'
import {currencyConverter, encryptData, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import MinuteTimeline from "@src/views/fund-request/MinuteTimeline";
import TrackerTimeline from "@src/views/fund-request/TrackerTimeline";
import ActionPopup from "@src/views/fund-request/ActionPopup";
const RequestDetails = props => {
    // ** Props
    const {
        requestData,
        openRequest,
        labelColors,
        setOpenRequest,
        requestFiles,
        actions,
        actionFiles,
        tracker,
        labels,
        loginData,
        reloadData,
        employeeList,
        access_type,
        requestItems
    } = props
    const navigate = useNavigate();
    const [activeTab, setTabActive] = useState('comment');
    const [actionModalOpen, setActionModalOpen] = useState(false)
    const [cancelModal, setCancelModal] = useState(false)
    const toggleCancelModal = () => setCancelModal(!cancelModal);

    const [actionType, setActionType] = useState('minute')
    const toggleActionModal = (type='minute') => {
        setActionType(type)
        setActionModalOpen(!actionModalOpen)
    }
    const signature =  requestData.length > 0 && employeeList.filter(e=>e.user_id === requestData[0].request_from_id).length > 0 ?
        employeeList.filter(e=>e.user_id === requestData[0].request_from_id)[0].signature : null;

    const makeAsRead = async () => {
        await axios.post(`${serverLink}request/mark/read`, {request_id: requestData[0].request_id, user_id: loginData.user_id, full_name: loginData.full_name, position: `${loginData.position_name}, ${loginData.agency_name}`}, loginData.token)
            .then(res => {
                if (res.data.message === 'success') {
                    reloadData()
                }
            })
            .catch()
    }

    const handleOnDownload = async () => {
        toast.info('Processing...')
        await axios.post(`${serverLink}request/download`, {request_id: requestData[0].request_id, user_id: loginData.user_id, full_name: loginData.full_name, position: `${loginData.position_name}, ${loginData.agency_name}`}, loginData.token)
            .then(res => {
                if (res.data.message === 'success') {
                    navigate(`/fund-request/preview/${encryptData(requestData[0].request_id.toString())}`)
                }
            })
            .catch()
    }

    // Filter out objects where label_type is "favourite"
    const filteredRequestLabel = labels.filter(item => item.label_type !== "favourite");

    // Extract label_type values and ensure uniqueness using a Set
    const uniqueLabels = [...new Set(filteredRequestLabel.map(item => item.label_type))];

    const toggleTabs = tab => {
        if (activeTab !== tab) {
            setTabActive(tab)
        }
    }

    // ** Renders Labels
    const renderLabels = arr => {
        if (arr && arr.length) {
            return arr.map(label => (
                <Badge key={label} color={`light-${labelColors[label]}`} className='me-50 text-capitalize' pill>
                    {label}
                </Badge>
            ))
        }
    }

    const handleGoBack = () => {
        setOpenRequest(false);
        setActionModalOpen(false)
    }

    const renderAttachments = arr => {
        return arr.map((item, index) => {
            return (
                <a
                    key={index}
                    href={`${serverLink}public/upload/request/${item.file_path}`}
                    className={classnames({
                        'mb-50': index + 1 !== arr.length
                    })}
                >
                    <File size={14} />
                    <span className='text-muted fw-bolder align-text-top'>{item.file_name}</span>
                    <span className='text-muted font-small-2 ms-25'>{`(${item.file_size}MB)`}</span>
                </a>
            )
        })
    }

    const handleRequestCancellation = async () => {
        await axios.patch(`${serverLink}request/cancel`, {request_id: requestData[0].request_id, user_id: loginData.user_id, full_name: loginData.full_name, position: loginData.position}, loginData.token)
            .then(res => {
                if (res.data.message === 'success') {
                    toast.success('Request cancelled successfully')
                    toggleCancelModal();
                    reloadData();
                    handleGoBack();
                }
            })
            .catch()
    }

    useEffect(() => {
        if (openRequest === true) {
            makeAsRead()
        }
    },[openRequest])

    return (
        <div className={classnames('email-app-details', {show: openRequest})}>
            <Fragment>
                <div className='email-detail-header'>
                    <div className='email-header-left d-flex align-items-center'>
                      <span className='go-back me-1' onClick={handleGoBack}>
                        <ChevronLeft size={20}/>
                      </span>
                        <h4 className='email-subject mb-0'>{requestData.length > 0 && requestData[0].subject}</h4>
                    </div>
                    {
                        access_type === 'general' &&
                        <div className='email-header-right ms-2 ps-1'>
                            {
                                requestData.length > 0 && requestData[0].status !== 'cancelled' && requestData[0].status !== 'completed' && (requestData[0].request_to_id === loginData.user_id || actions.filter(e => e.action_to === loginData.user_id).length > 0) &&
                                <Button size={'sm'} color='primary' onClick={() => toggleActionModal('action')}>Action <MessageCircle size={12} /></Button>
                            }
                            {' '}
                            {
                                requestData.length > 0 && requestData[0].status !== 'cancelled' && requestData[0].status !== 'completed' &&
                                <Button size={'sm'} color='info' onClick={() => toggleActionModal('minute')}>Minute Request <MessageSquare size={12} /></Button>
                            }
                            {' '}
                            {
                                requestData.length > 0 && requestData[0].status !== 'cancelled' && requestData[0].status !== 'completed' && requestData[0].request_from_id === loginData.user_id &&
                                <Button size={'sm'} color='danger' onClick={toggleCancelModal}>Cancel Request <X size={12} /></Button>
                            }
                            {' '}
                            {
                                requestData.length > 0 && requestData[0].status !== 'cancelled' &&
                                <Button size={'sm'} color='warning' onClick={handleOnDownload}>Download <Download size={12} /></Button>
                            }

                        </div>
                    }
                </div>
                <PerfectScrollbar className='email-scroll-area' options={{wheelPropagation: false}}>
                    <Row>
                        <Col sm='12'>
                            <div
                                className='email-label'>{requestData.length > 0 && renderLabels(uniqueLabels)}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm='12'>
                            <Card>
                                <CardHeader className='email-detail-head'>
                                    <div className='user-details justify-content-between align-items-center col-8'>
                                        <div className='mail-items'>
                                            <h5 className='mb-0'>To: {requestData.length > 0 && `${requestData[0].request_to_name} (${requestData[0].request_to_position}, ${requestData[0].agency_name_to})`}</h5>
                                            <UncontrolledDropdown className='email-info-dropup memo-to-dropdown'>
                                                <DropdownToggle
                                                    className='font-small-3 text-muted cursor-pointer memo-to-dropdown'
                                                    tag='span' caret></DropdownToggle>
                                                <DropdownMenu>
                                                    <Table>
                                                        <tbody>
                                                        <tr>
                                                            <td>From: {requestData.length > 0 && `${requestData[0].request_from_name} (${requestData[0].request_from_position}, ${requestData[0].agency_name_from})`}</td>
                                                        </tr>
                                                        </tbody>
                                                    </Table>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </div>
                                    <div className='mail-meta-item align-items-end col-4'>
                                        <small
                                            className='mail-date-time text-muted float-end'>{requestData.length > 0 && formatDateAndTime(requestData[0].created_date, 'date_and_time')}</small>
                                    </div>
                                </CardHeader>
                                <CardBody className='mail-message-wrapper pt-2'>
                                    <div className='mail-message'
                                         dangerouslySetInnerHTML={{__html: requestData.length > 0 && requestData[0].body}}/>

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

                                    {
                                        signature !== null &&
                                        <img crossOrigin="anonymous" src={`${serverLink}public/upload/user/${signature}`} width={'60px'}
                                             style={{backgroundColor: 'transparent'}}
                                             alt={`${requestData.length > 0 && requestData[0].request_from_name} signature`}/>
                                    }
                                    <h4>{requestData.length > 0 && requestData[0].request_from_name}</h4>
                                    <span>
                                        {
                                            requestData.length > 0 && requestData[0].request_from_position}, {requestData.length > 0 &&
                                    employeeList.filter(e => e.user_id === requestData[0].request_from_id).length > 0 ?
                                        employeeList.filter(e => e.user_id === requestData[0].request_from_id)[0].agency_name : null
                                    }
                                    </span>

                                </CardBody>
                                {requestFiles && requestFiles.length > 0 ? (
                                    <CardFooter>
                                        <div className='mail-attachments'>
                                            <div className='d-flex align-items-center mb-1'>
                                                <Paperclip size={16}/>
                                                <h5 className='fw-bolder text-body mb-0 ms-50'>{requestFiles.length} {requestFiles.length > 1 ? 'Attachments' : 'Attachment'} </h5>
                                            </div>
                                            <div className='d-flex flex-column'>{renderAttachments(requestFiles)}</div>
                                        </div>
                                    </CardFooter>
                                ) : null}
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='12'>
                            <Card className='text-center'>
                                <CardHeader>
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                                active={activeTab === 'comment'}
                                                onClick={() => {
                                                    toggleTabs('comment')
                                                }}
                                            >
                                                Actions
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                active={activeTab === 'minute'}
                                                onClick={() => {
                                                    toggleTabs('minute')
                                                }}
                                            >
                                                Minutes
                                            </NavLink>
                                        </NavItem>
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
                                    </Nav>
                                </CardHeader>
                                <CardBody>
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId='comment'>
                                            <MinuteTimeline
                                                className='ms-50 mb-0'
                                                actions={actions.filter(e => e.action_type === 'action')}
                                                actionFiles={actionFiles}
                                                employeeList={employeeList}
                                                loginData={loginData}
                                                reloadData={reloadData}
                                                requestData={requestData}
                                            />
                                        </TabPane>
                                        <TabPane tabId='minute'>
                                            <MinuteTimeline
                                                className='ms-50 mb-0'
                                                actions={actions.filter(e => e.action_type === 'minute')}
                                                actionFiles={actionFiles}
                                                employeeList={employeeList}
                                                loginData={loginData}
                                                reloadData={reloadData}
                                                requestData={requestData}
                                            />
                                        </TabPane>
                                        <TabPane tabId='tracker'>
                                            <TrackerTimeline className='ms-50 mb-0' data={tracker}/>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </PerfectScrollbar>

                <ActionPopup
                    modalOpen={actionModalOpen}
                    toggleModal={toggleActionModal}
                    employeeList={employeeList}
                    loginData={loginData}
                    reloadData={reloadData}
                    requestData={requestData}
                    actionType={actionType}
                    requestItems={requestItems}
                />

                <div className={'theme-modal-danger'}>
                    <Modal isOpen={cancelModal} toggle={toggleCancelModal} className='modal-dialog-centered' modalClassName='modal-danger'>
                        <ModalHeader toggle={toggleCancelModal}>Cancel Request?</ModalHeader>
                        <ModalBody>
                            You are about to cancel this request. This action cannot be undone.
                            <hr/> Are you sure you want to proceed?
                        </ModalBody>
                        <ModalFooter>
                            <Button color={'info'} onClick={toggleCancelModal}>
                                Return
                            </Button>
                            <Button color={'danger'} onClick={handleRequestCancellation}>
                                Cancel Request Now
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </Fragment>
        </div>
    )
}

export default RequestDetails
