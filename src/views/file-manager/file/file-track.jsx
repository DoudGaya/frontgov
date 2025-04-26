import {
    Card, CardBody,
    CardHeader,
    Row,
    Spinner,
} from "reactstrap";
import {useEffect, useState} from "react";
import {FileText} from "react-feather";
import {connect} from "react-redux";
import axios from "axios";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import Table from "../../../component/common/table/table";
import {toast} from "react-toastify";
function FileTrack(props) {
    const token = props.loginData[0]?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [datatable2, setDatatable2] = useState({
        columns: [
            {
                label: "S/N",
                field: "sn",
            },
            {
                label: "Operation",
                field: "tracker",
            },
            {
                label: "Operation By",
                field: "full_name",
            },
            {
                label: "Operation Date",
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
                                <h4><FileText/>  File Tracking</h4>
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
        await axios.get(`${serverLink}file-manager/file/track/${props.formData.file_id}`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data, result.data.shared)
                }
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("NETWORK ERROR");
            });
    };

    const generateTable = (table_data) => {
        let rowData = [];
        table_data.map((item, index)=> {
            rowData.push({
                sn: index + 1,
                tracker: <span className="text-capitalize">{item.tracker} </span>,
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

    return ( isLoading ? <div className="text-center mt-3"><Spinner color='dark' /></div>
            :
            <div className="row">
                <div className='blog-wrapper'>
                    <DocumentData/>
                </div>
            </div>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}

export default connect(mapStateToProps, null)(FileTrack)