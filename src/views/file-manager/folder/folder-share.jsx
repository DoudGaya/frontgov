import {Button, Spinner} from "reactstrap";
import {Share2} from "react-feather";
import Select from "react-select";
import axios from "axios";
import {serverLink} from "@src/resources/constants";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";

export default function FolderShare(props) {
    const token = props.loginData?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([])
    const getData = async () => {
        await axios.get(`${serverLink}hr/user/list`, token)
            .then((result) => {
                let user_data = [];
                if (result.data.message === "success") {
                    result.data.data.map((e) => {
                        user_data.push({value: e.user_id, label: e.first_name+" "+e.surname})
                    })
                    setUsers(user_data)
                }
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("NETWORK ERROR");
            });
    };

    const onUserChange = (e) => {
        let data = [];
        e.map((x) => {
            data.push(x.value)
        })
        props.setFormData({
            ...props.formData,
            user_list: data,
            user_data: e
        })
    }

    useEffect(() => {
        getData();
    }, []);
    return (isLoading ? <div className="text-center mt-3 d-flex justify-content-center"><Spinner color='dark' size='sm' style={{marginRight: '8px'}}  /> Generating Share Link...</div>
            :
            <form>
                <div className="row">
                    <div className="form-group mb-1">
                        <label className='form-label'>Folder Link</label>
                        <input type="text" name="link" id="link" className="form-control" readOnly value={props.formData.link}
                               onChange={props.onEdit}/>
                    </div>
                    <div className=" form-group mb-1">
                        <label className="form-label">Select Users</label>
                        <Select
                            isMulti
                            isSearchable
                            options={users}
                            name="user_data"
                            id="user_data"
                            value={props.formData.user_data}
                            onChange={onUserChange}
                        />

                    </div>
                    <div className="form-group mb-1">
                        <label className='form-label'>Expiry Date</label>
                        <input type="date" name="expiry_date" id="expiry_date" className="form-control" value={props.formData.expiry_date}
                               onChange={props.onEdit}/>
                    </div>
                </div>
                <div className="mt-3">
                    {
                        props.isFormLoading ?
                            <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                                <div role="status" className="spinner-border-sm spinner-border"><span
                                    className="visually-hidden">Loading...</span></div>
                                <span className="ms-50">Loading...</span></button>
                            :
                            <Button type='button' className='me-1' color='primary' onClick={props.onSubmit}>
                                <Share2 className='me-50' size={15} />  Share
                            </Button>
                    }
                    <Button type='reset' color='secondary' outline onClick={props.toggleSidebar}>
                        Cancel
                    </Button>
                </div>
            </form>
    )
}