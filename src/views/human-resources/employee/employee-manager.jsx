import {connect} from "react-redux"
import {
    Edit,
    List,
    Plus,
} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {setGeneralDetails} from '@store/actions';
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import Table from "../../../component/common/table/table";
import {useNavigate} from "react-router-dom";
import EmployeeManagementForm from "@src/views/human-resources/employee/employee-manager-form";

function EmployeeManagement(props) {
    const token = props.loginData[0]?.token;
    const user_id = props.loginData[0]?.user_id;
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [employeeModalOpen, setEmployeeModalOpen] = useState(false)
    const [agencyList, setAgencyList] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [datatable, setDatatable] = useState({
        columns: [
            { label: "S/N", field: "sn"},
            { label: "Employee ID", field: "staff_id" },
            { label: "Jigawa ID", field: "jigawa_id" },
            { label: "Full Name", field: "full_name" },
            { label: "Phone No", field: "phone_number" },
            { label: "Agency/Ministry", field: "agency_name" },
            { label: "Type", field: "employment_type" },
            { label: "Status", field: "employment_status" },
            { label: "Action", field: "action" },
        ],
        rows: [],
    });

    const getData = async () => {
        await axios.get(`${serverLink}hr/employee/list`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data)
                    setAgencyList(result.data.agencies)
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
                jigawa_id: item.jigawa_id,
                full_name: item.full_name,
                phone_number: item.phone_number ?? "N/A",
                agency_name: item.agency_name ?? "N/A",
                employment_type: item.employment_type ?? "N/A",
                employment_status: item.employment_status ?? "N/A",
                action:  (
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-primary btn-sm"
                            onClick={() => {
                                setSelectedEmployee(item)
                                setEmployeeModalOpen(true);
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

    const DocumentData = () => {
        return (
            <Card>
                <CardHeader>
                    <div className="card-toolbar col-md-12 col-12 p-0">
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className="col-md-4">
                                <h4><List/> Employee List</h4>
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

    const toggleEmployeeModal = () => {
        setSelectedEmployee(null);
        setEmployeeModalOpen(!employeeModalOpen)
    }

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
                                <Breadcrumbs title='Employee Manager'
                                             data={[{title: 'HR Manager'}, {title: 'Employee Manager'}]}/>
                            </div>
                            {

                                <div className="content-header-right text-md-end col-md-3 col-4 d-md-block">
                                    <div className="breadcrumb-right dropdown d-flex float-end">

                                        <button className="btn btn-primary btn-sm" onClick={() => {
                                            toggleEmployeeModal();
                                            setSelectedEmployee(null)
                                        }}>
                                            <Plus size={14}/> Add Employee
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>
                            <MiddleModal title={"Employee Management Form"} size={'modal-xl'} open={employeeModalOpen} toggleSidebar={toggleEmployeeModal}>
                                <EmployeeManagementForm
                                    toggleSidebar={toggleEmployeeModal}
                                    agencyList={agencyList}
                                    reload={getData}
                                    selectedEmployee={selectedEmployee}
                                    user_id={user_id}
                                    token={token}
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeManagement)