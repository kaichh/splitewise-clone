/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("group").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("group", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("group");
};
