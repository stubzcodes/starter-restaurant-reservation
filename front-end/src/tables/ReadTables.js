import React from "react";
require("dotenv").config();

function ReadTables({ table }) {

  if (!table) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Table: {table.table_name}</h5>
            <h6
              className="card-subtitle mb-2 text-body-secondary"
              data-table-id-status={table.table_id}
            >
              {" "}
              Status: {table.reservation_id === null ? "Free" : "Occupied"}
            </h6>
          </div>
        </div>
      </>
    );
  }
}

export default ReadTables;
