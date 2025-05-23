import React from "react";
import { MDBDataTableV5 } from "mdbreact";

export default function Table(props) {
    return (
    <div className="table-responsive p-1 mt-0">
      <MDBDataTableV5
          hover
          entriesOptions={[50, 100, 200, 500, 1000]}
          entries={50}
          pagesAmount={4}
          data={props.data}
          paging={props.paging ?? true}
          pagingTop
          searchTop
          searchBottom={false}
          barReverse
          exportToCSV
      />
    </div>
  );
}
