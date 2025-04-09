import React, {useEffect} from 'react'
import FundRequestApp from "@src/views/fund-request/index";
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";

const FundRequest = ({loginData}) => {
    const navigate =  useNavigate();
    const login = loginData[0];
    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'fund_request').length < 1) {
            navigate('/')
        }
    }, []);

    return <FundRequestApp access_type={'general'} />
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(FundRequest)
