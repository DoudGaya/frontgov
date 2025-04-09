import {connect} from "react-redux"
import {Card, CardBody, Col, Row} from "reactstrap"
import {Fragment, useEffect, useState} from "react"
import {decryptData, serverLink} from "@src/resources/constants"
import axios from "axios"
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader"
import {Link, useNavigate, useParams} from "react-router-dom"
import UserInfoCard from "@src/views/profile/view/UserInfoCard"
import UserTabs from "@src/views/profile/view/Tabs"
import {toast} from "react-toastify"
import StatsVertical from "@components/widgets/stats/StatsVertical";
import {Eye, FileText, Layers, MessageSquare} from "react-feather";

function UserProfile(props) {
    const token = props.loginData[0].token
    const navigate = useNavigate()
    const [rebuildDashboard, setRebuildDashboard] = useState(null);
    const { slug } = useParams()
    const member_id = parseInt(decryptData(slug))
    if (!Number.isInteger(member_id)) navigate("/dashboard")
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState([])

    const getData = async () => {
        setIsLoading(true)
        await axios.get(`${serverLink}hr/user/${member_id}`, token)
            .then(res => {
                const message = res.data.message
                const data = res.data
                if (message === 'success') {
                    if (data.data.length < 1) navigate("/dashboard")
                    setProfile(data.data)
                    setIsLoading(false)
                } else {
                    toast.error(message)
                }
            })
            .catch(err => {
                console.log("NETWORK ERROR", err)
                toast.error(`NETWORK ERROR`)
            })
    }

    useEffect(() => {
        getData()
    }, [rebuildDashboard])

    return !isLoading ? (
        <div className='app-user-view'>
            <Row>
                <Col xl='12' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
                    <UserInfoCard profile={profile} setRebuildDashboard={setRebuildDashboard} reload={getData} token={token} />
                </Col>
            </Row>
        </div>
    ) : (
        <SpinnerLoader />
    )
}
const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(UserProfile)
