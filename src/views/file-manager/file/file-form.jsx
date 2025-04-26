import {Button} from "reactstrap";
import {FileText, Trash} from "react-feather";
import {renderFileSize} from "@src/resources/constants";
export default function FileForm(props) {

    const onDelete = (e, item) => {
        let filter = props.fileList.filter(e => e.ImageName !== item.ImageName);
        props.setFileList(filter)
    }

    return (
        <form>
            <div className="row">
                <div className="form-group mb-1">
                    <label className='form-label'>Upload File</label>
                    <input type="file" id="MultipleImages" name="MultipleImages" className="form-control"
                           onChange={props.onMultipleUploadChange} multiple/>
                </div>
                <div>
                    <>
                        {
                            props.fileList.length > 0 ?
                                <div className='divider'>
                                    <div className='divider-text'>Selected File(s)</div>
                                </div>
                                :
                                <></>
                        }
                    </>
                    {
                        props.fileList.length > 0 && props.fileList.map((item, index) => {
                            const size = renderFileSize(item.file_size);
                            return (
                                <div key={index} className="form-group mb-1">
                                    <div className='border rounded p-1'>
                                        <div className='d-flex flex-column flex-md-row'>
                                            {
                                                item.file_type === "image/png" || item.file_type === "image/jpg" || item.file_type === "image/jpeg" ?
                                                    <img
                                                        className='rounded me-2 mb-1 mb-md-0'
                                                        src={item.ImageDisplay}
                                                        alt='File'
                                                        width='60'
                                                        height='60'
                                                    />
                                                    : <FileText size={50}/>
                                            }

                                            <div className="w-100">
                                                <small className='text-muted'>{item.ImageName}</small>

                                                <p className='my-50'>
                                                    <a href='#' onClick={e => e.preventDefault()}>
                                                        {`${size}`}
                                                    </a>
                                                </p>
                                            </div>
                                            <div className="float-right">
                                                <button type="button" className='btn btn-danger btn-sm float-end'
                                                        onClick={(e) => onDelete(e, item)}><Trash size={15} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
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
                            Submit
                        </Button>
                }
                <Button type='reset' color='secondary' outline onClick={props.toggleSidebar}>
                    Cancel
                </Button>
            </div>



        </form>
    )
}