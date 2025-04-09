// ** React Imports
import { useState } from 'react';

import {Minus, X, Trash, Paperclip} from 'react-feather';
import classnames from 'classnames'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Modal,
  Button,
  ModalBody, UncontrolledButtonDropdown
} from 'reactstrap'
// ** Utils

// ** Styles
import '@styles/react/libs/editor/editor.scss';
import '@styles/react/libs/react-select/_react-select.scss'
import {toast} from "react-toastify";
import axios from "axios";
import {serverLink} from "@src/resources/constants";
import {CustomTextArea} from "@src/component/common/CustomTextArea/custom-text-area";

const ActionReplyPopup = props => {
  // ** Props & Custom Hooks
  const { modalOpen, toggleModal, employeeList, loginData, reloadData, requestData, selectedAction } = props

  // ** States
  const [selectedAttachment, setSelectedAttachment] = useState([]);
  const initial_form = {
    action_id: '', subject: '', action_to_comment: '', action_to_email: ''
  }
  const [formData, setFormData] = useState(initial_form)

  // ** Toggles Compose POPUP
  const togglePopUp = e => {
    e.preventDefault();
    setFormData(initial_form)
    setSelectedAttachment([])
    toggleModal();
  }

  // ** Toggles Compose POPUP
  const togglePopUp2 = () => {
    setFormData(initial_form)
    setSelectedAttachment([])
    toggleModal();
  }

  const onAttachment = e => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        let data = {
          files: file,
          file_name: file.name.split('.')[0],
          file_size: (file.size/1024/1024).toFixed(2),
          file_type: file.name.split('.').pop(),
        };
        setSelectedAttachment(prevState => [...prevState, data])
      })

    }
  }

  const handleAttachmentDelete = (index) => {
    const updatedAttachments = [...selectedAttachment];

    // Remove the item at the specified index
    updatedAttachments.splice(index, 1);

    // Update the state with the modified array
    setSelectedAttachment(updatedAttachments);
  }

  const handleSend = async () => {

    const strip_body = formData.action_to_comment.toString().replace(/<[^>]*>?/gm, '');
    if (strip_body === '') { toast.error("Please write your reply"); return false }
    if (strip_body.length < 5) { toast.error("Reply must be at least 5 characters long"); return false }

    toast.info('Sending... Please wait')
    const request = requestData[0];
    const sendData = {
      ...formData,
      action_id: selectedAction.action_id,
      subject: request.subject,
      request_id: request.request_id,
      action_to: selectedAction.action_to,
      action_to_name: selectedAction.action_to_name,
      action_to_position: selectedAction.action_to_position,
      action_to_email: employeeList.filter(employee => employee.user_id === selectedAction.action_by).length > 0 ?
          employeeList.filter(employee => employee.user_id === selectedAction.action_by)[0].email_address : '',
    }

    await axios.patch(`${serverLink}request/action/update`, sendData, loginData.token)
        .then(async res => {
          if (res.data.message === 'success') {
            if (selectedAttachment.length > 0) {
              const fd = new FormData();
              selectedAttachment.map((item) => {
                fd.append('action_id', selectedAction.action_id)
                fd.append('request_id', request.request_id)
                fd.append('created_by', selectedAction.action_to)
                fd.append('file_type', item.file_type)
                fd.append('file_size', item.file_size)
                fd.append('file_name', item.file_name)
                fd.append('files', item.files)
              })
              await axios.patch(`${serverLink}request/action/upload`, fd, loginData.token)
                  .then(() => {
                    toast.success("Reply submitted successfully")
                    togglePopUp2()
                    reloadData()
                  })
                  .catch(() => {
                    toast.error("Something went wrong uploading files. Please try again!");
                  });
            } else {
              toast.success("Reply submitted successfully")
              togglePopUp2()
              reloadData()
            }

          } else {
            toast.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
          toast.error("Network error: Please try again!")
        })
  };

  return (
    <Modal
      scrollable
      fade={false}
      keyboard={false}
      backdrop={false}
      id='compose-mail'
      container='.content-body'
      className='modal-lg'
      isOpen={modalOpen}
      contentClassName='p-0'
      toggle={togglePopUp}
      modalClassName='modal-sticky'
    >
      <div className='modal-header'>
        <h5 className='modal-title'>Reply a Minute</h5>
        <div className='modal-actions'>
          <a href='/' className='text-body me-75' onClick={togglePopUp}><Minus size={14} /></a>
          <a href='/' className='text-body' onClick={togglePopUp}><X size={14} /></a>
        </div>
      </div>
      <ModalBody className='flex-grow-1 p-0'>
        <Form className='compose-form' onSubmit={e => e.preventDefault()}>
          <div id='message-editor'>
            <CustomTextArea data={formData.action_to_comment} id={'message-editor'} onEdit={(rec) => setFormData({...formData, action_to_comment: rec})} />
          </div>

          {
            selectedAttachment.length > 0 ?
                <div className='mail-attachments m-2'>
                  <div className='d-flex align-items-center mb-1'>
                    <Paperclip size={16}/>
                    <h5 className='fw-bolder text-body mb-0 ms-50'>{selectedAttachment.length} {selectedAttachment.length === 1 ? 'Attachment' : 'Attachments' }</h5>
                  </div>
                  <div className='d-flex flex-column'>

                    {
                      selectedAttachment.map((item, index) => {
                        return (
                            <a
                                key={index}
                                href='/'
                                onClick={e => e.preventDefault()}
                                className={classnames({
                                  'mb-50': index + 1 !== selectedAttachment.length
                                })}
                            >
                              <span className='text-muted fw-bolder align-text-top'>{item.file_name}</span>
                              <span className='text-muted font-small-2 ms-25'>{`(${item.file_size}MB)`}</span>
                              <span className='font-small-2 ms-25'><Trash className='cursor-pointer' size={14} onClick={()=>handleAttachmentDelete(index)}/></span>
                            </a>
                        )
                      })
                    }

                  </div>
                </div> : null
          }


          <div className='compose-footer-wrapper'>
            <div className='btn-wrapper d-flex align-items-center'>
              <UncontrolledButtonDropdown direction='up' className='me-1'>
                <Button color='primary' onClick={handleSend}>
                  Submit
                </Button>
              </UncontrolledButtonDropdown>
              <div className='email-attachement'>
                <Label className='mb-0' for='attach-email-item'>
                  <Paperclip className='cursor-pointer ms-50' size={18}/>
                  <input type='file' accept={'.pdf, .png, .jpg, .jpeg, .doc, .docx, .csv, .ppt, .pptx, .xlsx'} name='attach-email-item' id='attach-email-item' hidden multiple onChange={onAttachment}/>
                </Label>
              </div>
            </div>
            <div className='footer-action d-flex align-items-center'>
              <Trash className='cursor-pointer' size={18} onClick={togglePopUp}/>
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default ActionReplyPopup;
