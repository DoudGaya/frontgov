import {connect} from "react-redux"
import {
    Edit, FileText,
    List,
    Plus,
} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {encryptData, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {setGeneralDetails} from '@store/actions';
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import Table from "../../../component/common/table/table";
import UserManagementForm from "@src/views/settings/user-manager/user-manager-form";
import {useNavigate} from "react-router-dom";

function UserManagement(props) {
    const token = props.loginData[0]?.token;
    const user_id = props.loginData[0]?.user_id;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [agencyList, setAgencyList] = useState([])
    const [positionList, setPositionList] = useState([])
    const [roleList, setRoleList] = useState([])
    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "S/N",
                field: "sn",
            },
            {
                label: "Staff ID",
                field: "staff_id",
            },
            {
                label: "Staff Name",
                field: "staff_name",
            },
            {
                label: "Phone No",
                field: "phone_number",
            },
            {
                label: "Email Address",
                field: "email_address",
            },
            {
                label: "Position",
                field: "position",
            },
            {
                label: "Agency",
                field: "agency",
            },
            {
                label: "Role",
                field: "role",
            },
            {
                label: "Status",
                field: "status",
            },
            {
                label: "Action",
                field: "action",
            },
        ],
        rows: [],
    });
    const initialFormValues = {
        user_id: "",
        staff_id: "",
        first_name: "",
        surname: "",
        phone_number: "",
        position_id: "",
        role_id: "",
        email_address: "",
        status: "",
        signature: "",
        password: "",
        old_password: "",
        isEdit: 0,
        agency_id: "",
        uploadFile: "",
        created_by: user_id,
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }

    const getData = async () => {
        await axios.get(`${serverLink}hr/user/list`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data)
                    setAgencyList(result.data.agencies)
                    setPositionList(result.data.positions)
                    setRoleList(result.data.roles)
                    setIsLoading(false);
                } else {
                    toast.error(result.data.message);
                }

            })
            .catch((err) => {
                console.log("NETWORK ERROR");
            });

    };

    const generateTable = (table_data) => {
        let rowData = [];
        table_data.map((item, index)=> {
            rowData.push({
                sn: index + 1,
                staff_id: item.staff_id ?? "N/A",
                staff_name: item.first_name+" "+item.surname,
                phone_number: item.phone_number ?? "N/A",
                email_address: item.email_address ?? "N/A",
                position: item.position_name ?? "N/A",
                role: item.role_name ?? "N/A",
                agency: item.agency_name ?? "N/A",
                status: item.status ?? "N/A",
                action:  (
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-primary btn-sm"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    user_id: item.user_id,
                                    staff_id: item.staff_id,
                                    first_name: item.first_name,
                                    surname: item.surname,
                                    phone_number: item.phone_number,
                                    position_id: item.position_id,
                                    email_address: item.email_address,
                                    agency_id: item.agency_id,
                                    role_id: item.role_id,
                                    status: item.status,
                                    signature: item.signature,
                                    isEdit: 1,
                                    old_password: item.password,
                                    password: "",
                                    created_by: item.created_by,
                                })
                                setModalOpen(true);
                            }} style={{marginRight: '5px'}}>
                            <Edit size={11}/>
                        </button>

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
        if (formData.staff_id.toString().trim() === "") {
            toast.error("Please enter staff id");
            return false;
        }
        if (formData.first_name.toString().trim() === "") {
            toast.error("Please enter first name");
            return false;
        }
        if (formData.surname.toString().trim() === "") {
            toast.error("Please enter surname");
            return false;
        }
        if (formData.phone_number.toString().trim() === "") {
            toast.error("Please enter phone number");
            return false;
        }
        if (formData.email_address.toString().trim() === "") {
            toast.error("Please enter email address");
            return false;
        }
        if (formData.agency_id === "") {
            toast.error("Please select agency");
            return false;
        }
        if (formData.position_id === "") {
            toast.error("Please select position");
            return false;
        }
        if (formData.isEdit === 0 && formData.password.toString().trim() === "") {
            toast.error("Please enter password");
            return false;
        }
        if (formData.status.toString().trim() === "") {
            toast.error("Please select status");
            return false;
        }

        if (formData.user_id === "") {
            setIsFormLoading(true);
            await axios.post(`${serverLink}hr/user/add`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("User Added Successfully");
                    setIsFormLoading(false)
                    getData()
                    toggleSidebar()
                    resetForm()
                } else if (result.data.message === "exist") {
                    toast.error("User already exist!");
                    setIsFormLoading(false)
                } else {
                    toast.error(result.data.message);
                    setIsFormLoading(false)
                }
            }).catch((error) => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
        } else {
            setIsFormLoading(true);
            const sendData = {
                ...formData,
                password: formData.password === '' ? formData.old_password : encryptData(formData.password),
            }
            await axios.patch(`${serverLink}hr/user/update`, sendData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("User Updated Successfully");
                    setIsFormLoading(false)
                    getData()
                    toggleSidebar()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                    setIsFormLoading(false)
                }
            }).catch((error) => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
        }
    }
    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const DocumentData = () => {
        return (
            <Card>
                <CardHeader>
                    <div className="card-toolbar col-md-12 col-12 p-0">
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className="col-md-4">
                                <h4><List/> User List</h4>
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
    useEffect(() => {
        if (props.loginData[0].permission.filter(e=>e.permission === 'settings_user_manager').length < 1) {
            navigate('/')
        }
        getData();
    }, []);
    return (
        <Fragment>
            {
                isLoading ? <SpinnerLoader/>
                    :
                    <>
                        <div className="row">
                            <div className="col-md-9 col-8">
                                <Breadcrumbs title='User Manager'
                                             data={[{title: 'Settings'}, {title: 'User Manager'}]}/>
                            </div>
                            {

                                <div className="content-header-right text-md-end col-md-3 col-4 d-md-block">
                                    <div className="breadcrumb-right dropdown d-flex float-end">

                                        <button className="btn btn-primary btn-sm" onClick={() => {
                                            toggleSidebar();
                                            resetForm();
                                        }}>
                                            <Plus size={14}/> Add New
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>
                            <MiddleModal title={"User Management Form"} size={'modal-lg'} open={modalOpen} toggleSidebar={toggleSidebar}>
                                <UserManagementForm
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleSidebar={toggleSidebar}
                                    formData={formData}
                                    agencyList={agencyList}
                                    positionList={positionList}
                                    roleList={roleList}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement)