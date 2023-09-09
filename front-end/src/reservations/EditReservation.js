import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();

// Retrieves the base URL from environment variables
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EditReservation() {
  const history = useHistory();
  const params = useParams();
  const { reservation_id } = params;
  // Initializes the form data with default values
  const initialData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
    status: "",
  };
  const [error, setError] = useState(null);
  //state will store form data
  const [formData, setFormData] = useState(initialData);
  //creates an object with res info, including formatted date
  const reservationInfo = {
    ...formData,
    reservation_date: formData.reservation_date.substring(0, 10),
  };

  useEffect(() => {
    const abortController = new AbortController();
    try {
      async function getReservation() {
        const response = await axios.get(
          `${BASE_URL}/reservations/${reservation_id}`,
          abortController.signal
        );
        const data = response.data;
        setFormData(data.data);
      }
      getReservation();
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    // Cleanup function to abort the fetch request if the component unmounts
    return () => abortController.abort();
    //reservation id is dependency because only needs to run if there is a reservation to edit
  }, [reservation_id]);

  // Function to handle canceling the edit and navigating back
  function handleCancel() {
    history.goBack();
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    // Converts form data (specifically people and date) to the correct data types before submitting
    const formDataCorrectTypes = {
      ...formData,
      people: Number(formData.people),
      reservation_date: formData.reservation_date.substring(0, 10),
    };

    try {
      // Makes a PUT request to update the reservation
      await axios.put(
        `${BASE_URL}/reservations/${reservation_id}`,
        { data: formDataCorrectTypes },
        abortController.signal
      );
      // Redirects to the dashboard with the updated date
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    // Cleanup function to abort the API request if needed
    return () => abortController.abort();
  }

  // Renders the form with reservation data if formData is available
  if (formData) {
    return (
      <>
        <h1>Edit Reservation</h1>
        <ErrorAlert error={error} />
        <ReservationForm
          reservation={reservationInfo}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          formData={formData}
          setFormData={setFormData}
        />
      </>
    );
  }
}

export default EditReservation;
