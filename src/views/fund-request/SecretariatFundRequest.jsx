import React, {useEffect} from 'react'
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
import FundRequestApp from "@src/views/fund-request/index";

const SecretariatFundRequest = ({loginData}) => {
    const navigate = useNavigate();
    const login = loginData[0];
    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'fund_request_secretariat').length < 1) {
            navigate('/')
        }
    }, []);
    return <FundRequestApp access_type={'secretariat'} />
}
const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails
    }
}
export default connect(mapStateToProps, null)(SecretariatFundRequest)