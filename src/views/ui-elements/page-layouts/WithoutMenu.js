// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Alert } from 'reactstrap'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'
import Dashboard from '../../dashboard'

const WithoutMenu = () => {
  return (
    <Fragment>
      <Breadcrumbs title='Layout without menu' data={[{ title: 'Layouts' }, { title: 'Layout without menu' }]} />
      <Alert color='primary'>
        <div className='alert-body'>
          <span className='fw-bold'>Info: </span>
          <span>
            Please check the{' '}
            <a
              href='https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/docs/development/page-layouts'
              target='_blank'
            >
              Layout without menu documentation
            </a>{' '}
            for more details.
          </span>
        </div>
      </Alert>
      <Dashboard />
    </Fragment>
  )
}

export default WithoutMenu
