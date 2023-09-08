import React from "react";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm({
  error,
  handleSubmit,
  handleCancel,
  reservation,
  formData,
  setFormData,
}) {
  function handleChange(event) {
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);
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
          {error ? <ErrorAlert error={error} /> : null}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
