// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {Mail, Send, Star, XSquare, Plus} from 'react-feather'

// ** Reactstrap Imports
import { Button, ListGroup, ListGroupItem, Badge } from 'reactstrap'

const Sidebar = props => {
  // ** Props
  const { sidebarOpen, toggleCompose, setSidebarOpen, setOpenRequest, activeFolder, setActiveFolder, stats, access_type} = props
  // ** Functions To Handle Folder, Label & Compose
  const handleFolder = folder => {
    setActiveFolder(folder)
    setOpenRequest(false)
  }

  const handleComposeClick = () => {
    toggleCompose()
    setSidebarOpen(false)
  }

  return (
    <div
      className={classnames('sidebar-left', {
        show: sidebarOpen
      })}
    >
      <div className='sidebar'>
        <div className='sidebar-content email-app-sidebar'>
          <div className='email-app-menu'>
            {
                access_type === 'general' &&
                <div className='form-group-compose text-center compose-btn'>
                  <Button className='compose-email' color='primary' block onClick={handleComposeClick}>
                    Request Fund <Plus size={14} />
                  </Button>
                </div>
            }

            <PerfectScrollbar className='sidebar-menu-list' options={{wheelPropagation: false}}>
              <ListGroup tag='div' className='list-group-messages'>
                <ListGroupItem onClick={() => handleFolder('incoming')} active={activeFolder === 'incoming'}>
                  <Mail size={18} className='me-75' />
                  <span className='align-middle'>Incoming</span>
                  <Badge className='float-end' color={activeFolder === 'incoming' ? 'light-primary' : 'light-secondary'} pill>{stats.incoming}</Badge>
                </ListGroupItem>
                <ListGroupItem onClick={() => handleFolder('sent')} active={activeFolder === 'sent'}>
                  <Send size={18} className='me-75' />
                  <span className='align-middle'>Sent</span>
                  <Badge className='float-end' color={activeFolder === 'sent' ? 'light-primary' : 'light-secondary'} pill>{stats.sent}</Badge>
                </ListGroupItem>
                <ListGroupItem onClick={() => handleFolder('favourite')} active={activeFolder === 'favourite'}>
                  <Star size={18} className='me-75' />
                  <span className='align-middle'>Favourite</span>
                  <Badge className='float-end' color={activeFolder === 'favourite' ? 'light-primary' : 'light-secondary'} pill>{stats.fav}</Badge>
                </ListGroupItem>
                <ListGroupItem onClick={() => handleFolder('cancelled')} active={activeFolder === 'cancelled'}>
                  <XSquare size={18} className='me-75' />
                  <span className='align-middle'>Cancelled</span>
                  <Badge className='float-end' color={activeFolder === 'cancelled' ? 'light-primary' : 'light-secondary'} pill>{stats.cancelled}</Badge>
                </ListGroupItem>
              </ListGroup>

              <h6 className='section-label mt-3 mb-1 px-2'>Action</h6>
              <ListGroup tag='div' className='list-group-labels'>
                <ListGroupItem onClick={() => handleFolder('treated')} active={activeFolder === 'treated'}>
                  <span className='bullet bullet-sm bullet-warning me-1'></span>
                  Treated
                  <Badge className='float-end' color={activeFolder === 'treated' ? 'light-primary' : 'light-secondary'} pill>{stats.treated}</Badge>
                </ListGroupItem>
                <ListGroupItem onClick={() => handleFolder('pending')} active={activeFolder === 'pending'}>
                  <span className='bullet bullet-sm bullet-dark me-1'></span>
                  Pending
                  <Badge className='float-end' color={activeFolder === 'pending' ? 'light-primary' : 'light-secondary'} pill>{stats.pending}</Badge>
                </ListGroupItem>
              </ListGroup>

              <h6 className='section-label mt-3 mb-1 px-2'>Labels</h6>
              <ListGroup tag='div' className='list-group-labels'>
                <ListGroupItem onClick={() => handleFolder('personal')} active={activeFolder === 'personal'}>
                  <span className='bullet bullet-sm bullet-success me-1'></span>
                  Personal
                  <Badge className='float-end' color={activeFolder === 'personal' ? 'light-primary' : 'light-secondary'} pill>{stats.personal}</Badge>
                </ListGroupItem>
                <ListGroupItem onClick={() => handleFolder('important')} active={activeFolder === 'important'}>
                  <span className='bullet bullet-sm bullet-primary me-1'></span>
                  Important
                  <Badge className='float-end' color={activeFolder === 'important' ? 'light-primary' : 'light-secondary'} pill>{stats.important}</Badge>
                </ListGroupItem>
                <ListGroupItem onClick={() => handleFolder('urgent')} active={activeFolder === 'urgent'}>
                  <span className='bullet bullet-sm bullet-info me-1'></span>
                  Urgent
                  <Badge className='float-end' color={activeFolder === 'urgent' ? 'light-primary' : 'light-secondary'} pill>{stats.urgent}</Badge>
                </ListGroupItem>
                <ListGroupItem onClick={() => handleFolder('confidential')} active={activeFolder === 'confidential'}>
                  <span className='bullet bullet-sm bullet-danger me-1'></span>
                  Confidential
                  <Badge className='float-end' color={activeFolder === 'confidential' ? 'light-primary' : 'light-secondary'} pill>{stats.confidential}</Badge>
                </ListGroupItem>
              </ListGroup>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
