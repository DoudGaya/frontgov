import {connect} from "react-redux"
import {List, Plus} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {currencyConverter, formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import MiddleModal from "../../../component/common/modal/middle-modal";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";
import InventoryItemForm from "@src/views/inventory/item/item-form";

function InventoryItem({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [manufacturerList, setManufacturerList] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const header = ["S/N", "Item Name", "Category", "Manufacturer", "Vendor", "Qty In Stock", "Price", "Modified By", "Modified Date", "Action"];

    const initialValue = {
        item_id: "", item_name: "", manufacturer_id: "", category_id: "", vendor_id: "", created_by: loginData[0]?.user_id,
        quantity: 0, price: "", updated_by: loginData[0]?.user_id,
    }
    const [formData, setFormData] = useState(initialValue);

    const resetForm = () => {
        setFormData(initialValue)
    }

    const getData = async () => {
        await axios.get(`${serverLink}inventory/item/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setItemList(data.items)
                    setCategoryList(data.categories)
                    setVendorList(data.vendors)
                    setManufacturerList(data.manufacturers)
                    showTable(data.items, data.categories, data.vendors, data.manufacturers)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (items, categories, vendors, manufacturers) => {
        try {
            return items.length > 0 && items.map((item, index) => {
                const vendor_name = vendors.filter(e=>e.vendor_id === item.vendor_id)[0].vendor_name;
                const manufacturer_name = manufacturers.filter(e=>e.manufacturer_id === item.manufacturer_id)[0].manufacturer_name;
                const category_name = categories.filter(e=>e.category_id === item.category_id)[0].category_name;
                return (
                    <tr key={index}>
                        <td>{index +1}</td>
                        <td>{item.item_name}</td>
                        <td>{category_name}</td>
                        <td>{manufacturer_name}</td>
                        <td>{vendor_name}</td>
                        <td>{item.quantity}</td>
                        <td>{currencyConverter(item.price)}</td>
                        <td>{item.updated_by_name}</td>
                        <td>{formatDateAndTime(item.updated_date, 'date')}</td>
                        <td>
                            <a href="#" className={"btn btn-primary btn-sm mb-1"} style={{ marginRight: 2 }}
                               onClick={() => {
                                   setFormData({
                                       ...formData,
                                       item_id: item.item_id,
                                       item_name: item.item_name,
                                       category_id: item.category_id,
                                       manufacturer_id: item.manufacturer_id,
                                       vendor_id: item.vendor_id,
                                       quantity: item.quantity,
                                       price: item.price,
                                   });
                                   toggleModal();
                               }}>
                                <i className='fa fa-pencil' />
                            </a>
                            <a href="#" className={"btn btn-danger btn-sm  mb-1"}
                               onClick={()=>showConfirm("Warning", `Are you sure you want to delete this item?`, "warning")
                                   .then( async (confirm) => {
                                       if (confirm) {
                                           await handleDelete(item.item_id)
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
        if (formData.item_name.toString().trim() === "") {
            showAlert("EMPTY FIELD", "Please enter item name", "error");
            return false;
        }
        if (formData.category_id === "") {
            showAlert("EMPTY FIELD", "Please select category", "error");
            return false;
        }
        if (formData.vendor_id === "") {
            showAlert("EMPTY FIELD", "Please select vendor", "error");
            return false;
        }
        if (formData.manufacturer_id === "") {
            showAlert("EMPTY FIELD", "Please select manufacturer", "error");
            return false;
        }
        if (formData.price === "") {
            showAlert("EMPTY FIELD", "Please enter the price", "error");
            return false;
        }

        if (formData.item_id === "") {
            setIsFormLoading(true);
            toast.info("please wait...");
            await axios
                .post(`${serverLink}inventory/item/add`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Item Added Successfully");
                        setIsFormLoading(false);
                        getData();
                        resetForm();
                        toggleModal();
                    } else if (result.data.message === 'exist') {
                        setIsFormLoading(false);
                        showAlert("ERROR", "Item Already Exist", "error");
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
                .patch(`${serverLink}inventory/item/update`, formData, token)
                .then((result) => {
                    if (result.data.message === "success") {
                        toast.success("Item Updated Successfully");
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

    const handleDelete = async (id) => {
        toast.info("please wait...");
        await axios.delete(`${serverLink}inventory/item/delete/${id}`, token).then((res) => {
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
        if (login.permission.filter(e=>e.permission === 'inventory_item').length < 1) {
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
                                    title='Item List' data={[{title: 'Inventory'}, {title: 'Item List'}]}
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
                                                <h4><List/> Item List</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2'>
                                        <DataTable
                                            tableID="InventoryItems"
                                            header={header}
                                            body={showTable(itemList, categoryList, vendorList, manufacturerList)}
                                            title="Inventory Items"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Inventory Item Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <InventoryItemForm
                                    formData={formData}
                                    vendorList={vendorList}
                                    manufacturerList={manufacturerList}
                                    categoryList={categoryList}
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

export default connect(mapStateToProps, null)(InventoryItem)