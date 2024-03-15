/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // User
  await knex("user").del();
  await knex("user").insert([
    { id: 1, username: "kc", email: "kc@email.com" },
    { id: 2, username: "bryan", email: "bryan@email.com" },
    { id: 3, username: "jimmy", email: "jimmy@email.com" },
    { id: 4, username: "kenneth", email: "kenneth@email.com" },
    { id: 5, username: "conner", email: "conner@email.com" },
  ]);

  // Group
  await knex("group").del();
  await knex("group").insert([
    { id: 1, name: "parkway" },
    { id: 2, name: "nola" },
  ]);

  // Group Member
  await knex("group_member").del();
  await knex("group_member").insert([
    { id: 1, group_id: 1, user_id: 1 },
    { id: 2, group_id: 1, user_id: 2 },
    { id: 3, group_id: 1, user_id: 3 },
    { id: 4, group_id: 1, user_id: 4 },
    { id: 5, group_id: 2, user_id: 1 },
    { id: 6, group_id: 2, user_id: 2 },
    { id: 7, group_id: 2, user_id: 5 },
  ]);

  // Group Balance
};
