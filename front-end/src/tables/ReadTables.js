import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();

function ReadTables({ table }) {
  const [error, setError] = useState(null);

  if (!table) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <ErrorAlert error={error} />
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
