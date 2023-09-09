import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
import ReadReservation from "./ReadReservation";
require("dotenv").config();

// Retrieves the base URL from environment variables
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function SearchByNumber() {
  // Initializes form data state
  const initialFormData = {
    mobile_number: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // Initialize state to store reservations and loading status
  const [reservation, setReservation] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Initialize state to handle errors
  const [error, setError] = useState(null);

  // Function to handle changes in the mobile number input field
  function handleChange(event) {
    // Creates a copy of the form data to avoid changing the state directly
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    // Updates the form data state
    setFormData(newFormData);
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      // Sends a GET request to the API to search for reservations by mobile number
      const response = await axios.get(
        `${BASE_URL}/reservations?mobile_number=${formData.mobile_number}`,
        abortController.signal
      );
      const { data } = response.data;
      // Sets the retrieved reservations in the state and mark as loaded
      setReservation(data);
      setLoaded(!loaded);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    // Cleanup function to abort the fetch request if necessary
    return () => abortController.abort();
  }

  return (
    <>
      <h1>Find a Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:</label>
          <input
            className="form-control mb-3"
            id="mobile_number"
            name="mobile_number"
            type="text"
            placeholder="Enter a customer's phone number"
            required
            value={formData.mobile_number}
            onChange={handleChange}
          />
          <button className="btn btn-primary mr-2" type="submit">
            Find
          </button>
        </div>
      </form>
      <h2>Reservations</h2>
      {/* Displays retrieved reservations */}
      {reservation.length && loaded
        ? reservation.map((r) => (
            <ReadReservation reservation={r} key={r.reservation_id} />
          ))
        : ""}
      {/* Display a message if no reservations found */}
      {loaded && reservation.length < 1 ? <p>No reservations found</p> : null}
    </>
  );
}

export default SearchByNumber;
