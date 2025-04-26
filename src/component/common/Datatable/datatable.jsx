import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import logo from "@src/assets/images/logo/logo.png";
import { projectTitle } from "@src/resources/constants";

const DataTable = (props) => {
    const today = new Date();
    const current_date = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    const report_date = props.date ?? current_date;
    const tableTitle = props.title ?? "Report";
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBody, setFilteredBody] = useState(props.body);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredBody(props.body);
            return;
        }

        // Filter based on visible text inside each <td>
        const filtered = props.body.filter(row => {
            const tdTexts = Array.from(row.props.children).map(td => {
                return td.props.children?.toString().toLowerCase() ?? "";
            });
            return tdTexts.some(text => text.includes(searchTerm.toLowerCase()));
        });

        setFilteredBody(filtered);
    }, [searchTerm, props.body]);

    // Prepare CSV Export Data
    const csvData = [props.header, ...(props.body.map(row => {
        return Array.from(row.props.children).map(td => {
            const content = td.props.children;
            return typeof content === 'object' ? '' : content; // Ignore buttons/icons
        });
    }))];

    return (
        <div className="datatable-wrapper">
            {props.caption && <h2 className="text-end">{props.caption}</h2>}

            <div className="d-flex justify-content-between align-items-center mb-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control w-25"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CSVLink data={csvData} filename={`${tableTitle}_${report_date}.csv`} className="btn btn-secondary bg-secondary">
                    Export CSV
                </CSVLink>
            </div>

            <div className="text-center mb-2">
                <img src={logo} alt="Logo" style={{ width: "100px", height: "50px" }} /><br/>
                <h3>{projectTitle} <small><br />{tableTitle} <br />{report_date}</small></h3>
            </div>

            <div className="table-responsive">
                <table id={props.tableID ?? "myTable"} className="table table-bordered">
                    <thead className="table-dark">
                    <tr>
                        {props.header.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBody.length > 0 ? filteredBody : (
                        <tr>
                            <td colSpan={props.header.length} className="text-center">No records found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
