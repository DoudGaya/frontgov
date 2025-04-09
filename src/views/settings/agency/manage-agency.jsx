import {connect} from "react-redux"
import {
    Edit,
    List,
    Plus, Trash,
} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import { serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import AgencyForm from "@src/views/settings/agency/manage-agency-form";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import Table from "../../../component/common/table/table";
import {showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";

function ManageAgency(props) {
    const token = props.loginData[0]?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate()
    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "S/N",
                field: "sn",
            },
            {
                label: "Agency Name",
                field: "agency_name",
            },
            {
                label: "Agency Code",
                field: "agency_code",
            },
            {
                label: "Contact Person",
                field: "contact_person",
            },
            {
                label: "Contact Email",
                field: "contact_email",
            },
            {
                label: "action",
                field: "action"
            },
        ],
        rows: [],
    });
    const initialFormValues = {
        agency_id: "",
        agency_code: "",
        agency_name: "",
        contact_person: "",
        contact_email: ""
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }

    const getData = async () => {
        await axios.get(`${serverLink}hr/agency/list`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data)
                }
                setIsLoading(false);
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
                agency_name: item.agency_name ?? "N/A",
                agency_code: item.agency_code ?? "N/A",
                contact_person: item.contact_person ?? "N/A",
                contact_email: item.contact_email ?? "N/A",
                action:  (
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-primary btn-sm"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    agency_id: item.agency_id,
                                    agency_code: item.agency_code,
                                    agency_name: item.agency_name,
                                    contact_email: item.contact_email,
                                    contact_person: item.contact_person
                                })
                                setModalOpen(true)
                            }} style={{marginRight: '5px'}}>
                            <Edit size={11}/>
                        </button>

                        <button
                            className="btn btn-sm btn-danger btn-sm"
                            onClick={() => {
                                showConfirm("Warning", `Are you sure you want to delete agency?`, "warning")
                                    .then( async (confirm) => {
                                        if (confirm) {
                                            onDelete(item.agency_id)                                        }
                                    })
                            }}>
                            <Trash size={11}/>
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
        if (formData.agency_name.toString().trim() === "") {
            toast.error("Please enter agency name");
            return false;
        }
        if (formData.agency_code.toString().trim() === "") {
            toast.error("Please enter agency code");
            return false;
        }

        if (formData.agency_id === "") {
            setIsFormLoading(true);
            await axios.post(`${serverLink}hr/agency/add`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Agency Added Successfully");
                    setIsFormLoading(false)
                    toggleSidebar()
                    getData()
                    resetForm()
                } else if (result.data.message === "exist") {
                    toast.error("Agency already exist!");
                    setIsFormLoading(false)
                } else {
                    toast.error("Something went wrong. Please try again!");
                    setIsFormLoading(false)
                }
            }).catch((error) => {
                toast.error("Please check your connection and try again!");
                setIsFormLoading(false)
            });
        } else {
            setIsFormLoading(true);
            await axios.patch(`${serverLink}hr/agency/update`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Agency Updated Successfully");
                    setIsFormLoading(false)
                    toggleSidebar()
                    getData()
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
    const onDelete = async (id) => {
        await axios.delete(`${serverLink}hr/agency/delete/${id}`, token)
            .then(data => {
                const result = data.data;
                if (result.message === "deleted") {
                    toast.success("Agency Deleted Successfully");
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
                                <h4><List/> Agencies List</h4>
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
        if (props.loginData[0].permission.filter(e=>e.permission === 'settings_agency_manager').length < 1) {
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
                            <div className="col-md-9 col-10">
                                <Breadcrumbs title='Agency Manager'
                                             data={[{title: 'Settings'}, {title: 'Agency Manager'}]}/>
                            </div>
                            {

                                <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                    <div className="breadcrumb-right dropdown">
                                        <button className="btn btn-primary btn-sm" onClick={() => {
                                            toggleSidebar();
                                            resetForm();
                                        }}>
                                            <Plus size={14}/>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>
                            <MiddleModal id="department" title={"Agency Form"} size={'modal-lg'} open={modalOpen} toggleSidebar={toggleSidebar}>
                                <AgencyForm
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleSidebar={toggleSidebar}
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

export default connect(mapStateToProps, null)(ManageAgency)