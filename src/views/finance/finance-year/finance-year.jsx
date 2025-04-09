import {connect} from "react-redux"
import {Edit, List, Plus, Trash} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {formatDate, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import Table from "../../../component/common/table/table";
import {showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import FinanceYearForm from "@src/views/finance/finance-year/finance-year-form";

function FinanceYear(props) {
    const login = props.loginData[0];
    const token = login.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate();
    const [datatable, setDatatable] = useState({
        columns: [
            {label: "S/N", field: "sn"},
            {label: "Start Date", field: "start_date"},
            {label: "End Date", field: "end_date"},
            {label: "Status", field: "status"},
            {label: "Created By", field: "created_by"},
            {label: "Created Date", field: "created_date"},
            {label: "Modified By", field: "modified_by"},
            {label: "Modified Date", field: "modified_date"},
            {label: "action", field: "action"},
        ],
        rows: [],
    });
    const initialFormValues = {
        year_id: "", start_date: "", end_date: "", created_by: login.user_id,
        updated_by: login.user_id,  is_active: ""
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }

    const getData = async () => {
        await axios.get(`${serverLink}finance/year/list`, token)
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
                start_date: formatDateAndTime(item.start_date, 'date') ?? "N/A",
                end_date: formatDateAndTime(item.end_date, 'date') ?? "N/A",
                status: item.is_active === 0 ? 'Inactive' : 'Active',
                created_by: item.inserted_by_name ?? "N/A",
                created_date: formatDateAndTime(item.created_date, 'date') ?? "N/A",
                modified_by: item.updated_by_name ?? "N/A",
                modified_date: formatDateAndTime(item.updated_date, 'date') ?? "N/A",
                action:  (
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-primary btn-sm"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    year_id: item.year_id,
                                    start_date: formatDate(item.start_date),
                                    end_date: formatDate(item.end_date),
                                    is_active: item.is_active,
                                })
                                setModalOpen(true)
                            }} style={{marginRight: '5px'}}>
                            <Edit size={11}/>
                        </button>

                        <button
                            className="btn btn-sm btn-danger btn-sm"
                            onClick={() => {
                                showConfirm("Warning", `Are you sure you want to delete this year?`, "warning")
                                    .then( async (confirm) => {
                                        if (confirm) {
                                            onDelete(item.year_id)                                        }
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
        if (formData.start_date.toString().trim() === "") {
            toast.error("Please select/enter start date");
            return false;
        }
        if (formData.end_date.toString().trim() === "") {
            toast.error("Please select/enter end date");
            return false;
        }
        if (formData.is_active === "") {
            toast.error("Please select status");
            return false;
        }

        if (formData.year_id === "") {
            setIsFormLoading(true);
            await axios.post(`${serverLink}finance/year/add`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Finance Year Added Successfully");
                    setIsFormLoading(false)
                    toggleSidebar()
                    getData()
                    resetForm()
                } else if (result.data.message === "exist") {
                    toast.error("Finance Year Already Exist");
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
            await axios.patch(`${serverLink}finance/year/update`, formData, token).then((result) => {
                if (result.data.message === "success") {
                    toast.success("Finance Year Updated Successfully");
                    setIsFormLoading(false)
                    toggleSidebar()
                    getData()
                    resetForm()
                } else {
                    toast.error(result.data.message);
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
        await axios.delete(`${serverLink}finance/year/delete/${id}`, token)
            .then(data => {
                const result = data.data;
                if (result.message === "success") {
                    toast.success("Finance Year Deleted Successfully");
                    getData()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                }
            });
    }


    const toggleSidebar = () => setModalOpen(!modalOpen);

    useEffect(() => {
        if (props.loginData[0].permission.filter(e=>e.permission === 'finance_year').length < 1) {
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
                                <Breadcrumbs
                                    title='Finance Year'
                                    data={[{title: 'Finance'}, {title: 'Finance Year'}]}
                                />
                            </div>
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
                        </div>
                        <div className='blog-wrapper'>

                            <Card>
                                <CardHeader>
                                    <div className="card-toolbar col-md-12 col-12 p-0">
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className="col-md-4">
                                                <h4><List/> Finance Year</h4>
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

                            <MiddleModal id="department" title={"Finance Year Form"} size={'modal-lg'} open={modalOpen} toggleSidebar={toggleSidebar}>
                                <FinanceYearForm
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

export default connect(mapStateToProps, null)(FinanceYear)