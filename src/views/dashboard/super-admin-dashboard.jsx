// ** React Imports
import {useEffect, useState} from 'react'

// ** Reactstrap Imports
import {Row, Col, CardBody, CardText, Card} from 'reactstrap'

import StatsCard from '@src/views/ui-elements/cards/statistics/StatsCard'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import {connect} from "react-redux";
import axios from "axios";
import {currencyConverter, projectTitle, serverLink, sumObjectArray} from "@src/resources/constants";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
import {File, FilePlus, Folder, Inbox, TrendingUp, UserCheck, Users, UserX} from "react-feather";

const SuperAdminDashboard = (props) => {
    const login_data = props.loginData[0]
    // ** Context
    const [isLoading, setIsLoading] = useState(true)

    const [usersStats, setUsersStats] = useState([]);
    const [generalStats, setGeneralStats] = useState([]);
    const [requestStats, setRequestStats] = useState([]);
    const [inventoryOrderStats, setInventoryOrderStats] = useState([]);
    const [budgetStats, setBudgetStats] = useState([]);

    const getRecord = async () => {
        await axios.get(`${serverLink}report/dashboard/super-admin`, login_data.token)
            .then((res) => {
                if (res.data.message === "success") {
                    setIsLoading(false)
                    const data = res.data;
                    const agency_list = data.agency_list;
                    const budget_list = data.budget_list;
                    const request_list = data.request_list;
                    const user_list = data.user_list;
                    const inventory_order_list = data.inventory_order_list;
                    setUsersStats([
                        {title: user_list.length, subtitle: 'Total Users', color: 'light-primary', icon: <Users size={24} />},
                        {title: user_list.filter(e=>e.status==='active').length, subtitle: 'Active Users', color: 'light-info', icon: <UserCheck size={24} />},
                        {title: user_list.filter(e=>e.status!=='active').length, subtitle: 'Inactive Users', color: 'light-danger', icon: <UserX size={24} />},
                    ])

                    setGeneralStats([
                        {title: agency_list.length, subtitle: 'Total Agencies', color: 'light-primary', icon: <Folder size={24} />},
                        {title: budget_list.length, subtitle: 'Total Budgets', color: 'light-info', icon: <File size={24} />},
                        {title: request_list.length, subtitle: 'Total Requests', color: 'light-success', icon: <FilePlus size={24} />}
                    ])

                    setRequestStats([
                        {title: currencyConverter(sumObjectArray(request_list, 'total_requested')), subtitle: 'Total Requested', color: 'light-primary', icon: <TrendingUp size={24} />},
                        {title: currencyConverter(sumObjectArray(request_list, 'total_approved')), subtitle: 'Total Approved', color: 'light-success', icon: <TrendingUp size={24} />},
                        {title: currencyConverter(sumObjectArray(request_list, 'total_paid')), subtitle: 'Total Paid', color: 'light-danger', icon: <TrendingUp size={24} />}
                    ])

                    setInventoryOrderStats([
                        {title: inventory_order_list.length, subtitle: 'Total Order', color: 'light-primary', icon: <TrendingUp size={24} />},
                        {title: currencyConverter(sumObjectArray(inventory_order_list, 'total')), subtitle: 'Total Amount', color: 'light-danger', icon: <Inbox size={24} />}
                    ])

                    setBudgetStats([
                        {title: currencyConverter(sumObjectArray(budget_list, 'approved_amount')), subtitle: 'Total Budget', color: 'light-primary', icon: <TrendingUp size={24} />},
                        {title: currencyConverter(sumObjectArray(budget_list, 'collected_amount')), subtitle: 'Total Collected', color: 'light-success', icon: <TrendingUp size={24} />},
                    ])




                }
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        getRecord();
    }, []);

    return isLoading ? <SpinnerLoader/> : (
        <div id='dashboard-ecommerce'>
            <Row className='match-height'>
                <Col xl='4' md='6' xs='12'>
                    <Card className='card-congratulations-medal'>
                        <CardBody>
                            <h5>Welcome to {projectTitle}, {login_data.first_name}!</h5>
                            <CardText>{login_data.position_name}, {login_data.agency_name}</CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl='8' md='6' xs='12'>
                    <StatsCard title={'Registered Users'} cols={{ xl: '4', sm: '6' }} data={usersStats} />
                </Col>
            </Row>

            <Row>
                <Col xl='12' md='12' xs='12'>
                    <StatsCard title={'Payment Request'} cols={{ xl: '4', sm: '6' }} data={requestStats} />
                </Col>
            </Row>

            <Row>
                <Col xl='6' md='6' xs='12'>
                    <StatsCard title={'General'} cols={{ xl: '4', sm: '6' }} data={generalStats} />
                </Col>
                <Col xl='6' md='6' xs='12'>
                    <StatsCard title={'Inventory Orders'} cols={{ xl: '6', sm: '6' }} data={inventoryOrderStats} />
                </Col>
            </Row>

            <Row>
                <Col xl='12' md='12' xs='12'>
                    <StatsCard title={'Budget Stats'} cols={{ xl: '6', sm: '6' }} data={budgetStats} />
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails
    }
}

export default connect(mapStateToProps, null)(SuperAdminDashboard)
