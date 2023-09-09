import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReadReservation from "../reservations/ReadReservation";
import { today, previous, next } from "../utils/date-time";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ReadTables from "../tables/ReadTables";
require("dotenv").config();
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

//date parameter specifies date for Dashboard page to display
function Dashboard({ date }) {
  //sets useHistory function to history variable
  const history = useHistory();

  //sets useState variables for reservations, reservation errors, tables, and general errors
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  //creates hook to use loadDashboard function
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    //creates abort controller in case of cancellations
    const abortController = new AbortController();
    //sets reservationError to null
    setReservationsError(null);
    //calls list reservations function from utils and passes in date parameter and abort controller signal
    listReservations({ date }, abortController.signal)
      .then(setReservations) //sets reservations to reservations on specific date
      .catch(setReservationsError); //sets errors if there are any
    return () => abortController.abort(); //uses abort controller if there are any errors
  }

  useEffect(() => {
    //creates abort controller in case of cancellations
    const abortController = new AbortController();
    try {
      // Asynchronously fetch tables data from the specified URL using the AbortController's signal
      async function getTables() {
        // Send a GET request to fetch tables data
        const response = await fetch(
          `${BASE_URL}/tables`,
          abortController.signal
        );
        // Parse the response data as JSON
        const data = await response.json();
        setTables(data.data);
      }
      // Call the getTables function to initiate the fetch request
      getTables();
    } catch (error) {
      // Handles errors that may occur during the fetch request
      if (error.name !== "AbortError") {
        // If the error is not an AbortError (cancellation), set it as an error state
        setError(error);
      }
    }
    // Returns a cleanup function to abort the fetch request if the component unmounts or if this effect is re-run
    return () => abortController.abort();
    // The effect depends on an empty dependency array, so it runs once after initial render
  }, []);

  //if there are reservations and there are tables will return first JSX, else will return second
  if (reservations.length !== 0 && tables) {
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
          >
            Previous Day
          </button>
          <button
            className="btn btn-primary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${today()}`);
            }}
          >
            Today
          </button>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${next(date)}`);
            }}
          >
            Next Day
          </button>
        </div>
        <ErrorAlert error={error} />
        <ErrorAlert error={reservationsError} />
        <div>
          {reservations.map((reservation) => (
            <ReadReservation
              reservation={reservation}
              key={reservation.reservation_id}
            />
          ))}
        </div>
        <div>
          <h4>Tables</h4>
        </div>
        <div>
          {tables.map((table) => (
            <ReadTables key={table.table_id} table={table} />
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
          >
            Previous Day
          </button>
          <button
            className="btn btn-primary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${today()}`);
            }}
          >
            Today
          </button>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${next(date)}`);
            }}
          >
            Next Day
          </button>
        </div>
        <ErrorAlert error={reservationsError} />
        <div>
          <h4>Tables</h4>
        </div>
        <div>
          {tables.map((table) => (
            <ReadTables key={table.table_id} table={table} />
          ))}
        </div>
      </main>
    );
  }
}

export default Dashboard;
