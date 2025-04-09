// ** React Imports
import { useState } from 'react';

// ** Custom Components
import Avatar from '@components/avatar';

import Select, { components } from 'react-select';
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
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/editor/editor.scss';
import '@styles/react/libs/react-select/_react-select.scss'
import {toast} from "react-toastify";
import axios from "axios";
import {currencyConverter, serverLink, sumObjectArray} from "@src/resources/constants";
import {CustomTextArea} from "@src/component/common/CustomTextArea/custom-text-area";
import {showConfirm} from "@src/component/common/sweetalert/sweetalert";

const ActionPopup = props => {
  // ** Props & Custom Hooks
  const { modalOpen, toggleModal, employeeList, loginData, reloadData, requestData, actionType, requestItems } = props
  const [approvedItem, setApprovedItem] = useState([])
  // ** States
  const [selectedAttachment, setSelectedAttachment] = useState([]);
  const initial_form = {
    request_id: requestData.length > 0 ? requestData[0].request_id : '', subject: requestData.length > 0 ? requestData[0].subject : '', action_by: loginData.user_id,
    action_by_name: loginData.full_name, action_by_position: loginData.position_name, action_by_agency_id: loginData.agency_id, action_by_agency_name: loginData.agency_name, action: '',
    action_to: '', action_to_name: '', action_to_position: '', action_to_agency_id: '', action_to_email: '', action_type: actionType
  }
  const [formData, setFormData] = useState(initial_form)

  let selectOptions = [];
  if (employeeList.length > 0) {
    employeeList.map(r => {
      if (r.user_id !== loginData.user_id)
        selectOptions.push({value: r.user_id, label: `${r.full_name} (${r.position}, ${r.agency_name})`, full_name: r.full_name, email: r.email_address, position: r.position, agency_id: r.agency_id, agency_name: r.agency_name});
    })
  }

  const SelectComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          {data.label}
        </div>
      </components.Option>
    )
  };

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

  const handleSelectTo = (item) => {
    setFormData({...formData,
      action_to: item.value, action_to_name: item.full_name, action_to_position: item.position,
      action_to_email: item.email, action_to_agency_id: item.agency_id, action_to_agency_name: item.agency_name,
    });
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
    if (actionType === 'minute') {
      if (formData.action_to === '') { toast.error("Please select the recipient"); return false }
    }

    const strip_body = formData.action.toString().replace(/<[^>]*>?/gm, '');
    if (strip_body === '') { toast.error("Please write your message/comment"); return false }
    if (strip_body.length < 5) { toast.error("Message must be at least 5 characters long"); return false }

    toast.info('Sending... Please wait')
    const request = requestData[0];
    let sendData = {
      ...formData,
      request_id: request.request_id,
      subject: request.subject,
      action_type: actionType
    }

    if (actionType === 'action') {
      const rejected_items = requestItems.filter(item1 =>
          !approvedItem.some(item2 => item2.item_id === item1.item_id)
      );
      const employee = employeeList.filter(e=>e.user_id === request.request_from_id);
      sendData = {
        ...sendData,
        action_to_email: employee.length > 0 ? employee[0].email_address : '',
        status: approvedItem.length > 0 ? 'completed' : 'processing',
        items: approvedItem,
        total: approvedItem.length > 0 ? sumObjectArray(approvedItem, 'total') : 0,
        action_to: 0,
        action_to_agency_id: 0,
        rejected_items: rejected_items
      }


    }

    await axios.post(`${serverLink}request/action/${actionType === 'minute' ? 'add' : 'main'}`, sendData, loginData.token)
        .then(async res => {
          if (res.data.message === 'success') {
            if (selectedAttachment.length > 0) {
              const fd = new FormData();
              selectedAttachment.map((item) => {
                fd.append('action_id', res.data.action_id)
                fd.append('request_id', sendData.request_id)
                fd.append('created_by', formData.action_by)
                fd.append('file_type', item.file_type)
                fd.append('file_size', item.file_size)
                fd.append('file_name', item.file_name)
                fd.append('files', item.files)
              })
              await axios.patch(`${serverLink}request/action/upload`, fd, loginData.token)
                  .then(() => {
                    toast.success("Submitted successfully")
                    togglePopUp2()
                    reloadData()
                  })
                  .catch(() => {
                    toast.error("Something went wrong uploading files. Please try again!");
                  });
            } else {
              toast.success("Submitted successfully")
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

  const handleItemSelect = (event, item) => {
    if (event.target.checked) {
      setApprovedItem([...approvedItem, item]);
    } else {
      setApprovedItem(approvedItem.filter(e => e.item_id !== item.item_id));
    }
  }

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
        <h5 className='modal-title'>{actionType === 'minute' ? 'Compose Minute' : 'Compose Action'}</h5>
        <div className='modal-actions'>
          <a href='/' className='text-body me-75' onClick={togglePopUp}><Minus size={14} /></a>
          <a href='/' className='text-body' onClick={togglePopUp}><X size={14} /></a>
        </div>
      </div>
      <ModalBody className='flex-grow-1 p-0'>
        <Form className='compose-form' onSubmit={e => e.preventDefault()}>
          {
              actionType === 'minute' &&
              <div className='compose-mail-form-field'>
                <Label for='email-to' className='form-label'>
                  To:
                </Label>
                <div className='flex-grow-1'>
                  <Select
                      id='email-to'
                      onChange={handleSelectTo}
                      isClearable={false}
                      theme={selectThemeColors}
                      options={selectOptions}
                      className='react-select select-borderless'
                      classNamePrefix='select'
                      components={{Option: SelectComponent}}
                  />
                </div>
              </div>
          }

          <div id='message-editor'>
            <CustomTextArea data={formData.action} id={'message-editor'} onEdit={(rec) => setFormData({...formData, action: rec})} />
          </div>

          {
              actionType === 'action' &&
              <div className={'mt-2 mb-2'}>
                <table className='table table-striped'>
                  <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Item Name</th>
                    <th>Total</th>
                    <th>--</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    requestItems.length > 0 && requestItems.map((item, index) => {
                      return (
                          <tr key={index}>
                            <td>{(index+1)}</td>
                            <td>{item.item_name}</td>
                            <td>{currencyConverter(item.total)}</td>
                            <td>
                              {
                                item.status === 'pending' ?
                                    <input type="checkbox" onChange={(e) => {
                                      handleItemSelect(e, item)
                                    }}/> : '--'
                              }

                            </td>
                          </tr>
                      )
                      })
                  }
                  </tbody>
                </table>
                <h4 className={'m-2'}>TOTAL APPROVING: { currencyConverter(approvedItem.length > 0 ? sumObjectArray(approvedItem, 'total') : 0 )  }</h4>
              </div>
          }

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
                {
                    requestData.length > 0 && requestData[0].status !== 'completed' &&
                    <>
                    {
                      actionType === 'action' ?
                        <Button
                            color='primary'
                            onClick={() => showConfirm("Warning", `All unchecked request items will be rejected automatically! Are you sure you want to proceed?`, "warning")
                                .then(async (confirm) => {
                                  if (confirm) {
                                    await handleSend()
                                  }
                                })}
                        >
                          Submit
                        </Button> :
                          <Button
                              color='primary'
                              onClick={handleSend}
                          >
                            Submit
                          </Button>
                    }
                    </>

                }

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

export default ActionPopup;
