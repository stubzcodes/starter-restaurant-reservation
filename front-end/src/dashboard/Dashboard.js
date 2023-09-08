import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReadReservation from "../reservations/ReadReservation";
import { today, previous, next } from "../utils/date-time";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
require("dotenv").config();

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  if (reservations.length !== 0) {
    return (
      <main>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for date: {date}</h4>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${previous(date)}`);
            }}
          >Previous Day</button>
          <button
            className="btn btn-primary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${today()}`);
            }}
          >Today</button>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${next(date)}`);
            }}
          >Next Day</button>
        </div>
        <ErrorAlert error={reservationsError} />
        <div>
          {reservations.map((reservation) => (
            <ReadReservation
              reservation={reservation}
              key={reservation.reservation_id}
            />
          ))}
        </div>
      </main>
    );
  } else {
    return (
      <main>
        <h1>Dashboard</h1>
         <div className="d-md-flex mb-3">
          <h4 className="mb-0">No Reservations for date: {date}</h4>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${previous(date)}`);
            }}
          >Previous Day</button>
          <button
            className="btn btn-primary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${today()}`);
            }}
          >Today</button>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${next(date)}`);
            }}
          >Next Day</button>
        </div>
        <ErrorAlert error={reservationsError} />
      </main>
    );
  }
  }


export default Dashboard;
