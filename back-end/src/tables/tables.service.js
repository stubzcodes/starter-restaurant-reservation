const knex = require("../db/connection");

//service function for getting specifinc table
function read(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}

//service function for listing all tables by table name
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

//service function for creating a new
async function create(table) {
  const createdTables = await knex("tables").insert(table).returning("*");
  return createdTables[0];
}

//updates table to add reservation_id
async function update(table_id, reservation_id) {
  return knex.transaction(async (seat) => {
    try {
      //updates table
      const updatedTable = await seat("tables")
        .where({ table_id })
        .update({ reservation_id, occupied: true })
        .returning("*");
      //update reservations
      await seat("reservations")
        .where({ reservation_id })
        .update({ status: "seated " });

      return updatedTable;
    } catch (error) {
      throw error;
    }
  });
}

async function destroy(table_id, reservation_id) {
  return knex.transaction(async (unseat) => {
    try {
      //update tables
      const updatedTable = await unseat("tables")
        .where({ table_id })
        .update({ reservation_id: null, occupied: false })
        .returning("*");

      //update reservations
      await unseat("reservations")
        .where({ reservation_id })
        .update({ status: "finished" });

      return updatedTable;
    } catch (error) {
      throw error;
    }
  });
}

module.exports = {
  list,
  read,
  create,
  update,
  destroy,
};
