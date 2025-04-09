import {useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom'

// ** Third Party Components
import axios from 'axios'

// ** Reactstrap Imports
import {Row, Col, Alert, Spinner} from 'reactstrap'

// ** Styles
import '@styles/base/pages/app-invoice.scss'
import {decryptData, serverLink} from "@src/resources/constants";
import { useReactToPrint } from "react-to-print";
import {connect} from "react-redux";
import RequestPreviewCard from "@src/views/fund-request/fund-request-template/RequestPreviewCard";
import RequestPreviewAction from "@src/views/fund-request/fund-request-template/RequestPreviewAction";
const RequestPreview = (props) => {
    // ** HooksVars
    const token = props.loginData[0]?.token;
    const { slug } = useParams()
    // ** States
    const [isLoading, setIsLoading] = useState(true);
    const [employeeList, setEmployeeList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [actionList, setActionList] = useState([]);
    const [requestItemList, setRequestItemList] = useState([]);

     useEffect(() => {
        axios.get(`${serverLink}request/preview/${decryptData(slug)}`, token).then(response => {
            const data = response.data;
            if (data.message === 'success') {
                const requests = data.requests
                setEmployeeList(data.employees)
                setRequestList(requests)
                setActionList(data.actions)
                setRequestItemList(data.request_items)
            }
            setIsLoading(false)
        })
    }, [])

    const componentRef = useRef();

    const onPrintPage = () => {
        setTimeout(() => {
            handlePrint();
        }, 1000);
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return !isLoading ? requestList.length > 0 ? (
        <div className='invoice-preview-wrapper'>
            <Row className='invoice-preview'>
                <Col xl={9} md={8} sm={12}>
                    <RequestPreviewCard actions={actionList} employeeList={employeeList} loginData={props.loginData[0]} reloadData={()=>getData()} requestData={requestList} requestItems={requestItemList} componentRef={componentRef} />
                </Col>
                <Col xl={3} md={4} sm={12}>
                    <RequestPreviewAction id={slug} onPrintPage={onPrintPage}  />
                </Col>
            </Row>
        </div>
    ) : (
        <Alert color='danger'>
            <h4 className='alert-heading'>Memo Not Found</h4>
            <div className='alert-body'>
                No record found, please try again.
            </div>
        </Alert>
    ) : (
        <div className='d-flex justify-content-center align-items-center'>
            <div className="text-center mt-3 d-flex justify-content-center"><Spinner color='dark' size='sm' style={{marginRight: '8px'}}  /> Please wait...</div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(RequestPreview)
