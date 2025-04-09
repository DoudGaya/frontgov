// ** React Imports
import {Fragment, useEffect, useState} from 'react'

// ** request Components Imports
import RequestCard from './RequestCard'
import RequestDetails from './RequestDetails'
import ComposePopUp from './ComposePopup'

// ** Utils
import {formatDateToMonthShort} from '@utils'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'
import {Menu, Search} from 'react-feather'

// ** Reactstrap Imports
import {
    Input,
    InputGroup,
    InputGroupText,
} from 'reactstrap'

const Requests = props => {
    // ** Props
    const {
        openRequest,
        composeOpen,
        setOpenRequest,
        toggleCompose,
        setSidebarOpen,
        requestList,
        employeeList,
        reloadData,
        search,
        handleSearch,
        loginData,
        requestLabel,
        requestActions,
        requestFiles,
        requestTracker,
        requestActionFiles,
        activeFolder,
        fullRequestList,
        access_type,
        calendarRequest,
        budgetList,
        budgetItemList,
        requestItemsList
    } = props

    const [selectedRequest, setSelectedRequest] = useState([])
    const [selectedRequestFiles, setSelectedRequestFiles] = useState([])
    const [selectedRequestLabel, setSelectedRequestLabel] = useState([])
    const [selectedRequestTracker, setSelectedRequestTracker] = useState([])
    const [selectedRequestActions, setSelectedRequestActions] = useState([])
    const [selectedRequestActionFiles, setSelectedRequestActionFiles] = useState([])
    const [selectedRequestItems, setSelectedRequestItems] = useState([])
    const [isRead, setIsRead] = useState(false)

    // ** States

    // ** Variables
    const labelColors = {
        personal: 'success',
        important: 'primary',
        urgent: 'info',
        confidential: 'danger',
    }

    const handleRequestClick = (request, action='initial') => {
        setSelectedRequest(fullRequestList.filter(e => e.request_id === request))
        setSelectedRequestFiles(requestFiles.filter(e => e.request_id === request))
        setSelectedRequestLabel(requestLabel.filter(e => e.request_id === request))
        setSelectedRequestTracker(requestTracker.filter(e => e.request_id === request))
        setSelectedRequestActions(requestActions.filter(e => e.request_id === request))
        setSelectedRequestActionFiles(requestActionFiles.filter(e => e.request_id === request))
        setSelectedRequestItems(requestItemsList.filter(e => e.request_id === request))
        if (action === 'initial') {
            setOpenRequest(!openRequest)
        }
    }

    useEffect(() => {
        if (selectedRequest.length > 0) {
            handleRequestClick(selectedRequest[0].request_id, 'refresh');
        }
    }, [fullRequestList]);

    useEffect(() => {
        if (calendarRequest !== 0) {
            handleRequestClick(calendarRequest, 'initial')
        }
    }, [calendarRequest]);

    // ** Renders request
    const renderRequests = () => {
        if (requestList.length) {
            return requestList.map((request, index) => {
                return (
                    <RequestCard
                        key={index}
                        request={request}
                        requestLabel={requestLabel.filter(e=>e.request_id === request.request_id)}
                        requestAttachment={requestFiles.filter(e=>e.request_id === request.request_id).length}
                        requestTracker={requestTracker.filter(e=>e.request_id === request.request_id)}
                        labelColors={labelColors}
                        handleRequestClick={handleRequestClick}
                        formatDateToMonthShort={formatDateToMonthShort}
                        isRead={isRead}
                        setIsRead={setIsRead}
                        loginData={loginData}
                        reloadData={reloadData}
                        activeFolder={activeFolder}
                    />
                )
            })
        }
    }

    return (
        <Fragment>
            <div className='email-app-list'>
                <div className='app-fixed-search d-flex align-items-center'>
                    <div className='sidebar-toggle d-block d-lg-none ms-1' onClick={() => setSidebarOpen(true)}>
                        <Menu size='21'/>
                    </div>
                    <div className='d-flex align-content-center justify-content-between w-100'>
                        <InputGroup className='input-group-merge'>
                            <InputGroupText>
                                <Search className='text-muted' size={14}/>
                            </InputGroupText>
                            <Input
                                id='email-search'
                                placeholder='Search request'
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                </div>

                <PerfectScrollbar className='email-user-list' options={{wheelPropagation: false}}>
                    {requestList.length ? (
                        <ul className='email-media-list'>{renderRequests()}</ul>
                    ) : (
                        <div className='no-results d-block'>
                            <h5>No Request Found</h5>
                        </div>
                    )}
                </PerfectScrollbar>
            </div>

            <RequestDetails
                openRequest={openRequest}
                requestData={selectedRequest}
                requestFiles={selectedRequestFiles}
                requestItems={selectedRequestItems}
                labels={selectedRequestLabel}
                tracker={selectedRequestTracker}
                actions={selectedRequestActions}
                actionFiles={selectedRequestActionFiles}
                labelColors={labelColors}
                setOpenRequest={setOpenRequest}
                isRead={isRead}
                setIsRead={setIsRead}
                reloadData={reloadData}
                loginData={loginData}
                employeeList={employeeList}
                access_type={access_type}
                composeOpen={composeOpen}
                toggleCompose={toggleCompose}
            />
            <ComposePopUp composeOpen={composeOpen} toggleCompose={toggleCompose} employeeList={employeeList} budgetList={budgetList}
                          loginData={loginData} reloadData={reloadData} budgetItemList={budgetItemList} type={'new'} request={[]}
            />
        </Fragment>
    )
}


export default Requests;

