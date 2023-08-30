
exports.up = function(knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").notNull().primary();
    table.string("table_name").notNull();
    table.integer("capacity").notNull().unsigned();
    table.integer("reservation_id").defaultTo(null);
    table.boolean("occupied").defaultTo(false);
    table
      .foreign("reservation_id")
      .references("reservation_id")
      .inTable("reservations");
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("tables")
};
