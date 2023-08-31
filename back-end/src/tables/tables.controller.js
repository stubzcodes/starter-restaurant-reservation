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

//validates capacity requirement
async function capacityIsValid(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "data is missing",
    });
  }

  if (!req.body.data.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id is missing",
    });
  }

  const reservation = await reservationsService.read(
    req.body.data.reservation_id
  );

  if (!reservation) {
    return next({
      status: 404,
      message: `reservation_id ${req.body.data.reservation_id} not found`,
    });
  }
  const table = await service.read(req.params.table_id);
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: "Table capacity exceeded.",
    });
  }
  next();
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

//checks if table_id exists using service read function
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  //if table doesn't exist, send error
  if (!table) {
    return next({
      status: 404,
      message: `Table ${table_id} cannot be found.`,
    });
  }
  //if table exists, saves table in locals
  res.locals.table = table;

  next();
}

//checks if specific table is occupied
async function isOccupied(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (table.reservation_id) {
    return next({
      status: 400,
      message: "Table is occupied.",
    });
  }
  next();
}

//checks if table is not occupied
async function isNotOccupied(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (!table.reservation_id) {
    return next({
      status: 400,
      message: "Table is not occupied.",
    });
  }
  next();
}

//checks if reservation has already been seated
async function reservationNotSat(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated",
    });
  }
  next();
}

//lists all tables by table name (ordered in service function)
async function list(req, res) {
  const data = await service.list();
  res.status(200).json({ data });
}

//creates a new table
async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response });
}

//updates tables and reservations with respective ids
async function update(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const response = await service.update(table_id, reservation_id);

  res.status(200).json({ data: response });
}

//deletes seated table to finish reservation
async function destroy(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.table;

  const response = await service.destroy(table_id, reservation_id);
  res.status(200).json({ data: response });
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
  update: [
    asyncErrorBoundary(capacityIsValid),
    asyncErrorBoundary(isOccupied),
    asyncErrorBoundary(reservationNotSat),
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(isNotOccupied),
    asyncErrorBoundary(destroy),
  ],
};
