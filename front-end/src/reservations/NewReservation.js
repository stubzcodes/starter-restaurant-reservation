import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function NewReservation() {
  const history = useHistory();
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
  const [formData, setFormData] = useState(initialFormData);

  function handleCancel() {
    history.goBack();
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const formDataCorrectTypes = {
      ...formData,
      people: Number(formData.people),
    };

    try {
      await axios.post(
        `${BASE_URL}/reservations`,
        { data: formDataCorrectTypes },
        abortController.signal
      );
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        const message = error.response.data.error
        setError({message});
      }
    }
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