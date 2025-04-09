// ** React Imports
import { Fragment } from 'react'

// ** User Components
import UpdateUser from "@src/views/profile/view/UpdateUser";

const UserTabs = ({profile }) => {
  return (
    <Fragment>
      <UpdateUser profile={profile} />
    </Fragment>
  )
}
export default UserTabs
