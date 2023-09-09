import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
require("dotenv").config();

// Retrieves the base URL from environment variables
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ReadReservation({ reservation }) {
  const history = useHistory();
  // State to handle errors
  const [error, setError] = useState(null);

  // Function to handle reservation cancellation
  async function handleCancel(event) {
    event.preventDefault();
    // Creates an AbortController instance to allow cancellation of the API request
    const abortController = new AbortController();

    // Asks for confirmation before canceling the reservation
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        // Makes a PUT request to update the reservation status to "cancelled"
        await axios.put(
          `${BASE_URL}/reservations/${reservation.reservation_id}/status`,
          { data: { status: "cancelled" } },
          abortController.signal
        );
        // Redirects to the home page after successful cancellation
        history.push("/");
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      }
      // Cleanup function to abort the API request if needed
      return () => abortController.abort();
    }
  }

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">
            {reservation.first_name} {reservation.last_name}
          </h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">
            Phone Number: {reservation.mobile_number}
          </h6>
          <p className="card-text">
            Reservation Date: {reservation.reservation_date}
          </p>
          <p className="card-text">
            Reservation Time: {reservation.reservation_time}
          </p>
          <p className="card-text">Number of People: {reservation.people}</p>
          <p
            className="card-text"
            data-reservation-id-status={reservation.reservation_id}
          >
            Status: {reservation.status}
          </p>
          {reservation.status !== "booked" ? (
            ""
          ) : (
            <Link
              to={`/reservations/${reservation.reservation_id}/seat`}
              className="btn btn-primary"
              href={`/reservations/${reservation.reservation_id}/seat`}
            >
              Seat
            </Link>
          )}
          {reservation.status !== "booked" ? (
            ""
          ) : (
            <Link
              to={`/reservations/${reservation.reservation_id}/edit`}
              className="btn btn-secondary ml-2"
              href={`/reservations/${reservation.reservation_id}/edit`}
            >
              Edit
            </Link>
          )}
          {reservation.status !== "booked" ? (
            ""
          ) : (
            <button
              className="btn btn-danger ml-2"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ReadReservation;
