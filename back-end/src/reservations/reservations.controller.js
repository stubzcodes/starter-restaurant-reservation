const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./reservations.service")

/**
 * List handler for reservation resources
 */

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `${propertyName} is missing.` });
  };
}

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

function timeIsValid(field) {
  return function (req, res, next) {
    const { data: {[field]: value} = {} } =req.body;
    const timeCheck = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

    if(!value.match(timeCheck)) {
      return next({
        status: 400,
        message: `${field} must be a valid time.`
      })
    }
    if (value < "10:30" || value > "21:30") {
      return next ({
        status: 400,
        message: `${field} must be between 10:30am and 9:30pm.`
      });
    }
    next()
  }
}

function dateIsValid(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;
    const { reservation_time } = req.body.data;
    let date = new Date(value + " " + reservation_time);

    if(isNaN(date)) {
      return next({
        status: 400,
        message: `${field} must be a valid date.`
      });
    }
    if (date.getDay() === 2){
      return next ({
        status: 400,
        message: `Restaurant is closed.`,
      });
    }

    if (date.getTime() < new Date().getTime()) {
      return next ({
        status: 400,
        message: `${field} must be in the future.`
      });
    }
    next();
  };
}

function peopleIsValid(field) {
  return function (req, res, next) {
  const { data: { [field]:value } = {} } = req.body;

  if(typeof value !== "number") {
    return next({
      status: 400,
      message: `${field} must be a number.`,
    });
  }

  if (value < 1) {
    return next ({
      status: 400,
      message: `${field} must be at least 1.`,
    });
  }
  next();
  };
}

async function list(req, res) {
  const { date } = req.query;

  let data;
  if (date) {
    data = await service.list(date);
  }
  res.json({ data });
}

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({
    data: response,
  });
}



module.exports = {
  list: [asyncErrorBoundary(list)],
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
    asyncErrorBoundary(create),
  ],
};
