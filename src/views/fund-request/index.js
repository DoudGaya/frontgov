// ** React Imports
import {Fragment, useEffect, useState} from 'react'
// ** Fund Request App Component Imports
import Requests from './Requests'
import Sidebar from './Sidebar'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
// ** Styles
import '@styles/react/apps/app-email.scss'
import axios from "axios";
import {serverLink} from "@src/resources/constants";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import {setGeneralDetails} from "@store/actions";

const FundRequestApp = (props) => {
    const login_detail = props.loginData[0];
    const token = login_detail.token;
    const [calendarRequestID, setCalendarRequestID] = useState(null);

// ** States
    const [openRequest, setOpenRequest] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [composeOpen, setComposeOpen] = useState(false)
    const [activeFolder, setActiveFolder] = useState('incoming');

    const [isLoading, setIsLoading] = useState(true);
    const [employeeList, setEmployeeList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [actionList, setActionList] = useState([]);
    const [requestFileList, setRequestFileList] = useState([]);
    const [actionFileList, setActionFileList] = useState([]);
    const [requestLabelList, setRequestLabelList] = useState([]);
    const [requestTrackerList, setRequestTrackerList] = useState([]);
    const [budgetList, setBudgetList] = useState([]);
    const [budgetItemList, setBudgetItemList] = useState([]);
    const [requestItemsList, setRequestItemsList] = useState([]);
    const [filteredRequest, setFilteredRequest] = useState([])
    const [initialRender, setInitialRender] = useState(true)
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({ incoming: 0, sent: 0, fav: 0, cancelled: 0, personal: 0, important: 0, urgent: 0, confidential: 0, treated: 0, pending: 0 });

    const getRecords = async () => {
        const link = props.access_type === 'general' ?
            `${serverLink}request/employee/${login_detail.user_id}` :
            `${serverLink}request/secretariat/${login_detail.agency_id}/${login_detail.user_id}`
        await axios.get(link, token)
            .then(res => {
                const data = res.data;
                if (data.message === 'success') {
                    const requests = data.requests
                    const labels = data.request_label
                    setEmployeeList(data.employees)
                    setRequestList(requests)
                    setActionList(data.actions)
                    setRequestFileList(data.request_files)
                    setActionFileList(data.action_files)
                    setRequestLabelList(labels)
                    setRequestTrackerList(data.request_tracker)
                    setBudgetList(data.budgets)
                    setBudgetItemList(data.budget_items)
                    setRequestItemsList(data.request_items)

                    const fav_request_ids = labels.filter(e=>e.label_type === 'favourite').map(item => item.request_id);
                    const personal_request_ids = labels.filter(e=>e.label_type === 'personal').map(item => item.request_id);
                    const urgent_request_ids = labels.filter(e=>e.label_type === 'urgent').map(item => item.request_id);
                    const confidential_request_ids = labels.filter(e=>e.label_type === 'confidential').map(item => item.request_id);
                    const important_request_ids = labels.filter(e=>e.label_type === 'important').map(item => item.request_id);

                    const request_to_me = requests.filter(e=>e.request_from_id !== login_detail.user_id);
                    let treated_request_list = [];
                    let pending_request_list = [];
                    request_to_me.length > 0 && request_to_me.map(request => {
                        const action = data.request_tracker.filter(e=>
                            e.request_id === request.request_id && e.user_id === login_detail.user_id &&
                            (
                                e.tracker.toLocaleLowerCase() === 'action recorded successfully' ||
                                e.tracker.toLocaleLowerCase() === 'replied a minute' ||
                                e.tracker.toLocaleLowerCase().includes('minuted fund request to')
                            )
                        ).length;
                        action > 0 ? treated_request_list.push(request) : pending_request_list.push(request)
                    })

                    setStats({
                        incoming: requests.filter(e=>e.request_from_id !== login_detail.user_id).length,
                        sent: requests.filter(e => e.request_from_id === login_detail.user_id && e.status !== 'drafted' && e.status !== 'cancelled').length,
                        fav: requests.filter(e => fav_request_ids.includes(e.request_id)).length,
                        cancelled: requests.filter(e => e.request_from_id === login_detail.user_id && e.status === 'cancelled').length,
                        personal: requests.filter(e => personal_request_ids.includes(e.request_id)).length,
                        important: requests.filter(e => important_request_ids.includes(e.request_id)).length,
                        urgent: requests.filter(e => urgent_request_ids.includes(e.request_id)).length,
                        confidential: requests.filter(e => confidential_request_ids.includes(e.request_id)).length,
                        treated: treated_request_list.length,
                        pending: pending_request_list.length
                    })

                    if (activeFolder === 'incoming')
                        setFilteredRequest(data.requests.filter(e=>e.request_from_id !== login_detail.user_id))
                    else if (activeFolder === 'sent')
                        setFilteredRequest(data.requests.filter(e => e.request_from_id === login_detail.user_id && e.status !== 'drafted' && e.status !== 'recalled'))
                    else if (activeFolder === 'favourite')
                        setFilteredRequest(data.requests.filter(e => fav_request_ids.includes(e.request_id)))
                    else if (activeFolder === 'recalled')
                        setFilteredRequest(data.requests.filter(e => e.request_from_id === login_detail.user_id && e.status === 'recalled'))
                    else if (activeFolder === 'personal')
                        setFilteredRequest(data.requests.filter(e => personal_request_ids.includes(e.request_id)))
                    else if (activeFolder === 'urgent')
                        setFilteredRequest(data.requests.filter(e => urgent_request_ids.includes(e.request_id)))
                    else if (activeFolder === 'confidential')
                        setFilteredRequest(data.requests.filter(e => confidential_request_ids.includes(e.request_id)))
                    else if (activeFolder === 'treated')
                        setFilteredRequest(treated_request_list)
                    else if (activeFolder === 'pending')
                        setFilteredRequest(pending_request_list)
                    else
                        setFilteredRequest(data.requests.filter(e => important_request_ids.includes(e.request_id)))
                    setInitialRender(false)
                }
            })
            .catch(() => {
                toast.error("ERROR Loading Data. Check your network and try again!")
            })
            .finally(() => setIsLoading(false))
    }
    // ** Toggle Compose Function
    const toggleCompose = () => setComposeOpen(!composeOpen)

    const handleFolderChange = () => {
        const request_to_me = requestList.filter(e=>e.request_from_id !== login_detail.user_id);
        let treated_request_list = [];
        let pending_request_list = [];
        request_to_me.length > 0 && request_to_me.map(request => {
            const action = requestTrackerList.filter(e=>
                e.request_id === request.request_id && e.user_id === login_detail.user_id &&
                (
                    e.tracker.toLocaleLowerCase() === 'action recorded successfully' ||
                    e.tracker.toLocaleLowerCase() === 'replied a minute' ||
                    e.tracker.toLocaleLowerCase().includes('minuted the request to')
                )
            ).length;
            action > 0 ? treated_request_list.push(request) : pending_request_list.push(request)
        })

        if (activeFolder === 'incoming') {
            setFilteredRequest(requestList.filter(e=>e.request_from_id !== login_detail.user_id))
        }
        else if (activeFolder === 'sent') {
            setFilteredRequest(requestList.filter(e => e.request_from_id === login_detail.user_id && e.status !== 'drafted' && e.status !== 'cancelled'))
        }
        else if (activeFolder === 'cancelled') {
            setFilteredRequest(requestList.filter(e => e.request_from_id === login_detail.user_id && e.status === 'cancelled'))
        }
        else if (activeFolder === 'favourite') {
            const fav_request_ids = requestLabelList.filter(e=>e.label_type === 'favourite').map(item => item.request_id);
            setFilteredRequest(requestList.filter(e => fav_request_ids.includes(e.request_id)))
        }
        else if (activeFolder === 'personal') {
            const fav_request_ids = requestLabelList.filter(e=>e.label_type === 'personal').map(item => item.request_id);
            setFilteredRequest(requestList.filter(e => fav_request_ids.includes(e.request_id)))
        }
        else if (activeFolder === 'important') {
            const fav_request_ids = requestLabelList.filter(e=>e.label_type === 'important').map(item => item.request_id);
            setFilteredRequest(requestList.filter(e => fav_request_ids.includes(e.request_id)))
        }
        else if (activeFolder === 'urgent') {
            const fav_request_ids = requestLabelList.filter(e=>e.label_type === 'urgent').map(item => item.request_id);
            setFilteredRequest(requestList.filter(e => fav_request_ids.includes(e.request_id)))
        }
        else if (activeFolder === 'confidential') {
            const fav_request_ids = requestLabelList.filter(e=>e.label_type === 'confidential').map(item => item.request_id);
            setFilteredRequest(requestList.filter(e => fav_request_ids.includes(e.request_id)))
        }
        else if (activeFolder === 'treated') {
            setFilteredRequest(treated_request_list)
        }
        else if (activeFolder === 'pending') {
            setFilteredRequest(pending_request_list)
        }
        else {
            setFilteredRequest(requestList.filter(e=>e.request_from_id !== login_detail.user_id))
        }
    }

    useEffect(() => {
        setCalendarRequestID(typeof props.calendarRequest === 'string' ? props.calendarRequest : null)
        props.setOnGeneralDetails({})
        getRecords()
    }, [token])

    useEffect(() => {
        if (!initialRender) {
            handleFolderChange();
        }
    }, [activeFolder])

    useEffect(() => {
        if (!initialRender) {
            if (searchQuery !== '') {
                setFilteredRequest(requestList.filter(
                    e =>
                        e.subject.toLocaleLowerCase().includes(searchQuery.toLowerCase()) || e.body.toLocaleLowerCase().includes(searchQuery.toLowerCase())
                        || e.request_from_name.toLocaleLowerCase().includes(searchQuery.toLowerCase()) || e.request_to_name.toLocaleLowerCase().includes(searchQuery.toLowerCase())
                ))
            } else {
                handleFolderChange();
            }
        }
    }, [searchQuery])

    return isLoading ? <SpinnerLoader/> : (
        <Fragment>
            <Sidebar
                setOpenRequest={setOpenRequest}
                sidebarOpen={sidebarOpen}
                toggleCompose={toggleCompose}
                setSidebarOpen={setSidebarOpen}
                activeFolder={activeFolder}
                setActiveFolder={setActiveFolder}
                stats={stats}
                access_type={props.access_type}
            />
            <div className='content-right'>
                <div className='content-body'>
                    <div
                        className={classnames('body-content-overlay', {
                            show: sidebarOpen
                        })}
                        onClick={() => setSidebarOpen(false)}
                    />
                    <Requests
                        fullRequestList={requestList}
                        requestList={filteredRequest}
                        employeeList={employeeList}
                        requestLabel={requestLabelList}
                        requestTracker={requestTrackerList}
                        requestFiles={requestFileList}
                        requestActions={actionList}
                        requestActionFiles={actionFileList}
                        budgetList={budgetList}
                        budgetItemList={budgetItemList}
                        reloadData={getRecords}
                        search={searchQuery}
                        handleSearch={setSearchQuery}
                        openRequest={openRequest}
                        setOpenRequest={setOpenRequest}
                        composeOpen={composeOpen}
                        toggleCompose={toggleCompose}
                        setSidebarOpen={setSidebarOpen}
                        loginData={login_detail}
                        activeFolder={activeFolder}
                        access_type={props.access_type}
                        calendarRequest={ calendarRequestID !== null ? parseInt(calendarRequestID) : 0}
                        requestItemsList={requestItemsList}
                    />
                </div>
            </div>
        </Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
        calendarRequest: state.GeneralDetails
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setOnGeneralDetails: (p) => {
            dispatch(setGeneralDetails(p))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundRequestApp)
