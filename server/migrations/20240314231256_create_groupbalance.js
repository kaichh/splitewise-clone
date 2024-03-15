/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("group_balance").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("group_balance", (table) => {
        table.increments("id").primary();
        table.integer("group_id").unsigned().notNullable();
        table.integer("creditor").unsigned().notNullable();
        table.integer("debtor").unsigned().notNullable();
        table.decimal("balance", 14, 2).notNullable();

        // foreign key
        table.foreign("group_id").references("group.id");
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
  return knex.schema.dropTable("group_balance");
};
