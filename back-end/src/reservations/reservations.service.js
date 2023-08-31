const knex = require("../db/connection")

//service function for listing all reservations on a particular date
// function list(date) {
//     return knex("reservations")
//       .select("*")
//       .where({ reservation_date: date })
//       .orderBy("reservation_time");
//   }

function list() {
    return knex("reservations")
        .select("*")
        .orderBy("reservation_time", "asc")
}

  function listOnDate(date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .whereNotIn("status", ["finished", "canceled"])
      .orderBy("reservation_time", "asc");
  }

//service function for creating a reservation 
async function create(reservation) {
    const createdReservations = await knex("reservations")
        .insert(reservation)
        .returning("*");
    return createdReservations[0];    
}

//gets specific reservation, shows first match (should only be 1 match anyway)
function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ "reservation_id": reservation_id })
        .first();
}

//updates existing reservation status
function updateStatus(reservation_id, status) {
    return knex("reservations")
        .where({ reservation_id })
        .update({ status })
        .returning("*");
}

//pulls up a specific reservation to be updated
function updateReservation(reservation_id, reservation) {
    return knex("reservations")
      .where({ reservation_id })
      .update(reservation)
      .returning("*");
  }

  function search(mobile_number) {
    return knex("reservations")
    .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
  }

module.exports = {
    list,
    listOnDate,
    create,
    read,
    updateStatus,
    updateReservation,
    search,
};