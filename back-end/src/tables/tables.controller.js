const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");


function quantityIsValid(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;
    //checks if new table capacity is at least 1
    if (value < 1) {
      return next({
        status: 400,
        message: `${field} must be at least 1.`,
      });
    }
    //checks if new table capacity is an integer
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
    //checks if table name is at least 2 characters long
    if (value.length < 2) {
      return next({
        status: 400,
        message: `${field} must be at least 2 characters in length.`,
      });
    }
    next();
  };
}

//checks if request data has a particular object key
function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `${propertyName} is missing.` });
    };
  }

//lists all tables by table name (ordered in service function)
async function list(req, res) {
    const data = await service.list();
    res.status(200).json({ data })
}

//creates a new table  
async function create(req, res) {
    const response = await service.create(req.body.data);
    res.status(201).json({ data: response })
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [
        bodyDataHas("table_name"),
        bodyDataHas("capacity"),
        nameIsValid("table_name"),
        quantityIsValid("capacity"),
        asyncErrorBoundary(create),
    ],
};
