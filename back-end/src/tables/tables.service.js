const knex = require("../db/connection");

async function create(table) {
    const createdTables = await knex("tables").insert(table).returning("*");
    return createdTables[0];
}


module.exports = {
    create,
}