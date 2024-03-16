/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // User
  await knex("user").del();
  await knex("user").insert([
    { name: "kc", email: "kc@email.com" },
    { name: "bryan", email: "bryan@email.com" },
    { name: "jimmy", email: "jimmy@email.com" },
    { name: "kenneth", email: "kenneth@email.com" },
    { name: "conner", email: "conner@email.com" },
  ]);

  // Group
  await knex("group").del();
  await knex("group").insert([{ name: "parkway" }, { name: "nola" }]);

  // Group Member
  await knex("group_member").del();
  await knex("group_member").insert([
    { group_id: 1, user_id: 1 },
    { group_id: 1, user_id: 2 },
    { group_id: 1, user_id: 3 },
    { group_id: 1, user_id: 4 },
    { group_id: 2, user_id: 1 },
    { group_id: 2, user_id: 2 },
    { group_id: 2, user_id: 5 },
  ]);

  // Transaction
  await knex("transaction").del();
  await knex("transaction").insert([
    { group_id: 1, payer: 1, amount: 100, description: "costco" },
    { group_id: 1, payer: 2, amount: 200, description: "car rent" },
  ]);

  // Debt
  await knex("debt").del();
  await knex("debt").insert([
    { transaction_id: 1, debtor: 2, amount: 50 },
    { transaction_id: 1, debtor: 3, amount: 30 },
    { transaction_id: 1, debtor: 4, amount: 20 },
    { transaction_id: 2, debtor: 1, amount: 150 },
    { transaction_id: 2, debtor: 3, amount: 50 },
  ]);

  // Note
  await knex("note").del();
  await knex("note").insert([
    { transaction_id: 1, content: "This is a note for costco." },
    { transaction_id: 1, content: "Follow up note for costco." },
  ]);
};
