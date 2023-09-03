import React, { useState } from "react";
import { useParams } from "react-router-dom";

function ReservationForm({
  //props passed from edit and new reservation
  initialFormData,
  submitHandler,
  cancelHandler,
}) {
  //sets state for data from form
  const [formData, setFormData] = useState({ ...initialFormData });
  
  //handles change to data
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  function handleSubmit(event) {
    //standard default handling
    event.prevenDefault();

    //submitHandler function passed as prop, form data passed in as parameter
    submitHandler(formData);
  }

  function handleCancel(event) {
    //standard default handling from click
    event.prevenDefault();
    //cancel handling function which was passed in as prop
    cancelHandler();
  }

  //form that can be used for both new reservations and editing an existing reservation
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            className="form-control"
            id="first_name"
            name="first_name"
            type="text"
            onChange={handleChange}
            value={formData.first_name}
            required
          />
          <label htmlForm="last_name">Last Name</label>
          <input
            className="form-control"
            id="last_name"
            name="last_name"
            type="text"
            onChange={handleChange}
            value={formData.last_name}
            required
          />
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            className="form-control"
            id="mobile_number"
            name="mobile_number"
            type="text"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          />
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            className="form-control"
            id="reservation_date"
            name="reservation_date"
            type="text"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          />
          <label htmlFor="reservation_time">Reservation Time</label>
          <input
            className="form-control"
            id="reservation_time"
            name="reservation_time"
            type="text"
            onChange={handleChange}
            value={formData.reservationTime}
            required
          />
          <label htmlFor="people">Number of People</label>
          <input
            className="form-control"
            id="people"
            name="people"
            type="number"
            onChange={handleChange}
            value={formData.people}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mr-2">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
