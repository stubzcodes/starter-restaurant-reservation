import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ReadTables({ table }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  // Function to handle marking a table as finished
  async function handleFinish(event) {
    event.preventDefault();
    const abortController = new AbortController();

    // Asks for confirmation before marking a table as finished
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        // Updates the reservation status to "finished" for the associated table
        await axios.put(
          `${BASE_URL}/reservations/${table.reservation_id}/status`,
          { data: { status: "finished" } },
          abortController.signal
        );
        // Removes the association of the table with the reservation
        await axios.delete(
          `${BASE_URL}/tables/${table.table_id}/seat`,
          abortController.signal
        );
        // Redirects to the home page after finishing
        history.push("/");
      } catch (error) {
        if (error.name !== "AbortError") {
          // Handles and stores any errors that occur during the finishing process
          setError(error);
        }
      }
      // Cleanup function to abort the request if necessary
      return () => abortController.abort();
    }
  }

  if (!table) {
    return <p>Loading...</p>; // Displays a loading message while data is loading
  } else {
    return (
      <>
        <ErrorAlert error={error} /> {/* Displays error alerts if any */}
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
