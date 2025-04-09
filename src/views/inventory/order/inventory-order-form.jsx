import {Button} from "reactstrap";
import {useState} from "react";
import Select, {components} from "react-select";
import {toast} from "react-toastify";
import {showConfirm} from "@src/component/common/sweetalert/sweetalert";
import {moneyFormat, numberFormat} from "@src/resources/constants";

const InventoryCategoryForm = ({onEdit, onSubmit, toggleModal, formData, setFormData, orderItem, setOrderItem, isFormLoading, itemList}) => {
    let [itemOptions, setItemOptions] = useState([]);

    const vendor_list = itemList.length > 0 ? itemList.reduce((acc, current) => {
        if (!acc.find(item => item.vendor_id === current.vendor_id)) {
            acc.push({ value: current.vendor_id, label: current.vendor_name, vendor_id: current.vendor_id });
        }
        return acc;
    }, []) : [];

    const handleVendorUpdate = (item) => {
        setOrderItem([])
        const vendor_id = item.vendor_id;
        const items = itemList.filter(item => item.vendor_id === vendor_id);
        const options = []
        items.length > 0 && items.forEach(item => {
            options.push({value: item.item_id, label: item.item_name, data: item});
        })
        setItemOptions(options);
    }

    const SelectComponent = ({ data, ...props }) => {
        return (
            <components.Option {...props}>
                <div className='d-flex flex-wrap align-items-center'>
                    {data.label}
                </div>
            </components.Option>
        )
    };

    const handleSelect = (result) => {
        const item = result.data;
        const check_if_exist = orderItem.filter(e=>e.item_id === item.item_id).length;
        if (check_if_exist > 0) {
            toast.error(`${item.item_name} already exist`)
            return false;
        } else {
            let current_item = orderItem;
            current_item.push({
                item_id: item.item_id, item_name: item.item_name, category_name: item.category_name,
                vendor_name: item.vendor_name, manufacturer_name: item.manufacturer_name, qty_in_stock: item.quantity,
                price: item.price, total: item.price, qty_ordered: 1
            });
            setOrderItem([
                ...current_item,
            ]);
            setFormData({
                ...formData,
                total: formData.total + item.price
            });
        }
    }

    const handleItemRemoval = (item_id, total) => {
        setOrderItem([
            ...orderItem.filter(e=>e.item_id !== item_id)
        ])
        setFormData({
            ...formData,
            total: formData.total - total
        })
    }

    const handleQtyChange = (e) => {
        const item_id = parseInt(e.target.id);
        const value = e.target.value;
        const price = parseFloat(e.target.name);
        let qty = 1;
        if (value !== "") {
            qty = parseInt(value);
        }

        if (qty < 1) {
            toast.error("Quantity can't be less than 1");
            return false;
        }

        const itemList = orderItem.map(item => {
            if (item.item_id === item_id) {
                return {
                    ...item,
                    qty_ordered: qty,
                    total: price * qty
                }
            }
            return item;
        })
        setOrderItem([
            ...itemList
        ])
        const sumTotal = itemList.reduce((accumulator, item) => accumulator + item.total, 0);
        setFormData({
            ...formData,
            total: sumTotal
        })
    }
    return(
        <>
            <div className="row">

                <div className="mb-2 form-group col-md-4">
                    <label className="form-label">Order Date</label>
                    <input type="date" id={'order_date'} onChange={onEdit} value={formData.order_date}
                           placeholder={'Order Date'} className={'form-control'}/>
                </div>

                <div className="mb-2 form-group col-md-4">
                    <label className="form-label">Select Vendor</label>
                    <Select
                        id='select-item'
                        onChange={handleVendorUpdate}
                        isClearable={false}
                        options={vendor_list}
                        className='react-select select-borderless'
                        classNamePrefix='select'
                        components={{Option: SelectComponent}}
                    />
                </div>

                <div className="mb-2 form-group col-md-4">
                    <label className="form-label">Select Item</label>
                    <Select
                        id='select-item'
                        onChange={handleSelect}
                        isClearable={false}
                        options={itemOptions}
                        className='react-select select-borderless'
                        classNamePrefix='select'
                        components={{Option: SelectComponent}}
                    />
                </div>

                <div className="mb-2 form-group col-md-12 table-responsive">
                    <h4>Selected Item</h4>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Item</th>
                            <th>Vendor</th>
                            <th>Manufacturer</th>
                            <th>Qty in Stock</th>
                            <th>Qty Ordering</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            orderItem.length > 0 && orderItem.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.item_name}</td>
                                        <td>{item.vendor_name}</td>
                                        <td>{item.manufacturer_name}</td>
                                        <td>{item.qty_in_stock}</td>
                                        <td>
                                            <input type="number" min={1} id={item.item_id} name={item.price}
                                                   className="form-control"
                                                   onChange={handleQtyChange} placeholder="Enter quantity"/>
                                        </td>
                                        <td>{moneyFormat(item.price)}</td>
                                        <td>{item.qty_ordered}</td>
                                        <td>{moneyFormat(item.total)}</td>
                                        <td>
                                            <a href="#" className={"btn btn-danger btn-sm  mb-1"}
                                               onClick={() => showConfirm("Warning", `Are you sure you want to remove this item?`, "warning")
                                                   .then(async (confirm) => {
                                                       if (confirm) {
                                                           handleItemRemoval(item.item_id, item.total);
                                                       }
                                                   })}>
                                                <i className='fa fa-trash'/>
                                            </a>
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

                <div className="mb-3 form-group col-md-12">
                    <label className="form-label">Order Total</label>
                    <h4>{numberFormat(formData.total)}</h4>
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
export default InventoryCategoryForm;
