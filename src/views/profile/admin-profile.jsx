import {connect} from "react-redux"
import {Col, Row} from "reactstrap"
import {useEffect, useState} from "react"
import {decryptData, serverLink} from "@src/resources/constants"
import axios from "axios"
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader"
import {useNavigate, useParams} from "react-router-dom"
import {toast} from "react-toastify"
import AdminInfoCard from "@src/views/profile/view/AdminInfoCard";
import UpdateUser from "@src/views/profile/view/UpdateUser";

function AdminProfile(props) {
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
        if (props.loginData[0].role_id !== 1) {
            navigate('/')
        }
        getData()
    }, [rebuildDashboard])

    return !isLoading ? (
        <div className='app-user-view'>
            <Row>
                <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
                    <AdminInfoCard profile={profile} setRebuildDashboard={setRebuildDashboard} reload={getData} token={token} />
                </Col>
                <Col xl='8' lg='7' xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
                    <UpdateUser profile={profile} />
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

export default connect(mapStateToProps, null)(AdminProfile)
