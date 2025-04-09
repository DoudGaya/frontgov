import {connect} from "react-redux"
import {Fragment, useEffect, useState} from "react";
import {serverLink} from "@src/resources/constants";
import axios from "axios";
import Breadcrumbs from "@src/@core/components/breadcrumbs";
import {setGeneralDetails} from '@store/actions';
import {useNavigate} from "react-router-dom";
import {showAlert} from "@src/component/common/sweetalert/sweetalert";
import {toast} from "react-toastify";
import {Button, Card, CardBody, Col, Row, Spinner} from "reactstrap";

function PostSchedule({loginData}) {
    const token = loginData[0]?.token;
    const user_id = loginData[0]?.user_id;
    const navigate = useNavigate()
    const [IsFormLoading, setIsFormLoading] = useState(false)
    const [canSubmit, setCanSubmit] = useState(false);
    const [allowanceList, setAllowanceList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [pensionEnrolment, setPensionEnrolment] = useState([]);
    const [pensionSetting, setPensionSetting] = useState({employee_contribution: 0, employer_contribution: 0});
    const [salarySetting, setSalarySetting] = useState({
        basic: 0, housing: 0, transport: 0, fringe: 0, wardrobe: 0, medical: 0
    });
    const [progress, setProgress] = useState(0)

    const [formData, setFormData] = useState({salary_date: ""});

    const onEdit = (e) => {
        const salary_date = e.target.value;
        setFormData({...formData, salary_date: salary_date});
        if (salary_date !== "") {
            setCanSubmit(false)
            const sendData = {salary_date: salary_date};
            toast.info("please wait...");
            axios.post(`${serverLink}hr/salary/data`, sendData, token)
                .then(result => {
                    if (result.data.message !== "success") {
                        showAlert("ERROR", result.data.message, "error");
                        setCanSubmit(false)
                    } else {
                        const pension_setting = result.data.pension_setting;
                        const salary_setting = result.data.salary_setting;
                        const employee_list = result.data.employee_list;
                        const allowance_list = result.data.allowance_list;
                        const pension_enrolment = result.data.pension_enrolment;
                        const can_run = result.data.can_run;
                        if (can_run > 0) {
                            toast.error(`Salary already ran for ${e.target.value}`)
                        } else {
                            if (pension_setting.length === 0) {
                                toast.error(`No pension setting found. Please add first`)
                            }
                            if (salary_setting.length === 0) {
                                toast.error(`No salary setting found. Please add first`)
                            }
                            if (employee_list.length === 0) {
                                toast.error(`No active staff found. Please add first`)
                            }

                            if (pension_setting.length > 0 && salary_setting.length > 0 && employee_list.length > 0) {
                                setAllowanceList(allowance_list)
                                setEmployeeList(employee_list)
                                setPensionEnrolment(pension_enrolment)
                                setPensionSetting({
                                    ...pension_setting, employee_contribution: pension_setting[0].employee_contribution,
                                    employer_contribution: pension_setting[0].employer_contribution,
                                })
                                setSalarySetting({
                                    ...salary_setting,
                                    basic: salary_setting[0].basic, fringe: salary_setting[0].fringe,
                                    medical: salary_setting[0].medical, transport: salary_setting[0].transport,
                                    housing: salary_setting[0].housing, wardrobe: salary_setting[0].wardrobe
                                })
                                setCanSubmit(true);
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('NETWORK ERROR', err)
                })
        }

    }

    const onSubmit = async () => {
        setIsFormLoading(true);
        for (const employee of employeeList) {
            const index = employeeList.indexOf(employee);
            const gross = employee.gross_pay;
            const employee_id = employee.employee_id;
            const allowance = allowanceList.filter(r=>r.employee_id === employee_id)
            const pension = pensionEnrolment.filter(r=>r.employee_id === employee_id)
            let total_credit = 0;
            let total_debit = 0;
            const basic = parseFloat(((salarySetting.basic / 100 ) * gross).toFixed(2));
            const housing = parseFloat(((salarySetting.housing / 100 ) * gross).toFixed(2));
            const transport = parseFloat(((salarySetting.transport / 100 ) * gross).toFixed(2));
            const wardrobe = parseFloat(((salarySetting.wardrobe / 100 ) * gross).toFixed(2));
            const medical = parseFloat(((salarySetting.medical / 100 ) * gross).toFixed(2));
            const fringe = parseFloat(((salarySetting.fringe / 100 ) * gross).toFixed(2));
            const employee_contribution = parseFloat(((pensionSetting.employee_contribution / 100 ) * gross).toFixed(2));
            const employer_contribution = parseFloat(((pensionSetting.employer_contribution / 100 ) * gross).toFixed(2));

            let items = [
                {item_type: 'credit', item_name: 'Basic', amount: basic},
                {item_type: 'credit', item_name: 'Housing', amount: housing},
                {item_type: 'credit', item_name: 'Transport', amount: transport},
                {item_type: 'credit', item_name: 'Wardrobe', amount: wardrobe},
                {item_type: 'credit', item_name: 'Medical', amount: medical},
                {item_type: 'credit', item_name: 'Fringe', amount: fringe},
                {item_type: 'debit', item_name: 'Payee', amount: employee_contribution},
            ];
            if (allowance.length > 0) {
                allowance.forEach(a => {
                    if (a.post_type === 'Deduction') {
                        total_debit += a.amount;
                        items.push({item_type: 'debit', item_name: a.description, amount: a.amount})
                    }
                    else {
                        total_credit += a.amount;
                        items.push({item_type: 'credit', item_name: a.description, amount: a.amount})
                    }
                })
            }

            total_credit += basic+transport+wardrobe+housing+medical+fringe;
            total_debit += employee_contribution;

            const sendData = {
                employee_id: employee_id, agency_code: employee.agency_code, total_credit: total_credit, total_debit: total_debit,
                total: total_credit-total_debit, salary_date: formData.salary_date, created_by: user_id, items: items, pension:
                    {
                        employee_contribution: employee_contribution,
                        employer_contribution: employer_contribution,
                        total_contribution: employee_contribution + employer_contribution,
                        admin_id: pension.length > 0 ? pension[0].admin_id : 0
                    }
            }
            await axios
                .post(`${serverLink}hr/salary/run`, sendData, token)
                .then((result) => {
                    setProgress(((index+1)/employeeList.length)*100)
                    if (result.data.message === "success") {
                        if (index+1 === employeeList.length) {
                            setIsFormLoading(false);
                            setCanSubmit(false)
                            setFormData({...formData, salary_date: ""})
                            toast.success(`Salary Posted Successfully`);
                        }
                    } else {
                        toast.error(`${employee.employee_name} salary failed: ${result.data.message}`);
                    }
                })
                .catch(() => {
                    setIsFormLoading(false);
                    showAlert("NETWORK ERROR", "Please check your connection and try again!", "error");
                });

        }
    }

    useEffect(() => {
        if (loginData[0].permission.filter(e=>e.permission === 'hr_payroll_post_schedule').length < 1) {
            navigate('/')
        }
    }, []);

    return (
        <Fragment>
            <div className="row">
                <div className="col-md-9 col-8">
                    <Breadcrumbs title='Post Schedule' data={[{title: 'HR Payroll'}, {title: 'Post Schedule'}]}/>
                </div>
            </div>
            <Row>
                <Col xs="12">
                    <Card>
                        <CardBody>
                            <span className={'badge bg-danger'}>You can only run salary once per month</span>
                            <div className="mb-3 form-group col-md-12">
                                <label className="form-label">Select Salary Month & Year</label>
                                <input type={'month'} className="form-control" id="salary_date"
                                       value={formData.salary_date}
                                       max={`${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`}
                                       onChange={onEdit}/>
                            </div>

                            {
                                canSubmit ?
                                    IsFormLoading ?
                                        <div>
                                            <div className="progress mb-3">
                                                <div className="progress-bar progress-bar-striped bg-info"
                                                     role="progressbar"
                                                     style={{width: `${progress}%`}} aria-valuenow={progress}
                                                     aria-valuemin="0"
                                                     aria-valuemax="100">{progress}%
                                                </div>
                                            </div>
                                            <Button className={'btn btn-info w-100'} disabled>
                                                <Spinner className="spinner-grow-sm me-1" tag="span" color="white"
                                                         type="grow"/>
                                                Processing...
                                            </Button>
                                        </div>
                                        :
                                        <Button color={'primary'} type="button" onClick={onSubmit}
                                                className={'btn btn-success w-100'}>
                                            Run Salary Now
                                        </Button> : ''
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(PostSchedule)