import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function NewTable() {
  const history = useHistory();
  const initialFormData = {
    table_name: "",
    capacity: "",
  };

  // State for form data and error handling
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);

  // Function to handle the cancellation and navigate back
  function handleCancel() {
    history.goBack();
  }

  // Function to handle changes in form inputs
  function handleChange(event) {
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    // Updates the form data state based on user input
    setFormData(newFormData);
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const formDataCorrectTypes = {
      ...formData,
      capacity: Number(formData.capacity), // Converts capacity to a number
    };

    try {
      // Sends a POST request to create a new table
      await axios.post(
        `${BASE_URL}/tables`,
        { data: formDataCorrectTypes },
        abortController.signal
      );
      // Redirects to the dashboard after creating the table
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") {
        // Handles and stores any errors that occur during the table creation
        setError(error);
      }
    }
    // Cleanup function to abort the request if necessary
    return () => abortController.abort();
  }

  return (
    <>
      <h1>Create a Table</h1>
      <ErrorAlert error={error} />
      <div>
        <div className="form-group">
          <form onSubmit={handleSubmit}>
            <label htmlFor="table_name">Table Name:</label>
            <input
              className="form-control"
              name="table_name"
              id="table_name"
              type="text"
              required
              pattern=".{2,}"
              title="Must be at least 2 characters long."
              value={formData.table_name}
              onChange={handleChange}
            ></input>

            <label htmlFor="capacity">Capacity:</label>
            <input
              className="form-control"
              name="capacity"
              id="capacity"
              type="text"
              required
              pattern="[0-9]+"
              title="Table must have capacity of 1 or more."
              value={formData.capacity}
              onChange={handleChange}
            ></input>

            <button className="btn btn-primary mt-2 mr-2" type="submit">
              Submit
            </button>
            <button className="btn btn-secondary mt-2" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewTable;
