import logoSm from '@src/assets/images/logo/logo.png'
import {currencyConverter, formatDateAndTime} from "@src/resources/constants";

const InventoryOrderPrintForm = ({orderItem, order}) => {

    return(
        <div>
            <div className="container my-5" id="print-section"  style={{ fontSize: '12px' }}>
                <div className="row">
                    <div className="col-6">
                        <img src={logoSm} alt="Company Logo" className="img-fluid"
                             style={{maxWidth: "100px"}}/>
                    </div>
                    <div className="col-6 text-end">
                        <h2>Inventory Order Receipt</h2>
                        <p className="text-muted">Order No: #{order.ref_code}</p>
                    </div>
                </div>

                <div className="row my-1">
                    <div className="col-6">
                        <h5>Vendor Information</h5>
                        <p>
                            Vendor Name: {orderItem.length > 0 ? orderItem[0].vendor_name : '--'}<br/>
                            Contact: {orderItem.length > 0 ? orderItem[0].contact_phone : '--'}<br/>
                        </p>
                    </div>
                    <div className="col-6 text-end">
                        <h5>Order Date</h5>
                        <p>{formatDateAndTime(order.order_date, 'date')}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                {/*<th>Category</th>*/}
                                {/*<th>Manufacturer</th>*/}
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                orderItem.length > 0 && orderItem.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.item_name} ({item.manufacturer_name})</td>
                                            {/*<td>{item.category_name}</td>*/}
                                            {/*<td>{item.manufacturer_name}</td>*/}
                                            <td>{item.quantity_ordered}</td>
                                            <td>{currencyConverter(item.unit_price)}</td>
                                            <td>{currencyConverter(item.total)}</td>
                                        </tr>
                                    )
                                })
                            }

                            </tbody>
                            <tfoot>
                            <tr>
                                <th colSpan="4" className="text-end">Total</th>
                                <th>{currencyConverter(order.total)}</th>
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
                            top: -250px !important;
                            left: 0;
                        }
                       
                    }
                `}
            </style>
            <button className={'btn btn-success'} onClick={window.print}>Print</button>
        </div>
    )
}
export default InventoryOrderPrintForm;