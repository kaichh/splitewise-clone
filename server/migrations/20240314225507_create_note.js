/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("note").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("note", (table) => {
        table.increments("id").primary();
        table.integer("transaction_id").unsigned().notNullable();
        table.string("content").notNullable();
        table.timestamp("create_time").defaultTo(knex.fn.now());

        // foreign key
        table
          .foreign("transaction_id")
          .references("transaction.id")
          .onDelete("CASCADE");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("note");
};
