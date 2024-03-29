/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("transaction").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("transaction", (table) => {
        table.increments("id").primary();
        table.integer("group_id").unsigned().notNullable();
        table.integer("payer").unsigned().notNullable();
        table.decimal("amount", 14, 2).notNullable();
        table.string("description").notNullable();
        table.timestamp("create_time").defaultTo(knex.fn.now());
        table.boolean("is_settlement").defaultTo(false);

        // foreign key
        table.foreign("group_id").references("group.id");
        table.foreign("payer").references("user.id");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transaction");
};
