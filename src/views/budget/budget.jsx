import { connect } from "react-redux";
import { List, Plus } from "react-feather";
import { Fragment, useEffect, useState } from "react";
import {
    currencyConverter,
    formatDateAndTime,
    generate_token,
    serverLink
} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../@core/components/breadcrumbs";
import MiddleModal from "../../component/common/modal/middle-modal";
import SpinnerLoader from "../../component/common/spinner-loader/spinner-loader";
import {Card, CardBody, CardHeader, Row} from "reactstrap";
import {showAlert, showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {useNavigate} from "react-router-dom";
import DataTable from "@src/component/common/Datatable/datatable";
import BudgetForm from "@src/views/budget/budget-form";
import BudgetViewForm from "@src/views/budget/budget-view-form";

function Budget({loginData}) {
    const navigate =  useNavigate();
    const login = loginData[0];
    const token = login?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [budgetList, setBudgetList] = useState([]);
    const [budgetItemList, setBudgetItemList] = useState([]);
    const [agencyList, setAgencyList] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)
    const [selectedBudget, setSelectedBudget] = useState({});
    const [selectedBudgetItem, setSelectedBudgetItem] = useState([]);
    const [showViewBudgetModal, setShowViewBudgetModal] = useState(false)
    const toggleViewBudgetModal = () => setShowViewBudgetModal(!showViewBudgetModal)

    const header = ["S/N", "Agency", "Budget Year", "Amount", "Collected", "Balance", "Status", "Modified By", "Modified Date", "Action"];
    const initialValue = {
        budget_id: "", order_date: "", budget_code: generate_token(10), approved_amount: 0, created_by: loginData[0]?.user_id, agency_id: "",
        budget_year: "", budget_description: "", collected_amount: 0, remaining_amount: 0, status: "Active", mode: "Manual", modified_by: loginData[0]?.user_id
    }
    const [formData, setFormData] = useState(initialValue);
    const [budgetItem, setBudgetItem] = useState([]);

    const resetForm = () => {
        setFormData(initialValue)
        setBudgetItem([]);
    }

    const getData = async () => {
        await axios.get(`${serverLink}budget/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    setBudgetList(data.budgets)
                    setBudgetItemList(data.budget_items)
                    setAgencyList(data.agencies)
                    showTable(data.budgets, data.budget_items)
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch(() => {
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const  showTable = (budgets, budget_items ) => {
        try {
            return budgets.length > 0 && budgets.map((budget, index) => {
                const items = budget_items.filter(r=>r.budget_id === budget.budget_id)
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{budget.agency_name}</td>
                        <td>{budget.budget_year}</td>
                        <td>{currencyConverter(budget.approved_amount)}</td>
                        <td>{currencyConverter(budget.collected_amount)}</td>
                        <td>{currencyConverter(budget.remaining_amount)}</td>
                        <td>{budget.status}</td>
                        <td>{budget.modified_by_name}</td>
                        <td>{formatDateAndTime(budget.modified_date, 'short_date')}</td>
                        <td>
                            <div>
                                {
                                    budget.status === "Active" && budget.mode === "Manual" &&
                                    <a href="#" title={'Close Budget'} className={"btn btn-danger btn-sm  mb-1"}
                                       style={{marginRight: 3}}
                                       onClick={() => showConfirm("Warning", `Are you sure you want to close this budget?`, "warning")
                                           .then(async (confirm) => {
                                               if (confirm) {
                                                   await handleCancellation(budget.budget_id)
                                               }
                                           })}>
                                        <i className='fa fa-x'/>
                                    </a>
                                }
                                <a href="#" title={'View Budget'} className={"btn btn-info btn-sm  mb-1"}
                                   onClick={() => {
                                       setSelectedBudget({
                                           ...budget
                                       })
                                       setSelectedBudgetItem(items)
                                       toggleViewBudgetModal()
                                   }}>
                                    <i className='fa fa-eye'/>
                                </a>
                            </div>
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
        if (formData.budget_year === "") {
            await showAlert("EMPTY FIELD", "Please select the budget year", "error");
            return false;
        }
        if (formData.status === "") {
            await showAlert("EMPTY FIELD", "Please select the budget status", "error");
            return false;
        }
        if (budgetItem.length === 0) {
            await showAlert("EMPTY FIELD", "Please enter at least one budget item", "error");
            return false;
        }

        const sendData = {
            ...formData,
            items: budgetItem
        }

        setIsFormLoading(true);
        toast.info("Please wait...");
        await axios
            .post(`${serverLink}budget/add`, sendData, token)
            .then((res) => {
                if (res.data.message === "success") {
                    toast.success("Budget Added Successfully");
                    setIsFormLoading(false);
                    getData();
                    resetForm();
                    toggleModal();
                } else if (res.data.message === 'exist') {
                    setIsFormLoading(false);
                    showAlert("ERROR", "Budget Already Exist", "error");
                } else {
                    setIsFormLoading(false);
                    showAlert("ERROR", "Something went wrong. Please try again!", "error");
                }
            })
            .catch(() => {
                setIsFormLoading(false);
                showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
            });
    }

    const handleCancellation = async (id) => {
        toast.info("Please wait...");
        const sendData = {
            budget_id: id,
            modified_by: initialValue.modified_by
        }
        await axios.patch(`${serverLink}budget/close`, sendData, token).then((res) => {
            if (res.data.message === "success") {
                toast.success("Cancelled Successfully");
                getData();
            } else {
                toast.error("NETWORK ERROR. Please try again!");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("NETWORK ERROR. Please try again!");
        });
    }

    const handleBudgetUpdate = async (item) => {
        toast.info("Please wait...");
        const sendData = {
            budget_item_id: item.budget_item_id,
            budget_id: item.budget_id,
            total: item.unit_price*item.quantity,
            modified_by: initialValue.modified_by
        }

        if (sendData.total >= selectedBudget.approved_amount) {
            toast.error("You can remove all the budget items");
            return false;
        }

        await axios.patch(`${serverLink}budget/delete_item`, sendData, token).then((res) => {
            if (res.data.message === "success") {
                toast.success("Item Deleted Successfully");
                toggleViewBudgetModal();
                getData();
            } else {
                toast.error("NETWORK ERROR. Please try again!");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("NETWORK ERROR. Please try again!");
        });
    }

    const handleAddNewBudgetItem = async (sendData) => {
        const formData = {
            ...sendData, modified_by: initialValue.modified_by, budget_year: selectedBudget.budget_year
        }
        await axios.patch(`${serverLink}budget/add_item`, formData, token).then((res) => {
            if (res.data.message === "success") {
                const budget_list = res.data.budgets;
                const budget_item_list = res.data.budget_items;
                setBudgetList(budget_list);
                setBudgetItemList(budget_item_list);

                const selected_budget = budget_list.filter(item => item.budget_id === formData.budget_id)[0];
                setSelectedBudget(selected_budget);
                console.log(selected_budget)

                const selected_budget_item = budget_item_list.filter(item => item.budget_id === formData.budget_id);
                setSelectedBudgetItem(selected_budget_item)
                console.log(selected_budget_item)
                toast.success("Item Added Successfully");

            } else {
                console.log(res.data.message);
                toast.error("NETWORK ERROR. Please try again!");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("NETWORK ERROR. Please try again!");
        });
    }

    useEffect(() => {
        if (login.permission.filter(e=>e.permission === 'budget_manager').length < 1) {
            navigate('/')
        }
        getData()
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
                                    title='Budget Manager' data={[{title: 'Budget'}, {title: 'Budget Manager'}]}
                                />
                            </div>
                            <div className="content-header-right text-md-end col-md-3 col-2 d-md-block">
                                <div className="breadcrumb-right dropdown">
                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                        resetForm();
                                        setShowModal(true)
                                    }}>
                                        <Plus size={14}/> Add Budget
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
                                                <h4><List/> Budgets List</h4>
                                            </div>

                                        </div>
                                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className='gy-2'>
                                        <DataTable
                                            tableID="Budgets"
                                            header={header}
                                            body={showTable(budgetList, budgetItemList)}
                                            title="Budgets"
                                        />
                                    </Row>
                                </CardBody>
                            </Card>

                            <MiddleModal id="modal" title={"Budget Manager"} size={'modal-xl'} open={showModal} toggleSidebar={toggleModal}>
                                <BudgetForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    budgetItem={budgetItem}
                                    setBudgetItem={setBudgetItem}
                                    isFormLoading={isFormLoading}
                                    agencyList={agencyList}
                                    onEdit={onEdit}
                                    onSubmit={onSubmit}
                                    toggleModal={toggleModal}
                                />
                            </MiddleModal>

                            <MiddleModal id="modal" title={"View Budget"} size={'modal-xl'} open={showViewBudgetModal} toggleSidebar={toggleViewBudgetModal}>
                                <BudgetViewForm
                                    handleBudgetUpdate={handleBudgetUpdate}
                                    selectedBudget={selectedBudget}
                                    selectedBudgetItem={selectedBudgetItem}
                                    handleAddNewBudgetItem={handleAddNewBudgetItem}
                                    can_modify={true}
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

export default connect(mapStateToProps, null)(Budget)