import {connect} from "react-redux"
import {List, Plus} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";
import ManufacturerForm from "@src/views/inventory/manufacturer/manufacturer-form";

function InventoryManufacturer({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [manufacturerList, setManufacturerList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const header = ["S/N", "Manufacturer", "Created By", "Created Date", "Modified By", "Modified Date", "Action"];

    const initialValue = {
        manufacturer_id: "", manufacturer_name: "", created_by: loginData[0]?.user_id,
        updated_by: loginData[0]?.user_id
    }
    const [formData, setFormData] = useState(initialValue);

    const resetForm = () => {
        setFormData(initialValue)
    }

    const getData = async () => {
        await axios.get(`${serverLink}inventory/manufacturer/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setManufacturerList(data.data)
                    showTable(data.data)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (dataset) => {
        try {
            return dataset.length > 0 && dataset.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{index +1}</td>
                        <td>{item.manufacturer_name}</td>
                        <td>{item.created_by_name}</td>
                        <td>{formatDateAndTime(item.created_date, 'date')}</td>
                        <td>{item.updated_by_name}</td>
                        <td>{formatDateAndTime(item.updated_date, 'date')}</td>
                        <td>
                            <a href="#" className={"btn btn-primary btn-sm mb-1"} style={{ marginRight: 2 }}
                               onClick={() => {
                                   setFormData({
                                       ...formData,
                                       manufacturer_id: item.manufacturer_id,
                                       manufacturer_name: item.manufacturer_name,
                                   });
                                   toggleModal();
                               }}>
                                <i className='fa fa-pencil' />
                            </a>
                            <a href="#" className={"btn btn-danger btn-sm  mb-1"}
                               onClick={()=>showConfirm("Warning", `Are you sure you want to delete this manufacturer?`, "warning")
                                   .then( async (confirm) => {
                                       if (confirm) {
                                           await delete_manufacturer(item.manufacturer_id)
                                       }
                                   })}>
                                <i className='fa fa-trash' />
                            </a>
                        </td>
                    </tr>
                );
            });
        } catch (e) {
            alert(e.message);
        }
    };

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const onSubmit = async () => {
        if (formData.manufacturer_name.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please enter manufacturer name", "error");
            return false;
        }

        if (formData.manufacturer_id === "") {
            setIsFormLoading(true);
            toast.info("please wait...");
            await axios
                .post(`${serverLink}inventory/manufacturer/add`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Manufacturer Added Successfully");
                        setIsFormLoading(false);
                        getData();
                        resetForm();
                        toggleModal();
                    } else if (result.data.message === 'exist') {
                        setIsFormLoading(false);
                        showAlert("ERROR", "Manufacturer Already Exist", "error");
                    } else {
                        setIsFormLoading(false);
                        showAlert("ERROR", "Something went wrong. Please try again!", "error");
                    }
                })
                .catch((error) => {
                    setIsFormLoading(false);
                    showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
                });
        }
        else{
            setIsFormLoading(true);
            await axios
                .patch(`${serverLink}inventory/manufacturer/update`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Manufacturer Updated Successfully");
                        setIsFormLoading(false);
                        getData();
                        resetForm()
                        toggleModal()
                    } else {
                        setIsFormLoading(false);
                        showAlert("ERROR", "Something went wrong. Please try again!", "error");
                    }
                })
                .catch((error) => {
                    setIsFormLoading(false);
                    showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
                });
        }
    }

    const delete_manufacturer = async (id) => {
        toast.info("please wait...");
        await axios.delete(`${serverLink}inventory/manufacturer/delete/${id}`, token).then((res) => {
            if (res.data.message === "success") {
                toast.success("Deleted Successfully");
                getData();
            } else {
                toast.error("NETWORK ERROR. Please try again!");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("NETWORK ERROR. Please try again!");
        });
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'inventory_manufacturer').length < 1) {
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
                                    title='Inventory Manufacturer' data={[{title: 'Inventory'}, {title: 'Inventory Manufacturer'}]}
                                />
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                <div className="breadcrumb-right dropdown">
                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        toggleModal();
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
                                                <h4><List/> Manufacturer List</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2'>
                                        <DataTable
                                            tableID="InventoryManufacturers"
                                            header={header}
                                            body={showTable(manufacturerList)}
                                            title="Inventory Manufacturers"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Manufacturer Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <ManufacturerForm
                                    formData={formData}
                                    isFormLoading={isFormLoading}
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleModal={toggleModal}
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

export default connect(mapStateToProps, null)(InventoryManufacturer)