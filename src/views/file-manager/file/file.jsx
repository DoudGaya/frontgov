import {connect} from "react-redux"
import {
    CheckSquare,
    Edit, Eye, FileText, Layers, Link2, MoreVertical, Trash
} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {
    capitalizeAndRemoveHyphens,
    formatDateAndTime,
    generate_token,
    decryptData,
    serverLink,
    showIcon
} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {setGeneralDetails} from '@store/actions';
import {
    Card,
    CardBody,
    CardHeader,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    UncontrolledDropdown
} from "reactstrap";
import Table from "../../../component/common/table/table";
import {useNavigate, useParams} from "react-router-dom";
import {showConfirm} from "@src/component/common/sweetalert/sweetalert";
import FileForm from "@src/views/file-manager/file/file-form";
import FileTrack from "@src/views/file-manager/file/file-track";
import FileAction from "@src/views/file-manager/file/file-action";
import EditFileName from "@src/views/file-manager/file/edit-file-name";
import FileShare from "@src/views/file-manager/file/file-share";
import FileTrackingDetails from "@src/views/file-manager/file/file-tracking-details";

function File(props) {
    const user_id = props.loginData[0]?.user_id;
    const token = props.loginData[0]?.token;
    const navigate = useNavigate()
    const {slug} = useParams();
    let page_url = window.location.pathname;
    let page_id = page_url.split('/');
    let path = page_id[2];
    let directory_name =  capitalizeAndRemoveHyphens(path);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpen2, setModalOpen2] = useState(false)
    const [modalOpen3, setModalOpen3] = useState(false)
    const [modalOpen4, setModalOpen4] = useState(false)
    const [modalOpen5, setModalOpen5] = useState(false)
    const [modalOpen6, setModalOpen6] = useState(false)
    const [fileList, setFileList] = useState([]);
    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "S/N",
                field: "sn",
            },
            {
                label: "Name",
                field: "file_name",
            },
            {
                label: "Size",
                field: "file_size",
            },
            {
                label: "Type",
                field: "file_type",
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
        file_id: "",
        folder_id: decryptData(slug),
        folder_name: '',
        file_name: "",
        file_size: "",
        file_type: "",
        file_path: "",
        action: "",
        tracking_code: "",
        user_list: [],
        user_data: '',
        link: '',
        expiry_date: '',
        position: props.loginData[0]?.position_name,
        full_name: props.loginData[0]?.full_name,
        agency_id: props.loginData[0]?.agency_id,
        created_by: props.loginData[0]?.user_id,
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }

    const getData = async () => {
        await axios.get(`${serverLink}file-manager/file/list/${decryptData(slug)}/${user_id}`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data)
                }
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("NETWORK ERROR")
            });
    };

    const generateTable = (table_data) => {
        let rowData = [];
        table_data.map((item, index)=> {
            rowData.push({
                sn: index + 1,
                file_name:  <a href={`${serverLink}public/upload/files/${item.file_path}`}  onClick={async ()=>{ trackViewedFile(item.file_id); }}><div className="d-flex align-items-center"><div className="avatar rounded bg-light-info" style={{marginRight: '15px'}}><span className="avatar-content">
                    {showIcon(item.file_type)}
                 </span></div> <div>{item.file_name}</div></div></a>,
                file_size: item.file_size + "MB",
                file_type: item.file_type,
                last_modified: formatDateAndTime(item.created_date, 'date_and_time'),
                action:  (
                    <div className="d-flex">
                        <Link2 style={{marginRight: '8px'}}  onClick={() => {
                            setFormData({
                                ...formData,
                                file_id: item.file_id,
                                folder_id: item.folder_id,
                                folder_name: item.folder_name,
                                user_id: item.user_id,
                                file_name: item.file_name,
                                agency_id: item.agency_id,
                                tracking_code: item.tracking_code,
                                file_size: item.file_size,
                                file_type: item.file_type,
                                file_path: item.file_path,
                                link: `${serverLink}public/upload/files/${item.file_path}`,
                            })
                            setModalOpen5(true);
                        }}  />
                        <UncontrolledDropdown>
                            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                                <MoreVertical size={15}/>
                            </DropdownToggle>
                            <DropdownMenu>
                                <a href={`${serverLink}public/upload/files/${item.file_path}`}  onClick={async ()=>{ trackViewedFile(item); }}><DropdownItem className='w-100'><Eye className='me-50' size={15} /> <span className='align-middle'>View</span></DropdownItem></a>
                                <DropdownItem  className='w-100' onClick={() => {
                                    setFormData({
                                        ...formData,
                                        file_id: item.file_id,
                                        folder_id: item.folder_id,
                                        user_id: item.user_id,
                                        file_name: item.file_name,
                                        agency_id: item.agency_id,
                                        file_size: item.file_size,
                                        file_type: item.file_type,
                                        file_path: item.file_path,
                                        tracking_code: item.tracking_code,
                                        created_date: item.created_date,
                                    })
                                    setModalOpen3(true);
                                }}>
                                    <CheckSquare className='me-50' size={15} /> <span className='align-middle'>Action</span>
                                </DropdownItem>
                                <DropdownItem className='w-100'  onClick={() => {
                                    setFormData({
                                        ...formData,
                                        file_id: item.file_id,
                                        folder_id: item.folder_id,
                                        user_id: item.user_id,
                                        file_name: item.file_name,
                                        agency_id: item.agency_id,
                                        file_size: item.file_size,
                                        file_type: item.file_type,
                                        file_path: item.file_path,
                                        tracking_code: item.tracking_code,
                                        created_date: item.created_date,
                                    })
                                    setModalOpen2(true);
                                }}><Layers className='me-50' size={15} /> <span className='align-middle'>Track</span></DropdownItem>
                                <DropdownItem className='w-100'  onClick={() => {
                                    setFormData({
                                        ...formData,
                                        file_id: item.file_id,
                                        folder_id: item.folder_id,
                                        user_id: item.user_id,
                                        file_name: item.file_name,
                                        agency_id: item.agency_id,
                                        file_size: item.file_size,
                                        file_type: item.file_type,
                                        file_path: item.file_path,
                                        tracking_code: item.tracking_code,
                                        created_date: item.created_date,
                                    })
                                    setModalOpen6(true);
                                }}><Layers className='me-50' size={15} /> <span className='align-middle'>Tracking Details</span></DropdownItem>
                                <DropdownItem  className='w-100' onClick={() => {
                                        setFormData({
                                            ...formData,
                                            file_id: item.file_id,
                                            folder_id: item.folder_id,
                                            user_id: item.user_id,
                                            file_name: item.file_name,
                                            tracking_code: item.tracking_code,
                                        })
                                    setModalOpen4(true);
                                    }}>
                                        <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
                                    </DropdownItem>
                                    <DropdownItem className='w-100'  onClick={() => {
                                    showConfirm("Warning", `Are you sure you want to delete this file?`, "warning")
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
        setDatatable({
            ...datatable,
            columns: datatable.columns,
            rows: rowData,
        });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (formData.user_id.toString().trim() === "") {
            toast.error("UserID cannot be empty");
            return false;
        }

        if (fileList.length < 1) {
            toast.error("Please select at least 1 document to upload");
            return false;
        }

            let sendData = {...formData}
            const formDocument = new FormData();
            fileList.map(item => {
                const size = (parseFloat(item.file_size) / (1024 * 1024)).toFixed(2);
                const tracking_code = generate_token(10);
                formDocument.append('files', item.ImagePath);
                formDocument.append('file_name', item.ImageName);
                formDocument.append('folder_id', sendData.folder_id);
                formDocument.append('file_type', item.file_extension);
                formDocument.append('user_id', sendData.user_id)
                formDocument.append('position', sendData.position_name)
                formDocument.append('full_name', sendData.full_name)
                formDocument.append('file_size', parseFloat(size))
                formDocument.append('agency_id', sendData.agency_id)
                formDocument.append('tracking_code', tracking_code)
            })

            setIsFormLoading(true);
            await axios.post(`${serverLink}file-manager/file/upload`, formDocument).then((result) => {
                if (result.data.message === "success") {
                    toast.success("File Added Successfully");
                    setIsFormLoading(false)
                    getData()
                    toggleSidebar()
                    resetForm()
                    setFileList([])
                } else if (result.data.message === "exist") {
                    toast.error("File already exist!");
                    setIsFormLoading(false)
                } else {
                    toast.error("Something went wrong. Please try again!");
                    setIsFormLoading(false)
                }
            }).catch(() => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
    }

    const onShare = async (e) => {
        e.preventDefault();
        if (formData.user_id === "") {
            toast.error("User ID cannot be empty");
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
        await axios.post(`${serverLink}file-manager/file/share`, formData, token).then((result) => {
            if (result.data.message === "success") {
                toast.success("File Shared Successfully");
                setIsFormLoading(false)
                getData()
                toggleSidebar5()
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

    const onAddAction = async (e) => {
        e.preventDefault();
        if (formData.user_id.toString().trim() === "") {
            toast.error("UserID cannot be empty");
            return false;
        }

        if (formData.action.toString().trim() === "") {
            toast.error("Please enter file action/comment");
            return false;
        }

        let sendData = {...formData}

        setIsFormLoading(true);
        await axios.patch(`${serverLink}file-manager/file/action/add`, sendData, token).then((result) => {
            if (result.data.message === "success") {
                toast.success("Action Added Successfully");
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

    const onEditFileName = async (e) => {
        e.preventDefault();
        if (formData.user_id.toString().trim() === "") {
            toast.error("User ID cannot be empty");
            return false;
        }

        if (formData.file_name.toString().trim() === "") {
            toast.error("Please enter file name");
            return false;
        }

        let sendData = {...formData}

        setIsFormLoading(true);
        await axios.patch(`${serverLink}file-manager/file/update`, sendData, token).then((result) => {
            if (result.data.message === "success") {
                toast.success("File Update Successfully");
                setIsFormLoading(false)
                getData()
                toggleSidebar4()
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

    const onTextAreaEdit = (value, id) => {
        setFormData({
            ...formData,
            [id]: value
        })
    }

    const onDelete = async (item) => {
        const sendData = {
            ...formData,
            file_id: item.file_id,
            folder_id: item.folder_id,
            user_id: item.user_id,
            file_name: item.file_name,
            agency_id: item.agency_id,
            file_size: item.file_size,
            file_type: item.file_type,
            file_path: item.file_path,
            tracking_code: item.tracking_code,
            created_date: item.created_date,
        }
        await axios.post(`${serverLink}file-manager/file/delete`, sendData, token)
            .then(data => {
                const result = data.data;
                if (result.message === "deleted") {
                    toast.success("File Deleted Successfully");
                    getData()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                }
            });
    }
    const DocumentData = () => {
        return (
            <Card>
                <CardHeader>
                    <div className="card-toolbar col-md-12 col-12 p-0">
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className="col-md-4">
                                <h4><FileText/> File Manager - File(s)</h4>
                            </div>

                        </div>
                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                    </div>
                </CardHeader>
                <CardBody>
                    <Row className='gy-2'>
                        <Table data={datatable}/>
                    </Row>
                </CardBody>
            </Card>
        )
    }

    const toggleSidebar = () => setModalOpen(!modalOpen)
    const toggleSidebar2 = () => setModalOpen2(!modalOpen2)
    const toggleSidebar3 = () => setModalOpen3(!modalOpen3)
    const toggleSidebar4 = () => setModalOpen4(!modalOpen4)
    const toggleSidebar5 = () => setModalOpen5(!modalOpen5)
    const toggleSidebar6 = () => setModalOpen6(!modalOpen6)

    const onMultipleUploadChange = e => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach((file) => {
                const fileExtension = file.name.split('.').pop().toLowerCase();
                const reader = new FileReader();
                // if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
                // } else {
                //     toast.error( "Only .png, .jpg and .jpeg format allowed!")
                //     return false;
                // }

                reader.onload = function () {
                    let data = {
                        ImagePath: file,
                        ImageName: file.name,
                        ImageDisplay: reader.result,
                        file_type: file.type,
                        file_size: file.size,
                        file_extension: fileExtension
                    };
                    setFileList(prevState => [...prevState, data])
                }
                reader.readAsDataURL(file)
            })

        }
    }

    const trackViewedFolder = async () => {
        await axios.patch(`${serverLink}file-manager/folder/viewed`, formData, token)
            .then(() => {}).catch(() => {
                toast.error(`NETWORK ERROR`)
            });
    };

    const trackViewedFile = async (item) => {
        let fileID = item.file_id;
        const sendData = {
            ...formData,
            file_id: fileID,
            tracking_code: item.tracking_code,
        };
        await axios.patch(`${serverLink}file-manager/file/viewed`, sendData, token)
            .then(() => {}).catch(() => {
                toast.error(`NETWORK ERROR`)
            });
    };

    useEffect(() => {
        if (props.loginData[0].permission.filter(e=>e.permission === 'file_manager').length < 1) {
            navigate('/')
        }
        trackViewedFolder()
        getData();
    }, []);
    return (
        <Fragment>
            {
                isLoading ? <SpinnerLoader/>
                    :
                    <>
                        <div className="row">
                            <div className="col-md-10 col-8">
                                <Breadcrumbs title='File Manager'
                                             data={[{title: 'File Manager', link: '/file-manager/folder'}, {title: directory_name}]}/>
                            </div>
                            {

                                <div className="content-header-right text-md-end col-md-2 col-4 d-md-block">
                                    <div className="breadcrumb-right dropdown d-flex float-end">
                                        <button className="btn btn-primary btn-sm" onClick={() => {
                                            toggleSidebar();
                                            resetForm();
                                        }} style={{marginRight: '4px'}}>
                                            <FileText size={14}/> File Upload
                                        </button>

                                    </div>
                                </div>
                            }
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>
                            <MiddleModal id={'file-form'} title={"Upload File Form"} size={'modal-lg'} open={modalOpen} toggleSidebar={toggleSidebar}>
                                <FileForm
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleSidebar={toggleSidebar}
                                    onMultipleUploadChange={onMultipleUploadChange}
                                    formData={formData}
                                    setFileList={setFileList}
                                    fileList={fileList}
                                    setFormData={setFormData}
                                    isFormLoading={isFormLoading}
                                />
                            </MiddleModal>
                            <MiddleModal id={'file-action'} title={"Action Form"} size={'modal-lg'} open={modalOpen3} toggleSidebar={toggleSidebar3}>
                                <FileAction
                                    onSubmit={onAddAction}
                                    toggleSidebar={toggleSidebar3}
                                    onTextAreaEdit={onTextAreaEdit}
                                    formData={formData}
                                    setFormData={setFormData}
                                    isFormLoading={isFormLoading}
                                />
                            </MiddleModal>
                            <MiddleModal id={'file-edit'} title={"Edit File Name"} size={'modal-lg'} open={modalOpen4} toggleSidebar={toggleSidebar4}>
                                <EditFileName
                                    onSubmit={onEditFileName}
                                    toggleSidebar={toggleSidebar4}
                                    onEdit={onEdit}
                                    formData={formData}
                                    setFormData={setFormData}
                                    isFormLoading={isFormLoading}
                                />
                            </MiddleModal>
                            <MiddleModal id={'file-share'} title={"Share Link Generated"} size={'modal-lg'} open={modalOpen5} toggleSidebar={toggleSidebar5}>
                                <FileShare
                                    onSubmit={onShare}
                                    toggleSidebar={toggleSidebar5}
                                    onEdit={onEdit}
                                    formData={formData}
                                    loginData={props.loginData[0]}
                                    setFormData={setFormData}
                                    isFormLoading={isFormLoading}
                                />
                            </MiddleModal>
                            <MiddleModal id={'file-track'} title={formData.file_name} size={'modal-lg'} open={modalOpen2} toggleSidebar={toggleSidebar2}>
                                <FileTrack
                                    toggleSidebar={toggleSidebar2}
                                    formData={formData}
                                    setFormData={setFormData}
                                    isFormLoading={isFormLoading}
                                />
                            </MiddleModal>
                            <MiddleModal id={'file-tracking-details'} title={formData.file_name} subtitle={'Tracking Details'} size={'modal-lg'} open={modalOpen6} toggleSidebar={toggleSidebar6}>
                                <FileTrackingDetails
                                    toggleSidebar={toggleSidebar6}
                                    formData={formData}
                                    setFormData={setFormData}
                                    isFormLoading={isFormLoading}
                                />
                            </MiddleModal>
                        </div>
                    </>
            }
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setOnGeneralDetails: (p) => {
            dispatch(setGeneralDetails(p))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(File)