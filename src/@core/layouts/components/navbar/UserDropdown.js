// ** React Imports
import { Link } from "react-router-dom";
// ** Third Party Components
import {
  User,
  Power,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Default Avatar Image
import {connect} from "react-redux";
import {encryptData} from "@src/resources/constants";

const UserDropdown = ({loginData}) => {
  const full_name = loginData[0]?.full_name;
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex">
          <span className="user-name fw-bold">{full_name}</span>
          <span className="user-status">{'User Profile'}</span>
        </div>
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to={`/user-profile/${encryptData(loginData[0].user_id.toString())}`}>
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        {
          loginData[0].role_id === 1 &&
            <DropdownItem tag={Link} to={`/admin-profile/${encryptData(loginData[0].user_id.toString())}`}>
              <User size={14} className="me-75" />
              <span className="align-middle">Admin Profile</span>
            </DropdownItem>
        }

        <DropdownItem tag={Link} to="/login">
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

const mapStateToProps = (state) => {
  return {
    loginData: state.LoginDetails
  }
}
export default connect(mapStateToProps, null)(UserDropdown);
