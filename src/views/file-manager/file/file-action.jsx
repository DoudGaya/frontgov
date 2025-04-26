import {Button, Card, CardBody, CardHeader, Row, Spinner} from "reactstrap";
import {CustomTextArea} from "@src/component/common/CustomTextArea/custom-text-area";
import {useEffect, useState} from "react";
import {FileText} from "react-feather";
import Table from "@src/component/common/table/table";
import axios from "axios";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import {connect} from "react-redux";
import {toast} from "react-toastify";
function FileAction(props) {
    const token = props.loginData[0]?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [datatable2, setDatatable2] = useState({
        columns: [
            {
                label: "S/N",
                field: "sn",
            },
            {
                label: "Action",
                field: "action",
            },
            {
                label: "Action By",
                field: "full_name",
            },
            {
                label: "Action Date",
                field: "created_date",
            }
        ],
        rows: [],
    });

    const DocumentData = () => {
        return (
            <Card>
                <CardHeader>
                    <div className="card-toolbar col-md-12 col-12 p-0">
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className="col-md-12">
                                <h4><FileText/>  File Actions</h4>
                            </div>

                        </div>
                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                    </div>
                </CardHeader>
                <CardBody>
                    <Row className='gy-2'>
                        <Table data={datatable2}/>
                    </Row>
                </CardBody>
            </Card>
        )
    }

    const getData = async () => {
        await axios.get(`${serverLink}file-manager/file/action/${props.formData.file_id}`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data)
                }
                setIsLoading(false);
            })
            .catch(() => {
                toast.error(`NETWORK ERROR`)
            });
    };

    const generateTable = (table_data) => {
        let rowData = [];
        table_data.map((item, index)=> {
            rowData.push({
                sn: index + 1,
                action: <span className="text-capitalize" dangerouslySetInnerHTML={{__html: item.action}}/>,
                full_name: item.full_name,
                created_date: formatDateAndTime(item.created_date, 'date_and_time'),
            });
        })
        setDatatable2({
            ...datatable2,
            columns: datatable2.columns,
            rows: rowData,
        });
    }

    useEffect(() => {
        getData();
    }, []);


    return (
        <form id={'action-form'}>
            <div className="row">
                <div className="form-group ">
                    <label className='form-label' htmlFor={"action"}>Action/Comment</label>
                    <CustomTextArea data={props.formData.action} onEdit={props.onTextAreaEdit} id="action" name="action"/>
                </div>
                <div className="mt-0 d-flex justify-content-end mb-2">
                    {
                        props.isFormLoading ?
                            <button className="btn btn-outline-primary disabled" style={{marginRight: '10px'}}>
                                <div role="status" className="spinner-border-sm spinner-border"><span
                                    className="visually-hidden">Loading...</span></div>
                                <span className="ms-50">Loading...</span></button>
                            :
                            <Button type='button' className='me-1' color='primary' onClick={props.onSubmit}>
                                Submit
                            </Button>
                    }
                    <Button type='reset' color='secondary' outline onClick={props.toggleSidebar}>
                        Cancel
                    </Button>
                </div>
                <div>
                    <div className='divider'>
                        <div className='divider-text'>Previous Action/Comment(s)</div>
                    </div>

                        {
                            isLoading ? <div className="text-center mt-3"><Spinner color='dark' /></div>
                                : <div className="row">
                                    <div className='blog-wrapper'>
                                        <DocumentData/>
                                    </div>
                                </div>
                        }
                </div>

            </div>




        </form>
    )
}
const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(FileAction)