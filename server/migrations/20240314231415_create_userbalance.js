/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("user_balance").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("user_balance", (table) => {
        table.increments("id").primary();
        table.integer("creditor").unsigned().notNullable();
        table.integer("debtor").unsigned().notNullable();
        table.decimal("balance", 14, 2).notNullable();

        // foreign key
        table.foreign("creditor").references("user.id");
        table.foreign("debtor").references("user.id");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_balance");
};
