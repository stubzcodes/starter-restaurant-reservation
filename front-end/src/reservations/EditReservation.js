import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EditReservation() {
  const history = useHistory();
  const params = useParams();
  const { reservation_id } = params;
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
  const [formData, setFormData] = useState(initialData);
  const reservationInfo = {
    ...formData,
    reservation_date: formData.reservation_date.substring(0, 10),
  };

  useEffect(() => {
    const abortController = new AbortController();
    try {
      async function getReservation() {
        const response = await axios.get(
          `${BASE_URL}/reservations/${reservation_id}`, abortController.signal
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
    return () => abortController.abort();
  }, [reservation_id]);

  function handleCancel() {
    history.goBack();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const formDataCorrectTypes = {
      ...formData,
      people: Number(formData.people),
      reservation_date: formData.reservation_date.substring(0, 10)
    };

    try {
      await axios.put(
        `${BASE_URL}/reservations/${reservation_id}`,
        { data: formDataCorrectTypes },
        abortController.signal
      );
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    return () => abortController.abort();
  }

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

