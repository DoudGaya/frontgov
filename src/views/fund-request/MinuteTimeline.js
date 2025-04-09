// ** Third Party Components
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import DOC from "@src/assets/images/icons/doc.png";
import {Button} from "reactstrap";
import {Repeat} from "react-feather";
import {useState} from "react";
import ActionReplyPopup from "@src/views/fund-request/ActionReplyPopup";

const MinuteTimeline = props => {
    // ** Props
    const { actions, actionFiles, employeeList, loginData, requestData, reloadData } = props
    const [actionModalOpen, setActionModalOpen] = useState(false)
    const [selectedAction, setSelectedAction] = useState({})
    const toggleActionModal = (action) => {
        setSelectedAction(action)
        setActionModalOpen(!actionModalOpen)
    }

    // ** Custom Tag
    return (
        <div>
            <ul className={'timeline ms-50 mb-0'}>
                {actions.map((item, i) => {
                    const color = item.action_to_status === 'pending' ? 'danger' : 'primary';
                    const signature = employeeList.filter(e => e.user_id === item.action_by).length > 0 ?
                        employeeList.filter(e => e.user_id === item.action_by)[0].signature : null;
                    const signature_reply = employeeList.filter(e => e.user_id === item.action_to).length > 0 ?
                        employeeList.filter(e => e.user_id === item.action_to)[0].signature : null;
                    return (
                        <li key={i} className={'timeline-item'}>
                            <span className={`timeline-point timeline-point-${color} timeline-point-indicator`}/>
                            <div className='timeline-event'>
                                <div className={'d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1'}>
                                    <h6>{item.action_by_name} ({item.action_by_position}, {item.action_by_agency_name})
                                        {
                                            item.action_to_name !== '' &&
                                            ` - ${item.action_to_name} (${item.action_to_position}, ${item.action_to_agency_name})`
                                        }
                                    </h6>
                                    <span
                                        className={'timeline-event-time'}>
                                    {formatDateAndTime(item.action_date, 'date_and_time')}
                                        {' '}
                                        {
                                            requestData.length > 0 && loginData.user_id === item.action_to && requestData[0].status === 'processing' && item.action_to_comment === null &&
                                            <Button color={'info'} size={'sm'} title={'Reply'}
                                                    onClick={() => toggleActionModal(item)}><Repeat size={12}/></Button>
                                        }

                                </span>
                                </div>
                                <div dangerouslySetInnerHTML={{__html: item.action}}/>
                                {
                                    actionFiles.filter(e => e.action_id === item.action_id && e.created_by === item.action_by).length > 0 && actionFiles.filter(e => e.action_id === item.action_id && e.created_by === item.action_by).map((r, i) => {
                                        return (
                                            <a href={`${serverLink}public/upload/action/${r.file_path}`} key={i}
                                               className='d-flex align-items-center mb-2'>
                                                <img crossOrigin="anonymous" className='me-1' src={DOC} alt={r.file_name} height='23'/>
                                                <div className='mb-0'>{r.file_name}</div>
                                            </a>
                                        )
                                    })
                                }
                                {
                                    signature !== null &&
                                    <img crossOrigin="anonymous" className={'d-flex align-items-center'}
                                         src={`${serverLink}public/upload/user/${signature}`} width={'60px'}
                                         style={{backgroundColor: 'transparent'}}
                                         alt={`${item.action_by_name} signature`}/>
                                }
                                <h5 className={'d-flex align-items-center'}>{item.action_by_name} ({item.action_by_position}, {item.action_by_agency_name})</h5>
                                {
                                    item.action_to_comment !== null &&
                                    <div>
                                        <hr/>
                                        <div
                                            className={'d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1'}>
                                            <h6>Replied on</h6>
                                            <span className={'timeline-event-time'}> {formatDateAndTime(item.action_to_date, 'date_and_time')} </span>
                                        </div>
                                        <div dangerouslySetInnerHTML={{__html: item.action_to_comment}}/>
                                        {
                                            actionFiles.filter(e => e.action_id === item.action_id && e.created_by === item.action_to).length > 0 && actionFiles.filter(e => e.action_id === item.action_id && e.created_by === item.action_to).map((r, i) => {
                                                return (
                                                    <a href={`${serverLink}public/upload/action/${r.file_path}`} key={i}
                                                       className='d-flex align-items-center mb-2'>
                                                        <img crossOrigin="anonymous" className='me-1' src={DOC} alt={r.file_name} height='23'/>
                                                        <div className='mb-0'>{r.file_name}</div>
                                                    </a>
                                                )
                                            })
                                        }
                                        {
                                            signature_reply !== null &&
                                            <img crossOrigin="anonymous" className={'d-flex align-items-center'}
                                                 src={`${serverLink}public/upload/user/${signature_reply}`}
                                                 width={'60px'}
                                                 style={{backgroundColor: 'transparent'}}
                                                 alt={`${item.action_to_name} signature`}/>
                                        }
                                        <h5 className={'d-flex align-items-center'}>{item.action_to_name} ({item.action_to_position}, {item.action_to_agency_name})</h5>
                                    </div>
                                }

                            </div>
                        </li>
                    )
                })}
            </ul>
            <ActionReplyPopup
                modalOpen={actionModalOpen}
                toggleModal={toggleActionModal}
                employeeList={employeeList}
                loginData={loginData}
                reloadData={reloadData}
                requestData={requestData}
                selectedAction={selectedAction}
            />
        </div>

    )
}

export default MinuteTimeline
