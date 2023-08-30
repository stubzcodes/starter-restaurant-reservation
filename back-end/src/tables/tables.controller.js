const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

function quantityIsValid(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;
    if (value < 1) {
      return next({
        status: 400,
        message: `${field} must be at least 1.`,
      });
    }
    if (!Number.isInteger(value)) {
      return next({
        status: 400,
        message: `${field} must be an integer.`,
      });
    }
    next();
  };
}

function nameIsValid(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;

    if (value.length < 2) {
      return next({
        status: 400,
        message: `${field} must be at least 2 characters in length.`,
      });
    }
    next();
  };
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `${propertyName} is missing.` });
    };
  }

async function create(req, res) {
    const response = await service.create(req.body.data);
    res.status(201).json({ data: response })
}

module.exports = {
    create: [
        bodyDataHas("table_name"),
        bodyDataHas("capacity"),
        nameIsValid("table_name"),
        quantityIsValid("capacity"),
        asyncErrorBoundary(create),
    ],
};
