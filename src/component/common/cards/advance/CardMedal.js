// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'
// ** Images
import medal from '@src/assets/images/illustration/badge.svg'
import {Link} from "react-router-dom";
import {Settings} from "react-feather";
import {connect} from "react-redux";

const CardMedal = ({title, caption, link, counter }) => {
  return (
    <Card className='card-congratulations-medal'>
      <CardBody>
        <h5>{title}</h5>
        <CardText className='font-small-3'>{caption}</CardText>
        <h3 className='mb-75 mt-2 pt-50'>
          <Link a={link}>
            {counter}
          </Link>
        </h3>
        <img className='congratulation-medal' src={medal} alt='Medal Pic' />
        <Link className="me-1 btn btn-outline-secondary" to="/account-settings"><Settings size={18}/>  Account Settings</Link>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    loginData: state.LoginDetails,
  }
}

export default connect(mapStateToProps, null)(CardMedal)
