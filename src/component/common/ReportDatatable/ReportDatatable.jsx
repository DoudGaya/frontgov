import * as React from 'react';
import {DataGrid, GridToolbar} from "@mui/x-data-grid";

export default function ReportDatatable({datatable, height = 600}) {

    const dataset = {
        "columns": datatable.columns,
        "rows": datatable.rows,
    }

    return (
        <div style={{ height: height, width: '100%' }}>
            <DataGrid
                {...dataset}
                slots={{
                    toolbar: GridToolbar,
                }}
            />
        </div>
    );
}