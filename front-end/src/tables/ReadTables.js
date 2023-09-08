import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ReadTables({ table }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  async function handleFinish(event) {
    event.preventDefault();
    const abortController = new AbortController();

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await axios.put(
          `${BASE_URL}/reservations/${table.reservation_id}/status`,
          { data: { status: "finished" } },
          abortController.signal
        );
        await axios.delete(
          `${BASE_URL}/tables/${table.table_id}/seat`,
          abortController.signal
        );
        history.push("/");
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      }
      return () => abortController.abort();
    }
  }

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
            {table.reservation_id !== null ? (
              <button
                className="btn btn-primary mr-2"
                data-table-id-finish={table.table_id}
                onClick={handleFinish}
              >
                Finish
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }
}

export default ReadTables;
