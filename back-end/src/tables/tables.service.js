const knex = require("../db/connection");

//service function for listing all tables by table name
function list() {
    return knex("tables").select("*").orderBy("table_name");
}

//service function for creating a new
async function create(table) {
    const createdTables = await knex("tables").insert(table).returning("*");
    return createdTables[0];
}


module.exports = {
    list,
    create,
}