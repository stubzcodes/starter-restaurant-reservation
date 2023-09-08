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
  const { reservation_id } = useParams();
  const initialData = {
    table_id: "",
    reservation_id: reservation_id,
  };
  const history = useHistory();
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    const abortController = new AbortController();
    try {
      async function getTables() {
        const response = await fetch(
          `${BASE_URL}/tables`,
          abortController.signal
        );
        const data = await response.json();
        setTables(data.data);
      }
      getTables();
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    return () => abortController.abort();
  }, []);

  function handleChange(event) {
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);
  }

  function handleCancel() {
    history.goBack();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const formattedData = {
      table_id: Number(formData.table_id),
      reservation_id: Number(formData.reservation_id),
    };

    try {
      await axios.put(
        `${BASE_URL}/tables/${formattedData.table_id}/seat/`,
        { data: formattedData },
        abortController.signal
      );
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    return () => abortController.abort();
  }

  if (tables) {
    return (
      <>
        <div className="card mt-3 pl-3 mb-3">
          <div>
            <h4 className="mt-2 mb-3"> Seat Reservation Number {reservation_id} </h4>
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
    return <p>Loading...</p>;
  }
}

export default SeatReservation;
