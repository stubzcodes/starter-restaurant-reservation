import React, { useState } from "react";
// import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm({
  error,
  handleSubmit,
  handleCancel,
  reservation,
  formData,
  setFormData,
}) {
  const [isTuesday, setIsTuesday] = useState(false);
  const [isPastDate, setIsPastDate] = useState(false);
  const [before1030, setBefore1030] = useState(false);

  function isDateTuesday(date) {
    const selectedDate = new Date(`${date}T00:00:00`);
    const dayOfWeek = selectedDate.getUTCDay();

    return dayOfWeek === 2;
  }

  function isDateInPast(date) {
    const selectedDate = new Date(`${date}T00:00:00`);
    const currentDate = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return selectedDate < currentDate;
  }

  function isBefore10(time) {
    const selectedTime = new Date(`1970-01-01T${time}`);
    const earliestTime = new Date(`1970-01-01T10:30:00`);
    return selectedTime < earliestTime;
  }

  function handleChange(event) {
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);

    if (event.target.name === "reservation_date") {
      setIsTuesday(isDateTuesday(event.target.value));
      if (isDateInPast(event.target.value)) {
        setIsPastDate(true);
      } else {
        setIsPastDate(false);
      }
    } else if (event.target.name === "reservation_time") {
      if (isBefore10(event.target.value)) {
        setBefore1030(true);
      } else {
        setBefore1030(false);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            className="form-control"
            id="first_name"
            name="first_name"
            type="text"
            required
            value={reservation.first_name}
            onChange={handleChange}
          />

          <label htmlFor="last_name">Last Name:</label>
          <input
            className="form-control"
            id="last_name"
            name="last_name"
            type="text"
            required
            value={reservation.last_name}
            onChange={handleChange}
          />

          <label htmlFor="mobile_number">Mobile Number:</label>
          <input
            className="form-control"
            id="mobile_number"
            name="mobile_number"
            type="text"
            title="Please enter a valid 10 digit phone number."
            placeholder="123-456-7890"
            pattern="[0-9\-]*"
            required
            value={reservation.mobile_number}
            onChange={handleChange}
          />

          <label htmlFor="reservation_date">Reservation Date:</label>
          <input
            className="form-control"
            id="reservation_date"
            name="reservation_date"
            type="date"
            required
            value={reservation.reservation_date}
            onChange={handleChange}
          />

          <label htmlFor="reservation_time">Reservation Time:</label>
          <input
            className="form-control"
            id="reservation_time"
            name="reservation_time"
            type="time"
            required
            value={reservation.reservation_time}
            onChange={handleChange}
          />

          <label htmlFor="people">Number of People:</label>
          <input
            className="form-control"
            id="people"
            name="people"
            type="number"
            min={1}
            required
            value={reservation.people}
            onChange={handleChange}
          />

          <button className="btn btn-primary mr-2" type="submit">
            Submit
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          {isTuesday && !isPastDate ? (
            <div className="alert alert-danger">
              <p>
                The restaurant is closed on Tuesdays. Please choose another day.
              </p>
            </div>
          ) : (
            ""
          )}
          {isPastDate && !isTuesday ? (
            <div className="alert alert-danger">
              <p>
                Your requested date that is in the past. Please choose a
                different date.
              </p>
            </div>
          ) : (
            ""
          )}
          {isTuesday && isPastDate ? (
            <div className="alert alert-danger">
              <p>
                The restaurant is closed on Tuesdays. Please choose another day.
              </p>{" "}
              <p>
                Additionally, your requested date is in the past. Please choose
                a different date.
              </p>
            </div>
          ) : (
            ""
          )}
          {before1030 ? (
            <div className="alert alert-danger">
              <p>Please choose a time after 10:30 AM.</p>
            </div>
          ) : (
            ""
          )}
          {/* {error ? <ErrorAlert error={error} /> : null} */}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
