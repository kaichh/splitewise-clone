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

  // Group Balance
};
