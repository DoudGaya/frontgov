import {connect} from "react-redux"
import {
    Edit,
    List, Plus, Trash,
} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import {Button, Card, CardBody, CardHeader, Row} from "reactstrap";
import Table from "../../../component/common/table/table";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";
// import {useNavigate} from "react-router-dom";
import {showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";

function Position(props) {
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
                label: "Position Name",
                field: "position_name",
            },
            {
                label: "Inserted By",
                field: "inserted_by",
            },
            {
                label: "Inserted Date",
                field: "inserted_date"
            },
            {
                label: "Action",
                field: "action"
            },
        ],
        rows: [],
    });
    const initialFormValues = {
        position_id: "",
        position_name: "",
        inserted_by: props.loginData[0]?.user_id,
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }

    const getData = async () => {
        await axios.get(`${serverLink}hr/position/list`, token)
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
                position_name: item.position_name ?? "N/A",
                inserted_by: item.inserted_by,
                inserted_date: formatDateAndTime(item.inserted_date, 'date'),
                action:  (
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-primary btn-sm"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    position_id: item.position_id,
                                    position_name: item.position_name,
                                    inserted_by: item.inserted_by,
                                })
                                setModalOpen(true);
                            }} style={{marginRight: '5px'}}>
                            <Edit size={11}/>
                        </button>
                        <button
                            className="btn btn-sm btn-danger btn-sm"
                            onClick={() => {
                                showConfirm("Warning", `Are you sure you want to delete position?`, "warning")
                                    .then( async (confirm) => {
                                        if (confirm) {
                                            onDelete(item.position_id)
                                        }
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
        if (formData.position_name.toString().trim() === "") {
            toast.error("Please enter position name");
            return false;
        }


        if (formData.position_id === "") {
            setIsFormLoading(true);
            await axios.post(`${serverLink}hr/position/add`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Position Added Successfully");
                    setIsFormLoading(false)
                    getData()
                    toggleSidebar()
                    resetForm()
                } else if (result.data.message === "exist") {
                    toast.error("Position already exist!");
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
            await axios.patch(`${serverLink}hr/position/update`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Position Updated Successfully");
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

    const onDelete = async (id) => {
        await axios.delete(`${serverLink}hr/position/delete/${id}`, token)
            .then(data => {
                const result = data.data;
                if (result.message === "deleted") {
                    toast.success("Position Deleted Successfully");
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
                                <h4><List/> User Position</h4>
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

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const toggleSidebar = () => setModalOpen(!modalOpen)
    useEffect(() => {
        if (props.loginData[0].permission.filter(e=>e.permission === 'settings_user_position').length < 1) {
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
                                <Breadcrumbs title='Position'
                                             data={[{title: 'Settings'}, {title: 'User Position'}, ]}/>
                            </div>
                            {
                                <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                    <div className="breadcrumb-right dropdown">
                                        <button className="btn btn-primary btn-sm" onClick={() => {
                                            toggleSidebar();
                                            resetForm();
                                        }}>
                                            <Plus size={14}/> Add Position
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>
                            <MiddleModal title={"User Position Form"} size={'modal-lg'} open={modalOpen} toggleSidebar={toggleSidebar}>
                                <form>
                                    <div className="form-group mb-1">
                                        <label className='form-label'>Position Name</label>
                                        <input type="text" name="position_name" id="position_name" className="form-control" value={formData.position_name}
                                               onChange={onEdit}/>
                                    </div>
                                    <div className="mt-3">
                                        {
                                            isFormLoading ?
                                                <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                                                    <div role="status" className="spinner-border-sm spinner-border"><span
                                                        className="visually-hidden">Loading...</span></div>
                                                    <span className="ms-50">Loading...</span></button>
                                                :
                                                <Button type='button' className='me-1' color='primary' onClick={onSubmit}>
                                                    Submit
                                                </Button>
                                        }
                                        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
                                            Cancel
                                        </Button>
                                    </div>



                                </form>
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

export default connect(mapStateToProps, null)(Position)