import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function SeatReservation() {
  // Gets the reservation ID from URL params
  const { reservation_id } = useParams();
  const initialData = {
    table_id: "",
    reservation_id: reservation_id, // Sets initial data with the reservation ID
  };
  const history = useHistory();
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    const abortController = new AbortController();
    try {
      async function getTables() {
        // Fetches available tables from the API
        const response = await fetch(
          `${BASE_URL}/tables`,
          abortController.signal
        );
        const data = await response.json();
        setTables(data.data); // Stores fetched table data in state
      }
      getTables();
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error); // Handles and stores any errors that occur during fetching
      }
    }
    // Cleanup function to abort any ongoing fetch requests
    return () => abortController.abort();
  }, []);

  function handleChange(event) {
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    // Updates the form data state based on user input
    setFormData(newFormData);
  }

  function handleCancel() {
    history.goBack();
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const formattedData = {
      // Converts table_id and reservation_id to numbers
      table_id: Number(formData.table_id),
      reservation_id: Number(formData.reservation_id),
    };

    try {
      // Sends a PUT request to seat the reservation at the selected table
      await axios.put(
        `${BASE_URL}/tables/${formattedData.table_id}/seat/`,
        { data: formattedData },
        abortController.signal
      );
      history.push("/dashboard"); // Redirects to the dashboard after seating
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    // Cleanup function to abort the request if necessary
    return () => abortController.abort();
  }

  if (tables) {
    return (
      <>
        <div className="card mt-3 pl-3 mb-3">
          <div>
            <h4 className="mt-2 mb-3">
              {" "}
              Seat Reservation Number {reservation_id}{" "}
            </h4>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="table_id">
                  Table:
                  <select
                    id="table_id"
                    className="ml-2 mb-3"
                    name="table_id"
                    onChange={handleChange}
                    value={formData.table_id}
                  >
                    <option defaultValue={null} hidden>
                      -- Select an Option --
                    </option>
                    {tables.map((table) =>
                      table.reservation_id === null ? (
                        <option key={table.table_id} value={table.table_id}>
                          {table.table_name} - {table.capacity}
                        </option>
                      ) : (
                        ""
                      )
                    )}
                  </select>
                </label>
                <div>
                  <button className="btn btn-primary mr-2" type="submit">
                    Submit
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ErrorAlert error={error} />
      </>
    );
  } else {
    return <p>Loading...</p>; // Displays loading message until tables are fetched
  }
}

export default SeatReservation;
