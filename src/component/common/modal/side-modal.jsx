// ** React Import
import { useState } from 'react'
// ** Custom Components
import Sidebar from '@components/sidebar'

const SideModal = ( props) => {
    const [plan, setPlan] = useState('basic')
    const [role, setRole] = useState('subscriber')
    const handleSidebarClosed = () => {
        setRole('subscriber')
        setPlan('basic')
    }

    return (
        <Sidebar
            size='lg'
            open={props.open}
            title={props.title ?? ''}
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={props.toggleSidebar}
            onClosed={handleSidebarClosed}
        >
            {props.children}
        </Sidebar>
    )
}

export default SideModal
