// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Alert } from 'reactstrap'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'
import Dashboard from '../../dashboard'

const BoxedLayout = () => {
  return (
    <Fragment>
      <Breadcrumbs title='Layout Boxed' data={[{ title: 'Layouts' }, { title: 'Layout Boxed' }]} />
      <Alert color='primary'>
        <div className='alert-body'>
          <span className='fw-bold'>Info: </span>
          <span>
            Please check the{' '}
            <a
              href='https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/development/page-layouts'
              target='_blank'
            >
              Layout boxed documentation
            </a>{' '}
            for more details.
          </span>
        </div>
      </Alert>
      <Dashboard />
    </Fragment>
  )
}

export default BoxedLayout
