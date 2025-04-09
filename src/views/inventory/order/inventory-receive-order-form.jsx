import {Button} from "reactstrap";
import {toast} from "react-toastify";
import {formatDateAndTime, moneyFormat, numberFormat} from "@src/resources/constants";

const InventoryReceiveOrderForm = ({onSubmit, order, toggleModal, orderItem, setOrderItem, isFormLoading}) => {
    const status = order.order_status;

    const handleQtyChange = (e) => {
        const order_item_id = parseInt(e.target.id);
        const value = e.target.value;
        let qty = 0;

        if (value !== "") {
            qty = parseInt(value);
        }

        if (qty < 0) {
            toast.error("Quantity can't be less than 0");
            return false;
        }

        const itemList = orderItem.map(item => {
            if (item.order_item_id === order_item_id) {
                return {
                    ...item,
                    quantity_received: qty
                }
            }
            return item;
        })
        setOrderItem([
            ...itemList
        ])
    }

    return(
        <>
            <div className="row">
                <div className="mb-3 form-group col-md-12">
                    <h3>Order ID: #{order.ref_code}</h3>
                    <h4>Total: #{numberFormat(order.total)}</h4>
                    <h4>Order Status:
                        <span className={`badge ${
                            status === 'pending' ? 'bg-warning' :
                                status === 'completed' ? 'bg-success' : 'bg-danger'
                        }`}>{status}</span></h4>
                    <h4>Order Date: {formatDateAndTime(order.order_date, 'date')}</h4>
                </div>

                <div className="mb-3 form-group col-md-12">
                    <h4>Selected Item</h4>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Item</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Quantity Ordered</th>
                            <th>Quantity Received</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            orderItem.length > 0 && orderItem.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.item_name}</td>
                                        <td>{moneyFormat(item.unit_price)}</td>
                                        <td>{moneyFormat(item.total)}</td>
                                        <td>{item.quantity_ordered}</td>
                                        <td>
                                            <input type="number" min={0} max={item.quantity_ordered} id={item.order_item_id}
                                                   className="form-control"
                                                   onChange={handleQtyChange} placeholder="Enter quantity received"/>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>

                </div>

                <div className="mb-3 form-group col-md-12">
                    <div className="alert alert-warning" role="alert">
                        Please review your details carefully. Once submitted, modifications will not be possible
                    </div>
                </div>

            </div>

            <div>
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
                <Button type='reset' color='danger' outline onClick={toggleModal}>
                    Cancel
                </Button>
            </div>
        </>
    )
}
export default InventoryReceiveOrderForm;
