/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("debt").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("debt", (table) => {
        table.increments("id").primary();
        table.integer("transaction_id").unsigned().notNullable();
        table.integer("creditor").unsigned().notNullable();
        table.integer("debtor").unsigned().notNullable();
        table.decimal("amount", 14, 2).notNullable();

        // foreign key
        table.foreign("transaction_id").references("transaction.id");
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
  return knex.schema.dropTable("debt");
};
