import React, {useEffect} from "react";
import logo from "@src/assets/images/logo/logo.png"
import "jquery/dist/jquery.min.js";
import jsZip from 'jszip';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "./datatable.css";
import $ from "jquery";
import {projectTitle} from "@src/resources/constants";
window.JSZip = jsZip;

const DataTable = (props) => {
    const today = new Date();
    const current_date = `${today.getFullYear()}-${(today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`;
    let tblID = props.tableID ?? "table";
    let report_date = props.date;
    let groupColumn = props.groupCol ?? 0;
    let isGrouping = props.isGrouping ? {
        "order": [[groupColumn, 'asc']],
        "drawCallback": function (settings) {
            let api = this.api();
            let rows = api.rows({ page: 'current' }).nodes();
            let last = null;

            api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="14" style="background-color: rgba(110, 219, 110, 0.42);" align="center"><h4>' + group + '</h4></td></tr>'
                    );
                    last = group;
                }
            });
        }
    } : {};
    let groupColumnVisibility = props.isGrouping ? { "visible": false, "targets": groupColumn, } : {};

    useEffect(() => {
        setTimeout(()=>{
            if (!$.fn.DataTable.isDataTable(`#${tblID}`)) {
                $(`#${tblID}`).DataTable({
                    pagingType: "full_numbers",
                    pageLength: 20,
                    processing: true,
                    dom: "Bfrtip",
                    select: {
                        style: "single",
                    },
                    buttons: [
                        {
                            extend: "pageLength",
                            className: "btn btn-secondary bg-secondary",
                        },
                        {
                            extend: "copy",
                            className: "btn btn-secondary bg-secondary",
                        },
                        {
                            extend: "csv",
                            className: "btn btn-secondary bg-secondary",
                        },
                        {
                            extend: "excelHtml5",
                            className: "btn btn-secondary bg-secondary",
                        },
                        {
                            extend: "print",
                            customize: function (win) {
                                $(win.document.body).find('table').addClass('print-table');
                                $(win.document.body).find('h1').remove(); $(win.document.body).find('td').find('a').remove();
                                $(win.document.body).find('table').append('<caption style="margin-top: -10px"><div style="text-align: center; width: 100%;  display: block; margin: auto;">' +
                                    `<img src={logo} style="width: 100px, height: 50px" alt=""/><br><h3>${projectTitle} <small><br> ${props.title ?? "Report"} <br> ${report_date ?? current_date}</small></h3></div>` +
                                    '<div style="border-bottom: 1px solid #cccccc; display: none"/></div><caption>');
                                $(win.document.body).find('th').css('white-space', 'pre-line');
                                $(win.document.body).find('td').css('white-space', 'pre-line');
                                $(win.document.body).find('td').css('text-justify', 'auto');
                                $(win.document.body).find('td').css('border', '1px solid #eeeeee', 'width', '33.33%');
                                $(win.document.body).find('table').addClass('compact').css('font-size', '11px', 'width', '100%', 'font-family', 'Roboto, Helvetica, Arial, sans-serif', 'font-weight', '400');
                            },
                            className: "btn btn-secondary bg-secondary",
                        },
                    ],
                    ...isGrouping,
                    fnRowCallback: function (
                        nRow,
                        aData,
                        iDisplayIndex,
                        iDisplayIndexFull
                    ) {
                        var index = iDisplayIndexFull + 1;
                        $("td:first", nRow).html(index);
                        return nRow;
                    },
                    lengthMenu: [
                        [10, 20, 30, 50, -1],
                        [10, 20, 30, 50, "All"],
                    ],
                    columnDefs: [
                        groupColumnVisibility,
                        {
                            targets: 0,
                            render: function (data, type, row, meta) {
                                return type === "export" ? meta.row + 1 : data;
                            },
                        },
                    ],
                });
            }
        }, 1000)
    }, [tblID, current_date, report_date, projectTitle, props.title, isGrouping, groupColumnVisibility]);

    return (
        <table id={tblID} className="table caption-top myTable align-items-center  justify-content-center mb-0" style={{ fontSize: '13px' }}>
            {
                props.caption ? <caption><h1 className="text-end">{props.caption}</h1></caption> : <></>
            }

            <thead>
            <tr style={{ border: '1px solid #cccccc' }}>
                {
                    props.header.length > 0 && props.header.map((item, index) => {
                        return (
                            <th key={index} className="text-uppercase text-secondary text-sm font-weight-bolderopacity-7 ps-2" style={{ backgroundColor: '#eeeeee' }}>{item}</th>
                        )
                    })
                }
            </tr>
            </thead>
            <tbody>
            {props.body}
            </tbody>
        </table>
    );
}

export default DataTable;
