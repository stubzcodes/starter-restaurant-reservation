import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();

// Retrieves the base URL from environment variables
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function NewReservation() {
  const history = useHistory();

  // Initializes the form data with default values
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
    status: "booked",
  };
  const [error, setError] = useState(null);
  // State to store form data
  const [formData, setFormData] = useState(initialFormData);

  // Function to handle canceling the creation of a new reservation
  function handleCancel() {
    history.goBack();
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    // Creates an AbortController instance to allow cancellation of the API request
    const abortController = new AbortController();
    //Converts people to a number, the correct data type
    const formDataCorrectTypes = {
      ...formData,
      people: Number(formData.people),
    };

    try {
      // Makes a POST request to create a new reservation
      await axios.post(
        `${BASE_URL}/reservations`,
        { data: formDataCorrectTypes },
        abortController.signal
      );
      // Redirects to the dashboard with the specified reservation date
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        const message = error.response.data.error;
        setError({ message });
      }
    }
    // Cleanup function to abort the API request if needed
    return () => abortController.abort();
  }

  return (
    <>
      <h1>Create a Reservation</h1>
      <ReservationForm
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        reservation={formData}
        formData={formData}
        setFormData={setFormData}
        error={error}
      />
      <ErrorAlert error={error} />
    </>
  );
}

export default NewReservation;
