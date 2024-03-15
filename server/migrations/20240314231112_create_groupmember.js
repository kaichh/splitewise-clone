/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("group_member").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("group_member", (table) => {
        table.increments("id").primary();
        table.integer("group_id").unsigned().notNullable();
        table.integer("user_id").unsigned().notNullable();

        // foreign key
        table.foreign("group_id").references("group.id");
        table.foreign("user_id").references("user.id");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("group_member");
};
