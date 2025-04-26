import {connect} from "react-redux"
import {
    Edit, Eye, Layers, Link2, MoreVertical, Trash
} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import { formatDateAndTime, encryptData, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import MiddleModal from "../../../component/common/modal/middle-modal";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown
} from "reactstrap";
import FolderForm from "@src/views/file-manager/folder/folder-form";
import {Link} from "react-router-dom";
import FolderTrack from "@src/views/file-manager/folder/folder-track";
import {showConfirm} from "@src/component/common/sweetalert/sweetalert";
import FileShare from "@src/views/file-manager/file/file-share";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";

function FolderGridView(props) {
    const token = props.loginData[0]?.token;
    const user_id = props.loginData[0]?.user_id;
    const data = props.data;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpen2, setModalOpen2] = useState(false)
    const [modalOpen3, setModalOpen3] = useState(false)
    const [datatable2, setDatatable2] = useState({
        columns: [
            {
                label: "S/N",
                field: "sn",
            },
            {
                label: "Name",
                field: "folder_name",
            },
            {
                label: "Size",
                field: "folder_size",
            },
            {
                label: "Last Modified",
                field: "last_modified",
            },
            {
                label: "Action",
                field: "action",
            }
        ],
        rows: [],
    });
    const initialFormValues = {
        user_id: props.loginData[0]?.user_id,
        staff_id:  props.loginData[0]?.staff_id,
        folder_id: data.folder_id,
        folder_name: data.folder_name,
        folder_size: data.folder_size,
        slug: data.slug,
        user_list: [],
        user_data: '',
        link: "",
        file_link: `${serverLink}public/upload/files/`,
        expiry_date: "",
        position: props.loginData[0]?.position_name,
        full_name: props.loginData[0]?.full_name,
        agency_id: props.loginData[0]?.agency_id,
        created_by: props.loginData[0]?.user_id,
        created_date: data.created_date,
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }

    const getData = async () => {
        await axios.get(`${serverLink}file-manager/folder/user/list/${user_id}`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data)
                }
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("NETWORK ERROR");
            });
    };

    const generateTable = (table_data) => {
        let rowData = [];
        table_data.map((item, index)=> {
            rowData.push({
                sn: index + 1,
                folder_name:  <Link to={`/file-manager/${item.slug}/${encryptData(item.folder_id.toString())}`}><div className="d-flex align-items-center"><div className="avatar rounded bg-light-info" style={{marginRight: '15px'}}><span className="avatar-content"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path opacity="0.3" d="M10 4H21C21.6 4 22 4.4 22 5V7H10V4Z" fill="currentColor"></path>
																<path d="M9.2 3H3C2.4 3 2 3.4 2 4V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V7C22 6.4 21.6 6 21 6H12L10.4 3.60001C10.2 3.20001 9.7 3 9.2 3Z" fill="currentColor"></path>
															</svg></span></div> <div>{item.folder_name}</div></div></Link>,
                folder_size: <Link className="text-secondary" to={`/file-manager/${item.slug}/${encryptData(item.folder_id.toString())}`}>{item.folder_size + "MB"}</Link>,
                last_modified: <Link className="text-secondary" to={`/file-manager/${item.slug}/${encryptData(item.folder_id.toString())}`}>{formatDateAndTime(item.last_modified, 'date_and_time')}</Link>,
                action:  (
                    <div className="d-flex">
                        <Link2 style={{marginRight: '8px'}}  onClick={() => {
                            setFormData({
                                ...formData,
                                folder_id: item.folder_id,
                                user_id: item.user_id,
                                folder_name: item.folder_name,
                                is_sec: item.is_sec,
                                agency_id: item.agency_id,
                                folder_size: item.folder_size,
                                last_modified: item.last_modified,
                                link: `${window.location.href}${item.slug}/${encryptData(item.folder_id.toString())}`,
                            })
                            setModalOpen3(true);
                        }}  />
                        <UncontrolledDropdown>
                            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                                <MoreVertical size={15} />
                            </DropdownToggle>
                            <DropdownMenu>
                                <Link to={`/file-manager/${item.slug}/${encryptData(item.folder_id.toString())}`}><DropdownItem className='w-100'><Eye className='me-50' size={15} /> <span className='align-middle'>View</span></DropdownItem></Link>
                                <DropdownItem  className='w-100' onClick={() => {
                                    setFormData({
                                        ...formData,
                                        folder_id: item.folder_id,
                                        user_id: item.user_id,
                                        folder_name: item.folder_name,
                                        is_sec: item.is_sec,
                                        agency_id: item.agency_id,
                                        folder_size: item.folder_size,
                                        last_modified: item.last_modified,
                                    })
                                    setModalOpen(true);
                                }}>
                                    <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
                                </DropdownItem>
                                <DropdownItem className='w-100'  onClick={() => {
                                    setFormData({
                                        ...formData,
                                        folder_id: item.folder_id,
                                        folder_name: item.folder_name,
                                        is_sec: item.is_sec,
                                        agency_id: item.agency_id,
                                        folder_size: item.folder_size,
                                        last_modified: item.last_modified,
                                    })
                                    setModalOpen2(true);
                                }}><Layers className='me-50' size={15} /> <span className='align-middle'>Track</span></DropdownItem>
                                <DropdownItem className='w-100'  onClick={() => {
                                    showConfirm("Warning", `Are you sure you want to delete this folder?`, "warning")
                                        .then( async (confirm) => {
                                            if (confirm) {
                                                onDelete(item)                                        }
                                        })
                                }}>
                                    <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                ),
            });
        })
        setDatatable2({
            ...datatable2,
            columns: datatable2.columns,
            rows: rowData,
        });
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (formData.user_id.toString().trim() === "") {
            toast.error("UserID cannot be empty");
            return false;
        }
        if (formData.folder_name.toString().trim() === "") {
            toast.error("Please enter folder name");
            return false;
        }

        if (formData.folder_id === "") {
            setIsFormLoading(true);
            await axios.post(`${serverLink}file-manager/folder/add`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Folder Added Successfully");
                    setIsFormLoading(false)
                    getData()
                    toggleSidebar()
                    resetForm()
                } else if (result.data.message === "exist") {
                    toast.error("Folder already exist!");
                    setIsFormLoading(false)
                } else {
                    toast.error("Something went wrong. Please try again!");
                    setIsFormLoading(false)
                }
            }).catch(() => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
        } else {
            setIsFormLoading(true);
            await axios.patch(`${serverLink}file-manager/folder/update`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Folder Updated Successfully");
                    setIsFormLoading(false)
                    getData()
                    toggleSidebar()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                    setIsFormLoading(false)
                }
            }).catch(() => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
        }
    }
    const onShare = async (e) => {
        e.preventDefault();
        if (formData.user_id.toString().trim() === "") {
            toast.error("UserID cannot be empty");
            return false;
        }

        if (formData.user_list.length < 1) {
            toast.error("Please select at least 1 user to share");
            return false;
        }

        if (formData.expiry_date.toString().trim() === '') {
            toast.error("Please select shared file expiry date");
            return false;
        }

        setIsFormLoading(true);
        await axios.post(`${serverLink}file-manager/folder/share`, formData, token).then((result) => {
            if (result.data.message === "success") {
                toast.success("Folder Shared Successfully");
                setIsFormLoading(false)
                getData()
                toggleSidebar3()
                resetForm()
            } else {
                toast.error("Something went wrong. Please try again!");
                setIsFormLoading(false)
            }
        }).catch(() => {
            toast.error("Please check your connection and try again!");
            setIsFormLoading(false)
        });
    }
    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const onDelete = async (item) => {
        const sendData = {
            ...formData,
            folder_id: item.folder_id,
            user_id: item.user_id,
            folder_name: item.folder_name,
            is_sec: item.is_sec,
            agency_id: item.agency_id,
            folder_size: item.folder_size,
            is_archived: item.is_archived,
            last_modified: item.last_modified,
        }
        await axios.post(`${serverLink}file-manager/folder/delete`, sendData, token)
            .then(data => {
                const result = data.data;
                if (result.message === "deleted") {
                    toast.success("Folder Deleted Successfully");
                    getData()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                }
            });
    }

    const toggleSidebar = () => setModalOpen(!modalOpen)
    const toggleSidebar2 = () => setModalOpen2(!modalOpen2)
    const toggleSidebar3 = () => setModalOpen3(!modalOpen3)

    useEffect(() => {
        getData();
    }, []);
    return isLoading ? <SpinnerLoader/> : (
        <>
            <tr>
                <td>
                    <Link to={`/file-manager/${formData.slug}/${encryptData(formData.folder_id.toString())}`}>
                    <span className="avatar-content"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path opacity="0.3" d="M10 4H21C21.6 4 22 4.4 22 5V7H10V4Z" fill="currentColor"></path>
																<path d="M9.2 3H3C2.4 3 2 3.4 2 4V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V7C22 6.4 21.6 6 21 6H12L10.4 3.60001C10.2 3.20001 9.7 3 9.2 3Z" fill="currentColor"></path>
															</svg></span>
                    <span className='align-middle fw-bold'> {formData.folder_name}</span>
                    </Link>
                </td>
                <td>Folder</td>
                <td>
                    {formData.folder_size} MB
                </td>
                <td>
                    {formatDateAndTime(formData.created_date, 'date')}
                </td>
                <td>
                    <UncontrolledDropdown>
                        <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                            <MoreVertical size={15} />
                        </DropdownToggle>
                        <DropdownMenu>
                            <Link to={`/file-manager/${formData.slug}/${encryptData(formData.folder_id.toString())}`}><DropdownItem className='w-100'><Eye className='me-50' size={15} /> <span className='align-middle'>View</span></DropdownItem></Link>
                            <DropdownItem  className='w-100' onClick={() => {
                                setFormData({
                                    ...formData,
                                    folder_id: formData.folder_id,
                                    user_id: formData.user_id,
                                    folder_name: formData.folder_name,
                                    is_sec: formData.is_sec,
                                    agency_id: formData.agency_id,
                                    folder_size: formData.folder_size,
                                    last_modified: formData.last_modified,
                                })
                                setModalOpen(true);
                            }}>
                                <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
                            </DropdownItem>
                            <DropdownItem className='w-100'  onClick={() => {
                                setFormData({
                                    ...formData,
                                    folder_id: formData.folder_id,
                                    folder_name: formData.folder_name,
                                    is_sec: formData.is_sec,
                                    agency_id: formData.agency_id,
                                    folder_size: formData.folder_size,
                                    last_modified: formData.last_modified,
                                })
                                setModalOpen2(true);
                            }}><Layers className='me-50' size={15} /> <span className='align-middle'>Track</span></DropdownItem>
                            <DropdownItem className='w-100'  onClick={() => {
                                showConfirm("Warning", `Are you sure you want to delete this folder?`, "warning")
                                    .then( async (confirm) => {
                                        if (confirm) {
                                            onDelete(formData)                                        }
                                    })
                            }}>
                                <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
            </tr>

            <MiddleModal title={"Folder Form"} size={'modal-lg'} open={modalOpen} toggleSidebar={toggleSidebar}>
                <FolderForm
                    onEdit={onEdit}
                    onSubmit={onSubmit}
                    toggleSidebar={toggleSidebar}
                    formData={formData}
                    setFormData={setFormData}
                    isFormLoading={isFormLoading}
                />
            </MiddleModal>
            <MiddleModal title={formData.folder_name} subtitle={'Folder Tracking'} size={'modal-lg'} open={modalOpen2} toggleSidebar={toggleSidebar2}>
                <FolderTrack
                    toggleSidebar={toggleSidebar2}
                    formData={formData}
                    setFormData={setFormData}
                    isFormLoading={isFormLoading}
                />
            </MiddleModal>
            <MiddleModal title={"Share Folder"} size={'modal-lg'} open={modalOpen3} toggleSidebar={toggleSidebar3}>
                <FileShare
                    onSubmit={onShare}
                    toggleSidebar={toggleSidebar3}
                    onEdit={onEdit}
                    formData={formData}
                    loginData={props.loginData[0]}
                    setFormData={setFormData}
                    isFormLoading={isFormLoading}
                />
            </MiddleModal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(FolderGridView)