import React from "react";
require("dotenv").config();

function ReadReservation({ reservation }) {

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
        </div>
      </div>
    </>
  );
}

export default ReadReservation;
