// ** React Import
import { Fragment, useState } from 'react'
// ** Reactstrap Imports
import {
    Modal,
    ModalBody,
    ModalHeader,
} from 'reactstrap'

const MiddleModal = ( props) => {
    return (
        <Fragment>
            <Modal
                key={props.id ?? 'default-modal'}
                isOpen={props.open}
                toggle={props.toggleSidebar}
                className={`modal-dialog-centered ${props.size ?? 'modal-xl'}`}
            >
                <ModalHeader className='bg-transparent' toggle={props.toggleSidebar}></ModalHeader>
                <ModalBody className='pb-5 px-sm-4 mx-50'>
                    <h1 className='address-title text-center mb-1'>{props.title ?? ''}</h1>
                    {props.subtitle ? <h6 className="text-center">{props.subtitle}</h6> : ''}
                    {/*<p className='address-subtitle text-center mb-2 pb-75'>{props.title ?? ''}</p>*/}
                    <div className="row">
                        {props.children}
                    </div>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default MiddleModal
