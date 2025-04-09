// ** Custom Components & Plugins
import classnames from 'classnames'

// ** Custom Component Import
import Avatar from '@components/avatar'

// ** Utils
import {htmlToString} from '@utils'

// ** Reactstrap Imports
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap'
import {Paperclip, Star, Tag} from "react-feather";
import BlankImg from '../../assets/images/user.jpg';
import axios from "axios";
import {serverLink} from "@src/resources/constants";
const RequestCard = props => {
    // ** Props
    const {
        request,
        labelColors,
        handleRequestClick,
        formatDateToMonthShort,
        requestLabel,
        requestAttachment,
        loginData,
        reloadData,
        requestTracker,
    } = props

    const action = requestTracker.filter(e=>
        e.request_id === request.request_id && e.user_id === loginData.user_id &&
        (
            e.tracker.toLocaleLowerCase() === 'action recorded successfully' ||
            e.tracker.toLocaleLowerCase() === 'replied a minute' ||
            e.tracker.toLocaleLowerCase().includes('minuted the request to')
        )
    ).length;

    // const isRead = requestTracker > 0;
    // Filter out objects where label_type is "favourite"
    const filteredRequestLabel = requestLabel.filter(item => item.label_type !== "favourite");

    // Extract label_type values and ensure uniqueness using a Set
    const uniqueLabels = [...new Set(filteredRequestLabel.map(item => item.label_type))];

    // ** Function to render labels
    const renderLabels = arr => {
        if (arr && arr.length) {
            return arr.map(label => (
                <span key={label} className={`bullet bullet-${labelColors[label]} bullet-sm mx-50`}></span>
            ))
        }
    }

    // ** Function to handle read & mail click
    const onRequestFavourite = async (id) => {
        const sendData = {
            request_id: id,
            action: requestLabel.filter(e=>e.label_type === 'favourite').length > 0 ? 'remove' : 'add',
            user_id: loginData.user_id,
            label_type: 'favourite'
        }
        await axios.post(`${serverLink}request/favourite`, sendData, loginData.token)
            .then(res => {
                if (res.data.message === 'success') {
                    reloadData();
                }
            })
            .catch(async () => {})
    }
    const handleLabelsUpdate = async (e, id, label) => {
        e.preventDefault();
        const sendData = {
            request_id: id,
            user_id: loginData.user_id,
            label_type: label
        }
        await axios.post(`${serverLink}request/label`, sendData, loginData.token)
            .then(res => {
                if (res.data.message === 'success') {
                    reloadData();
                }
            })
            .catch(async () => {})
    }

    return (
        <li onClick={() => handleRequestClick(request.request_id)} className={classnames('d-flex user-mail', {'mail-read': action > 0})}>
            <div className='mail-left pe-50'>
                <Avatar img={BlankImg} />

                <div className='user-action'>
                    <UncontrolledDropdown  onClick={e => e.stopPropagation()}>
                        <DropdownToggle tag='span'>
                            <Tag size={18}/>
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem
                                tag='a'
                                href='/'
                                onClick={e => {
                                    e.stopPropagation()
                                    handleLabelsUpdate(e, request.request_id, 'personal');
                                }}
                                className='d-flex align-items-center'
                            >
                                <span className='bullet bullet-success bullet-sm me-50'/>
                                <span>Personal</span>
                            </DropdownItem>
                            <DropdownItem
                                tag='a'
                                href='/'
                                onClick={e => {
                                    e.stopPropagation()
                                    handleLabelsUpdate(e, request.request_id, 'important');
                                }}
                                className='d-flex align-items-center'
                            >
                                <span className='bullet bullet-primary bullet-sm me-50'/>
                                <span>Important</span>
                            </DropdownItem>
                            <DropdownItem
                                tag='a'
                                href='/'
                                onClick={e => {
                                    e.stopPropagation()
                                    handleLabelsUpdate(e, request.request_id, 'urgent');
                                }}
                                className='d-flex align-items-center'
                            >
                                <span className='bullet bullet-info bullet-sm me-50'/>
                                <span>Urgent</span>
                            </DropdownItem>
                            <DropdownItem
                                tag='a'
                                href='/'
                                onClick={e => {
                                    e.stopPropagation()
                                    handleLabelsUpdate(e, request.request_id, 'confidential');
                                }}
                                className='d-flex align-items-center'
                            >
                                <span className='bullet bullet-danger bullet-sm me-50'/>
                                <span>Confidential</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className='email-favorite'
                        onClick={(e) => {
                            e.stopPropagation()
                            onRequestFavourite(request.request_id)
                        }} >
                        <Star
                            size={14}
                            className={classnames({
                                favorite: requestLabel.filter(e=>e.label_type === 'favourite').length > 0
                            })}
                        />
                    </div>
                </div>
            </div>
            <div className='mail-body'>
                <div className='mail-details'>
                    <div className='mail-items'>
                        <h5 className='mb-25'>{request.request_from_name} <span
                            className={'text-muted small'}>({request.request_from_position}, {request.agency_name})</span></h5>
                        <span className='text-truncate'>{request.subject}</span>
                    </div>
                    <div className='mail-meta-item'>
                        {requestAttachment && requestAttachment > 0 ? <Paperclip size={14}/> : null}
                        {renderLabels(uniqueLabels)}
                        {
                            request.request_from_id !== loginData.user_id ?
                            action > 0 ?
                                <span className="bullet bullet-warning bullet-sm mx-50"></span> :
                                <span className="bullet bullet-dark bullet-sm mx-50"></span>
                                : ' '
                        }

                        <span className='mail-date'>{formatDateToMonthShort(request.created_date)}</span>
                    </div>
                </div>
                <div className='mail-message'>
                    <p className='text-truncate mb-0'>{htmlToString(request.body)}</p>
                </div>
            </div>
        </li>
    )
}

export default RequestCard
