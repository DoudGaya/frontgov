import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import {connect} from "react-redux";
import SuperAdminDashboard from "@src/views/dashboard/super-admin-dashboard";
import AdminDashboard from "@src/views/dashboard/admin-dashboard";
import OfficerDashboard from "@src/views/dashboard/officer-dashboard";

const Dashboard = (props) => {
  const login_data = props.loginData[0];

  return (
      login_data.permission.filter(r=>r.permission === 'dashboard_super_admin').length > 0 ?
          <SuperAdminDashboard /> :
          login_data.permission.filter(r=>r.permission === 'dashboard_admin').length > 0 ?
              <AdminDashboard /> : <OfficerDashboard />
  )
}

const mapStateToProps = (state) => {
  return {
    loginData: state.LoginDetails
  }
}

export default connect(mapStateToProps, null)(Dashboard)
