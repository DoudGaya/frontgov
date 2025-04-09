import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import MiddleModal from "@src/component/common/modal/middle-modal";
import {setGeneralDetails} from '@store/actions';
import {Button, Spinner} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import SpinnerLoader from "@src/component/common/spinner-loader/spinner-loader";

function SalarySettings({loginData}) {
    const token = loginData[0]?.token;
    const user_id = loginData[0]?.user_id;
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true);
    const [IsFormLoading, setIsFormLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal);
    const initialValue = {
        settings_id: "", basic: "", housing: "", transport: "", fringe: "", medical: "", wardrobe: "", created_by: user_id, updated_by: user_id
    }
    const [formData, setFormData] = useState(initialValue);
    const [tableData, setTableData] = useState({
        basic: "", housing: "", transport: "", fringe: "", medical: "", wardrobe: "", updated_by: "", updated_date: ""
    });

    const getData = async () => {
        await axios.get(`${serverLink}hr/salary/settings/list`, token)
            .then((result) => {
                if (result.data.message === 'success') {
                    const data = result.data;
                    const output = data.data;
                    if (output.length > 0) {
                        const d = output[0]
                        setTableData({
                            ...tableData,
                            basic: d.basic,
                            housing: d.housing,
                            transport: d.transport,
                            fringe: d.fringe,
                            medical: d.medical,
                            wardrobe: d.wardrobe,
                            updated_by: d.updated_by_name,
                            updated_date: d.updated_date,
                        })
                        setFormData({
                            ...formData,
                            basic: d.basic,
                            housing: d.housing,
                            transport: d.transport,
                            fringe: d.fringe,
                            medical: d.medical,
                            wardrobe: d.wardrobe,
                            settings_id: d.settings_id
                        })
                    }
                }else {
                    showAlert("ERROR", result.data.message, "error");
                }
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                showAlert("ERROR", "Network Error", "error");
            });
    }

    const onEdit = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const onSubmit = async () => {
        if (formData.basic === "") {
            await showAlert("EMPTY FIELD", "Please enter basic percentage", "error");
            return false;
        }
        if (formData.housing === "") {
            await showAlert("EMPTY FIELD", "Please enter housing percentage", "error");
            return false;
        }
        if (formData.transport === "") { await showAlert("EMPTY FIELD", "Please enter transport percentage", "error"); return false; }
        if (formData.fringe === "") { await showAlert("EMPTY FIELD", "Please enter fringe percentage", "error"); return false; }
        if (formData.medical === "") { await showAlert("EMPTY FIELD", "Please enter medical percentage", "error"); return false; }
        if (formData.wardrobe === "") { await showAlert("EMPTY FIELD", "Please enter wardrobe percentage", "error"); return false; }
        const basic = parseFloat(formData.basic);
        const housing = parseFloat(formData.housing);
        const transport = parseFloat(formData.transport);
        const fringe = parseFloat(formData.fringe);
        const medical = parseFloat(formData.medical);
        const wardrobe = parseFloat(formData.wardrobe);
        const total = basic+housing+transport+fringe+medical+wardrobe;
        if (total !== 100) {
            await showAlert("EMPTY FIELD", "Total settings value must be equal to 100", "error");
            return false;
        }

        setIsFormLoading(true);
        await axios
            .patch(`${serverLink}hr/salary/settings/update`, formData, token)
            .then((result) => {
                if (result.data.message === "success") {
                    toast.success("Settings Updated Successfully");
                    setIsFormLoading(false);
                    getData();
                    toggleModal()
                } else {
                    setIsFormLoading(false);
                    showAlert("ERROR", result.data.message, "error");
                }
            })
            .catch(() => {
                setIsFormLoading(false);
                showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
            });
    }

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_payroll_settings').length < 1) {
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
                                <Breadcrumbs title='Payroll Settings' data={[{title: 'HR Payroll'}, {title: 'Payroll Settings'}]}/>
                            </div>
                        </div>
                        <div className='blog-wrapper'>
                            {
                                tableData.basic !== "" &&
                                <div>
                                    <table className="table table-striped">
                                        <tbody>
                                        <tr>
                                            <th>Basic</th>
                                            <td>{tableData.basic}%</td>
                                        </tr>
                                        <tr>
                                            <th>Housing</th>
                                            <td>{tableData.housing}%</td>
                                        </tr>
                                        <tr>
                                            <th>Transport</th>
                                            <td>{tableData.transport}%</td>
                                        </tr>
                                        <tr>
                                            <th>Fringe</th>
                                            <td>{tableData.fringe}%</td>
                                        </tr>
                                        <tr>
                                            <th>Medical</th>
                                            <td>{tableData.medical}%</td>
                                        </tr>
                                        <tr>
                                            <th>Wardrobe</th>
                                            <td>{tableData.wardrobe}%</td>
                                        </tr>
                                        <tr>
                                            <th>Modified By</th>
                                            <td>{tableData.updated_by}</td>
                                        </tr>
                                        <tr>
                                            <th>Modified Date</th>
                                            <td>{formatDateAndTime(tableData.updated_date, 'date_and_time')}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <Button type="button" className={'m-2'} onClick={toggleModal} size="lg" variant="de-primary">
                                        Update
                                    </Button>
                                </div>
                            }


                            <MiddleModal title={"Payroll Settings Form"} size={'modal-lg'} open={showModal} toggleSidebar={toggleModal}>
                                <div className="row">
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Basic Salary (%)</label>
                                        <input
                                            type={'number'}
                                            step={0.01}
                                            className="form-control"
                                            id="basic"
                                            value={formData.basic}
                                            onChange={onEdit}
                                            placeholder="Basic Salary"
                                        />
                                    </div>
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Housing (%)</label>
                                        <input
                                            type={'number'}
                                            step={0.01}
                                            className="form-control"
                                            id="housing"
                                            value={formData.housing}
                                            onChange={onEdit}
                                            placeholder="Housing"
                                        />
                                    </div>
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Transport (%)</label>
                                        <input
                                            type={'number'}
                                            step={0.01}
                                            className="form-control"
                                            id="transport"
                                            value={formData.transport}
                                            onChange={onEdit}
                                            placeholder="Transport"
                                        />
                                    </div>
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Fringe (%)</label>
                                        <input
                                            type={'number'}
                                            step={0.01}
                                            className="form-control"
                                            id="fringe"
                                            value={formData.fringe}
                                            onChange={onEdit}
                                            placeholder="Fringe"
                                        />
                                    </div>
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Medical (%)</label>
                                        <input
                                            type={'number'}
                                            step={0.01}
                                            className="form-control"
                                            id="medical"
                                            value={formData.medical}
                                            onChange={onEdit}
                                            placeholder="Medical"
                                        />
                                    </div>
                                    <div className="mb-1 form-group col-md-12">
                                        <label className="form-label">Wardrobe (%)</label>
                                        <input
                                            type={'number'}
                                            step={0.01}
                                            className="form-control"
                                            id="wardrobe"
                                            value={formData.wardrobe}
                                            onChange={onEdit}
                                            placeholder="Wardrobe"
                                        />
                                    </div>

                                </div>
                                <div className="form-group col-md-12">
                                    {
                                        IsFormLoading ?
                                            <Button variant="de-primary" disabled>
                                                <Spinner className="spinner-grow-sm me-1" tag="span" color="white" type="grow" />
                                                Submitting...
                                            </Button>
                                            :
                                            <Button type="button" onClick={onSubmit} size="lg" variant="de-primary">
                                                Submit
                                            </Button>
                                    }
                                </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(SalarySettings)