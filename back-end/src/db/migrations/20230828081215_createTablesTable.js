
exports.up = function(knex) {
  return knex.schema.createTable("tables", (table) => {
    table.string("table_name").notNull();
    table.integer("capacity").notNull().unsigned();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("tables")
};
