const tablesData = require('./01-tables.json');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      // Inserts seed entries
      console.log("texxt")
      return knex('tables').insert(tablesData);
    });
};