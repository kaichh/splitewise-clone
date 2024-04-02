/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const GroupBalance = require("../services/groupBalance");
const UserBalance = require("../services/userBalance");

exports.seed = async function (knex) {
  // User
  await knex("user").del();
  await knex("user").insert([
    { name: "KC", email: "kc@email.com" },
    { name: "Bryan", email: "bryan@email.com" },
    { name: "Jimmy", email: "jimmy@email.com" },
    { name: "Kenneth", email: "kenneth@email.com" },
    { name: "Conner", email: "conner@email.com" },
  ]);

  // User Balance
  await knex("user_balance").del();
  await UserBalance.create();

  // Group
  await knex("group").del();
  await knex("group").insert([
    { name: "Parkway Place Apartment" },
    { name: "Trip to NOLA" },
  ]);

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
  await knex("group_balance").del();
  // Use createGroupBalance function from balance.js to create balance entries
  await GroupBalance.create(1);
  await GroupBalance.create(2);

  // Transaction
  await knex("transaction").del();
  await knex("transaction").insert([
    { group_id: 1, payer: 1, amount: 100, description: "Costco" },
    { group_id: 1, payer: 2, amount: 200, description: "car rent" },
    { group_id: 2, payer: 2, amount: 300, description: "Oyster" },
  ]);

  // Debt
  await knex("debt").del();
  await knex("debt").insert([
    { transaction_id: 1, debtor: 2, amount: 50 },
    { transaction_id: 1, debtor: 3, amount: 30 },
    { transaction_id: 1, debtor: 4, amount: 20 },
    { transaction_id: 2, debtor: 1, amount: 160 },
    { transaction_id: 2, debtor: 3, amount: 40 },
    { transaction_id: 3, debtor: 1, amount: 10 },
    { transaction_id: 3, debtor: 5, amount: 290 },
  ]);

  // Group Balance
  await GroupBalance.updateBalance({
    groupId: 1,
    payerId: 1,
    debts: [
      { debtorId: 2, amount: 50 },
      { debtorId: 3, amount: 30 },
      { debtorId: 4, amount: 20 },
    ],
  });
  await GroupBalance.updateBalance({
    groupId: 1,
    payerId: 2,
    debts: [
      { debtorId: 1, amount: 160 },
      { debtorId: 3, amount: 40 },
    ],
  });
  await GroupBalance.updateBalance({
    groupId: 2,
    payerId: 2,
    debts: [
      { debtorId: 1, amount: 10 },
      { debtorId: 5, amount: 290 },
    ],
  });

  // User Balance
  await UserBalance.updateBalance({
    payerId: 1,
    debts: [
      { debtorId: 2, amount: 50 },
      { debtorId: 3, amount: 30 },
      { debtorId: 4, amount: 20 },
    ],
  });
  await UserBalance.updateBalance({
    payerId: 2,
    debts: [
      { debtorId: 1, amount: 160 },
      { debtorId: 3, amount: 40 },
    ],
  });
  await UserBalance.updateBalance({
    payerId: 2,
    debts: [
      { debtorId: 1, amount: 10 },
      { debtorId: 5, amount: 290 },
    ],
  });

  // Note
  await knex("note").del();
  await knex("note").insert([
    { transaction_id: 1, content: "This is a note for costco." },
    { transaction_id: 1, content: "Follow up note for costco." },
  ]);
};
