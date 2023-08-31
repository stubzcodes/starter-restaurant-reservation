const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */

//checks if "reservation_id" matches existing reservation
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

//checks if body data has specific keys
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `${propertyName} is missing.` });
  };
}

//removes special characters from phone numbers and checks if the length is equal to 10,
//which would be the length of a valid phone number
function phoneNumberIsValid(field) {
  return function (req, _res, next) {
    const { data: { [field]: value } = {} } = req.body;
    if (value.replace(/[^0-9]/g, "").length !== 10) {
      return next({
        status: 400,
        message: `${field} must be a valid phone number`,
      });
    }
    next();
  };
}

//checks if the time is valid in a way that can be read by all browsers
function timeIsValid(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;
    const timeCheck = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

    if (!value.match(timeCheck)) {
      return next({
        status: 400,
        message: `${field} must be a valid time.`,
      });
    }
    //checks if the time is in the range that will be accepted by the restaurant
    if (value < "10:30" || value > "21:30") {
      return next({
        status: 400,
        message: `${field} must be between 10:30am and 9:30pm.`,
      });
    }
    next();
  };
}


function dateIsValid(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;
    const { reservation_time } = req.body.data;
    //converts reservation time to a format that is reservation date and reservation time
    let date = new Date(value + " " + reservation_time);
    console.log("My Code", typeof date)
    //checks if date is valid
    if (isNaN(date)) {
      return next({
        status: 400,
        message: `${field} must be a valid date.`,
      });
    }

    //checks if reservation time is on a Tuesday, which is invalid because of operating days
    if (date.getDay() === 2) {
      return next({
        status: 400,
        message: `Restaurant is closed.`,
      });
    }

    //checks if requested reservation date and time is in the past
    if (date.getTime() < new Date().getTime()) {
      return next({
        status: 400,
        message: `${field} must be in the future.`,
      });
    }
    next();
  };
}

function peopleIsValid(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;

    //checks if requested people value is a number
    if (typeof value !== "number") {
      return next({
        status: 400,
        message: `${field} must be a number.`,
      });
    }

    //checks if requested people value is at least 1
    if (value < 1) {
      return next({
        status: 400,
        message: `${field} must be at least 1.`,
      });
    }
    next();
  };
}

//checks if reservation you are attempting to create is already seated or finished
function createStatusValidator(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;

    if (value === "seated" || value === "finished") {
      return next({
        status: 400,
        message: `${field} cannot be seated or finished.`,
      });
    }
    next();
  };
}

//validates status for update
function updateStatusValidator(req, res, next) {
  const { reservation: { status } = {} } = res.locals;
  if (status === "finished") {
    return next({
      status: 400,
      message: "A finished reservation cannot be updated.",
    });
  }
  next();
}

async function updateUnknownStatusValidator (req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;

  if (status === "unknown") {
    return next({
      status: 400,
      message: "Status cannot be unknown.",
    });
  }

  const response = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data: response[0] });
}

//lists all reservations on a particular date
async function list(req, res) {
  const { date } = req.query;

  let data;
  if (date) {
    return res.json({ data: await service.listOnDate(date) } )
  }
  //search by mobile number goes here

  data = await service.list();
 return res.json({ data });
}

//creates reservation
async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({
    data: response,
  });
}

//GETs reservation by reservation id
async function read(req, res) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);
  res.json({ data });
}

//updates reservation status
async function updateStatus(req, res) {
  const { reservation_id} = res.locals.reservation;
  const { status } = req.body.data;

  const response = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data: response[0]})
}

//updates specific reservation
async function updateReservation(req, res) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;
  const { reservation_id } = res.locals.reservation;
  const updatedReservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };
  const response = await service.updateReservation(
    reservation_id,
    updatedReservation
  );
  res.status(200).json({ data: response[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    phoneNumberIsValid("mobile_number"),
    timeIsValid("reservation_time"),
    dateIsValid("reservation_date"),
    peopleIsValid("people"),
    createStatusValidator("status"),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateStatus:[
    asyncErrorBoundary(reservationExists),
    updateStatusValidator,
    updateUnknownStatusValidator,
    asyncErrorBoundary(updateStatus),
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    phoneNumberIsValid("mobile_number"),
    dateIsValid("reservation_date"),
    timeIsValid("reservation_time"),
    peopleIsValid("people"),
    asyncErrorBoundary(updateReservation),
  ],
};
