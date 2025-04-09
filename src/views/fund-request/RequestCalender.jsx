import React, {Fragment, useEffect, useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import {connect} from "react-redux";
import axios from "axios";
import {serverLink} from "@src/resources/constants";
import {Badge} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {setGeneralDetails} from "@store/actions";

const RequestCalender = props => {
    const login_data = props.loginData[0];
    const [isLoading, setIsLoading] = useState(true);
    const [requestList, setRequestList] = useState([]);
    const navigate = useNavigate();

    const getRecord = async () => {
        await axios.get(`${serverLink}request/calendar/${login_data.user_id}`, login_data.token)
            .then(res => {
                if (res.data.message === "success") {
                    const requests = res.data.requests;
                    let request_array = []
                    if (requests.length > 0) {
                        requests.map(request => {
                            let color;
                            if (request.status === 'completed')
                                color = '#7367f0'
                            else if (request.status === 'processing')
                                color = '#05f5a9'
                            else if (request.status === 'cancelled')
                                color = '#ff0000'
                            else
                                color = '#fac80b'

                            request_array.push({
                                id: request.request_id,
                                title: request.subject,
                                start: new Date(request.created_date),
                                color: color
                            });
                        })
                    }
                    setRequestList(request_array)
                    setIsLoading(false)
                }
            }).catch(err => console.log(err))
    }
    const handleEventClick = (clickInfo) => {
        props.setOnGeneralDetails(clickInfo)
        navigate('/fund-request');
    }

    useEffect(() => {
        getRecord()
    },[])

    return (
        <Fragment>

            {
                isLoading ?
                    <SpinnerLoader/> :
                    <div>
                        <div className="mb-1">
                            <Badge color='primary'>
                                Completed
                            </Badge>
                            {' '}
                            <Badge color='warning'>
                                New
                            </Badge>
                            {' '}
                            <Badge color='success'>
                                Processing
                            </Badge>
                            {' '}
                            <Badge color='danger'>
                                Cancelled
                            </Badge>
                        </div>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            initialView='dayGridMonth'
                            weekends={true}
                            events={requestList} // alternatively, use the `events` setting to fetch from a feed
                            eventClick={(e) => handleEventClick(e.event.id)}
                        />
                    </div>
            }
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setOnGeneralDetails: (p) => {
            dispatch(setGeneralDetails(p))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RequestCalender)
