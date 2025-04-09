import logoSm from '@src/assets/images/logo/logo.png'
import {currencyConverter, formatDateAndTime, moneyFormat, projectTitle} from "@src/resources/constants";

const PaySlipForm = ({salary, items}) => {

    const handlePrint = () => {
        window.print();
    }

    return(
        <div>
            <div className="container" id="print-section">
                <div className="row mb-4">
                    <div className="col-6">
                        <img src={logoSm} alt={projectTitle} className="img-fluid"
                             style={{maxWidth: "100px"}}/>
                    </div>
                    <div className="col-6 text-end">
                        <h2 style={{ fontSize: '14px' }}>{projectTitle} Payslip</h2>
                        <p className="text-muted">Date: {formatDateAndTime(salary.full_salary_date, 'full_month_and_year')}</p>
                    </div>
                </div>

                <div className="row my-4">
                    <div className="col-6">
                        <h5 style={{ fontSize: '14px' }}>Employee Information</h5>
                        <p>
                            Employee ID: {salary.staff_id}<br/>
                            Employee Name: {salary.employee_name}<br/>
                            Agency: {salary.agency_name}
                        </p>
                    </div>
                    <div className="col-6 text-end">
                        <h5 style={{ fontSize: '14px' }}>Total</h5>
                        <p>
                            Total Allowance: {currencyConverter(salary.total_credit)}<br/>
                            Total Deduction: {currencyConverter(salary.total_debit)} <br/>
                            Net Pay: {currencyConverter(salary.total)}
                        </p>

                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <table className="table table-bordered">
                            <thead className="table-light" style={{ fontSize: '12px' }}>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Post Type</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                items.length > 0 && items.map((item, index) => {
                                    return (
                                        <tr key={index} style={{ fontSize: '10px' }}>
                                            <td>{index + 1}</td>
                                            <td>{item.item_name}</td>
                                            <td>{item.item_type === 'debit' ? 'Deduction' : 'Allowance'}</td>
                                            <td>{currencyConverter(item.amount)}</td>
                                        </tr>
                                    )
                                })
                            }

                            </tbody>
                            <tfoot style={{ fontSize: '10px' }}>
                            <tr>
                                <th colSpan="3" className="text-end"><b>Net Pay</b></th>
                                <th><b>{moneyFormat(salary.total)}</b></th>
                            </tr>
                            </tfoot>
                        </table>

                    </div>
                </div>
            </div>

            <style>
                {`
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact !important; /* For Chrome */
                            color-adjust: exact !important; /* For Firefox */
                            visibility: hidden;
                        }
                        #print-section, #print-section * {
                            visibility: visible;
                        }

                        /* Ensure that the print section takes up the full page */
                        #print-section {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                        }
                       
                    }
                `}
            </style>
            <button className={'btn btn-success'} onClick={handlePrint}>Print</button>
        </div>
    )
}
export default PaySlipForm;