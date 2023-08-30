const knex = require("../db/connection");

//service function for creating a new
async function create(table) {
    const createdTables = await knex("tables").insert(table).returning("*");
    return createdTables[0];
}


module.exports = {
    create,
}