// ** React Imports
import {useEffect, useState} from 'react';

// ** Custom Components
import Avatar from '@components/avatar';

import Select, { components } from 'react-select';
import {Minus, X, Trash, Paperclip} from 'react-feather';
import classnames from 'classnames'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Modal,
  Button,
  ModalBody, UncontrolledButtonDropdown
} from 'reactstrap'
// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/editor/editor.scss';
import '@styles/react/libs/react-select/_react-select.scss';
import {toast} from "react-toastify";
import axios from "axios";
import {currencyConverter, serverLink, sumObjectArray} from "@src/resources/constants";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {CustomTextArea} from "@src/component/common/CustomTextArea/custom-text-area";

const ComposePopup = props => {
  // ** Props & Custom Hooks
  const { composeOpen, toggleCompose, employeeList, loginData, reloadData, budgetList, budgetItemList } = props

  // ** States
  const [selectedAttachment, setSelectedAttachment] = useState([]);
  const initial_form = {
    subject: `Request for Fund Allocation - ${loginData.agency_name}`,
    body: `<p>The above subject matter refers.</p> <p>I am writing to formally request the allocation of funds for the below selected budget. The requested funds are necessary to ensure the continued efficiency and effectiveness of our operations.</p> <p>Kindly find the details of the items attached for your review. We would appreciate your prompt attention to this request to facilitate the timely execution of our projects and initiatives.</p> <p>Thank you for your consideration.</p>`,
    request_from_id: loginData.user_id, request_from_name: loginData.full_name, request_from_position: loginData.position_name, status: 'created',
    agency_id_from: loginData.agency_id, request_to_id: '', request_to_name: '', request_to_position: '', agency_id_to: '', request_to_email: '',
    budget_id: '', total: 0, agency_name_from: loginData.agency_name, agency_name_to: ''
  }
  const [selectedBudgetItem, setSelectedBudgetItem] = useState([]);
  const [formData, setFormData] = useState(initial_form)
  const [budgetItemOptions, setBudgetItemOptions] = useState([]);

  const SubmissionWarningSwal = withReactContent(Swal)
  let selectOptions = [];
  if (employeeList.length > 0) {
    employeeList.map(r => {
      if (r.user_id !== loginData.user_id && r.status === 'active' && r.agency_id === loginData.agency_id)
        selectOptions.push({value: r.user_id, label: `${r.full_name} (${r.position})`, full_name: r.full_name, email: r.email_address, position: r.position, agency_id: r.agency_id, agency_name: r.agency_name});
    })
  }

  let budgetOptions = [];
  if (budgetList.length > 0) {
    budgetList.map(r => {
        budgetOptions.push({value: r.budget_id, label: `${r.budget_year} Budget`});
    })
  }

  useEffect(() => {
    if (formData.budget_id !== '') {
      let itemsOptions = [];
      if (budgetItemList.length > 0) {
        budgetItemList.map(r => {
          itemsOptions.push({
            value: r.budget_item_id, label: `${r.item_name}: ${r.item_description}`, quantity: r.quantity, total: r.quantity*r.unit_price,
            unit_price: r.unit_price, budget_item_id: r.budget_item_id, item_name: r.item_name, item_description: r.item_description,
          });
        })
      }
      setBudgetItemOptions(itemsOptions);
    }
  }, [formData.budget_id])

  const SelectComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          <Avatar initials className='my-0 me-50' size='sm' content={data.full_name} />
          {data.label}
        </div>
      </components.Option>
    )
  };

  const SelectGeneralComponent = ({ data, ...props }) => {
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
    e.preventDefault()
    setFormData(initial_form)
    setSelectedAttachment([])
    toggleCompose();
  }

  const togglePopUp2 = () => {
    setFormData(initial_form)
    setSelectedAttachment([])
    toggleCompose();
  }

  const handleSelectTo = (item) => {
    setFormData({...formData,
      request_to_id: item.value, request_to_name: item.full_name, request_to_position: item.position,
      request_to_email: item.email, agency_id_to: item.agency_id, agency_name_to: item.agency_name,
    });
  }

  const handleBudgetSelect = (item) => {
    setFormData({...formData, budget_id: item.value});
  }

  const handleBudgetItemSelect = (item) => {
    if (item.length === 0) {
      setSelectedBudgetItem([])
    } else {
      setSelectedBudgetItem(item)
      setFormData({...formData, total: sumObjectArray(item, 'total')});
    }
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

  const handleSendChecker = () => {
    if (formData.request_to_id === '') { toast.error("Please select the recipient"); return false }
    if (formData.subject.toString().trim() === '') { toast.error("Please enter a subject"); return false }

    const strip_body = formData.body.toString().replace(/<[^>]*>?/gm, '');
    if (strip_body === '') { toast.error("Please write your request"); return false }
    if (strip_body.length < 40) { toast.error("request must be at least 40 characters long"); return false }

    if (formData.budget_id === '') { toast.error("Please select the budget"); return false }
    if (selectedBudgetItem.length === 0) { toast.error("Please select at least one budget item"); return false }

    return SubmissionWarningSwal.fire({
      title: 'Are you sure you want to submit this request?',
      text: "Once submitted, you will not be able to alter its contents. However, you will have the option to cancel the request if necessary.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, send!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        handleSend();
      }
    })

  }

  const handleSend = async () => {

    let sendData = formData;
    let budget_items = [];

    if (selectedBudgetItem.length > 0) {
      selectedBudgetItem.map(r => {
        budget_items.push({
          budget_item_id: r.budget_item_id, item_name: r.item_name, item_description: r.item_description,
          quantity: r.quantity, unit_price: r.unit_price, total: r.unit_price*r.quantity
        });
      })
    }
    sendData = {...sendData, budget_items: budget_items};
    toast.info('Sending... Please wait');

    await axios.post(`${serverLink}request/add`, sendData, loginData.token)
        .then(async res => {
          if (res.data.message === 'success') {
            if (selectedAttachment.length > 0) {
              const fd = new FormData();
              selectedAttachment.map((item) => {
                fd.append('request_id', res.data.request_id)
                fd.append('created_by', formData.request_from_id)
                fd.append('file_type', item.file_type)
                fd.append('file_size', item.file_size)
                fd.append('file_name', item.file_name)
                fd.append('files', item.files)
              })
              await axios.patch(`${serverLink}request/upload`, fd, loginData.token)
                  .then(() => {
                    toast.success("Request created successfully")
                    togglePopUp2()
                    reloadData()
                  })
                  .catch(() => {
                    toast.error("Something went wrong uploading files. Please try again!");
                  });
            } else {
              toast.success("Request created successfully")
              togglePopUp2()
              reloadData()
            }

          } else {
            toast.error(res.data.message)
          }
        })
        .catch(() => {
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
      isOpen={composeOpen}
      contentClassName='p-0'
      toggle={togglePopUp}
      modalClassName='modal-sticky'
    >
      <div className='modal-header'>
        <h5 className='modal-title'>Compose Fund Request</h5>
        <div className='modal-actions'>
          <a href='/' className='text-body me-75' onClick={togglePopUp}><Minus size={14} /></a>
          <a href='/' className='text-body' onClick={togglePopUp}><X size={14} /></a>
        </div>
      </div>
      <ModalBody className='flex-grow-1 p-0'>
        <Form className='compose-form' onSubmit={e => e.preventDefault()}>
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

          <div className='compose-mail-form-field'>
            <Label for='email-subject' className='form-label'> Subject: </Label>
            <Input id='email-subject' placeholder='Subject' value={formData.subject}
                   onChange={(e) => setFormData({...formData, subject: e.target.value})}/>
          </div>
          <div id='message-editor'>
            <CustomTextArea data={formData.body} id={'message-editor'}
                            onEdit={(rec) => setFormData({...formData, body: rec})}/>
          </div>

          {
            selectedAttachment.length > 0 ?
                <div className='mail-attachments m-2'>
                  <div className='d-flex align-items-center mb-1'>
                    <Paperclip size={16}/>
                    <h5 className='fw-bolder text-body mb-0 ms-50'>{selectedAttachment.length} {selectedAttachment.length === 1 ? 'Attachment' : 'Attachments'}</h5>
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
                              <span className='font-small-2 ms-25'><Trash className='cursor-pointer' size={14}
                                                                          onClick={() => handleAttachmentDelete(index)}/></span>
                            </a>
                        )
                      })
                    }

                  </div>
                </div> : null
          }

          <div className='compose-mail-form-field'>
            <Label for='budgets' className='form-label'>
              Select Budget:
            </Label>
            <div className='flex-grow-1'>
              <Select
                  id='budgets'
                  onChange={handleBudgetSelect}
                  isClearable={false}
                  theme={selectThemeColors}
                  options={budgetOptions}
                  className='react-select select-borderless'
                  classNamePrefix='select'
                  components={{Option: SelectGeneralComponent}}
              />
            </div>
          </div>

          {
              formData.budget_id !== '' &&
              <div>
                <div className='compose-mail-form-field'>
                  <Label for='budgets' className='form-label'>
                    Select Budget Items:
                  </Label>
                  <div className='flex-grow-1'>
                    <Select
                        id='budgets'
                        isMulti
                        onChange={handleBudgetItemSelect}
                        isClearable={false}
                        theme={selectThemeColors}
                        options={budgetItemOptions}
                        className='react-select select-borderless'
                        classNamePrefix='select'
                        components={{Option: SelectGeneralComponent}}
                    />
                  </div>
                </div>
                <div className="compose-mail-form-field
                mt-2">
                  <p>Total Amount: {currencyConverter(formData.total)}</p>
                </div>
              </div>
          }

          <div className='compose-footer-wrapper'>
            <div className='btn-wrapper d-flex align-items-center'>
              <UncontrolledButtonDropdown direction='up' className='me-1'>
                <Button color='primary' onClick={handleSendChecker}>
                  Send
                </Button>
              </UncontrolledButtonDropdown>
              <div className='email-attachement'>
                <Label className='mb-0' for='attach-email-item'>
                  <Paperclip className='cursor-pointer ms-50' size={18}/>
                  <input type='file' accept={'.pdf, .png, .jpg, .jpeg, .doc, .docx, .csv, .ppt, .pptx, .xlsx'}
                         name='attach-email-item' id='attach-email-item' hidden multiple onChange={onAttachment}/>
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

export default ComposePopup;
