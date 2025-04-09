import { React } from 'react';
import {Card} from "reactstrap";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
export function CustomTextArea({data, onEdit, id}) {
    const handleChange = (e) => {
      onEdit(e, id)
    }
    return (
        <Card>
            <ReactQuill
              theme="snow"
              value={data}
              onChange={handleChange}
            />
        </Card>
    )

}
