/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const UserBalance = require("../services/userBalance");
const GroupBalance = require("../services/groupBalance");
const Transaction = require("../services/transaction");
const { faker } = require("@faker-js/faker");
const lodash = require("lodash");
faker.seed(0);

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/*
    data = {
        group_id: 1,
        payer: 1,
        amount: 100,
        description: "Lunch",
        debts: [
            { debtorId: 2, amount: 50 },
            { debtorId: 3, amount: 50 },
        ],
        note: "Lunch at McDonalds, what a wonderful day!"
    }
    */

const createFakeTransaction = function (groupId, members) {
  // Get a random payer and two random debtors
  const payerIdx = getRandomInt(0, members.length);
  let debtorIdx1, debtorIdx2;
  while (true) {
    debtorIdx1 = getRandomInt(0, members.length);
    if (debtorIdx1 !== payerIdx) {
      break;
    }
  }
  while (true) {
    debtorIdx2 = getRandomInt(0, members.length);
    if (debtorIdx2 !== payerIdx && debtorIdx2 !== debtorIdx1) {
      break;
    }
  }

  // Randomize amount and debts
  const debts1 = getRandomInt(10, 100);
  const debts2 = getRandomInt(10, 100);
  const amount = debts1 + debts2;

  return {
    group_id: groupId,
    payer: members[payerIdx],
    amount: amount,
    description: faker.vehicle.vehicle(),
    debts: [
      { debtorId: members[debtorIdx1], amount: debts1 },
      { debtorId: members[debtorIdx2], amount: debts2 },
    ],
    note: faker.lorem.sentence(),
  };
};

exports.seed = async function (knex) {
  // Users
  const fakeUsers = [];
  const desiredFakeUsers = 50;
  for (let i = 1; i < desiredFakeUsers + 1; i++) {
    const firstName = faker.person.firstName();
    fakeUsers.push({
      name: `${firstName}${i}`,
      email: `${firstName}${i}@email.com`,
    });
  }
  await knex("user").del();
  await knex("user").insert(fakeUsers);

  // User Balance
  await knex("user_balance").del();
  await UserBalance.create();

  // Groups
  const fakeGroups = [];
  const desiredFakeGroups = 100;
  for (let i = 1; i < desiredFakeGroups + 1; i++) {
    fakeGroups.push({
      name: `Group ${i}`,
    });
  }
  await knex("group").del();
  await knex("group").insert(fakeGroups);

  // Group Member
  const fakeGroupMembers = [];
  for (let i = 1; i < desiredFakeGroups + 1; i++) {
    // Generate array from 1 to desiredFakeUsers
    const userIds = Array.from(
      { length: desiredFakeUsers },
      (_, index) => index + 1
    );
    randomMemberIds = lodash.sampleSize(userIds, 5);
    for (const id of randomMemberIds) {
      fakeGroupMembers.push({
        group_id: i,
        user_id: id,
      });
    }
  }
  await knex("group_member").del();
  await knex("group_member").insert(fakeGroupMembers);

  // Group Balance
  await knex("group_balance").del();
  for (let i = 1; i < desiredFakeGroups + 1; i++) {
    await GroupBalance.create(i);
  }

  // Transactions with debts and notes
  const fakeTransactions = [];
  const desiredFakeTractionsInGroup = 2;
  const groupMembers = lodash.groupBy(fakeGroupMembers, "group_id");
  for (let groupId = 1; groupId < desiredFakeGroups + 1; groupId++) {
    const members = lodash.map(groupMembers[groupId], "user_id");
    for (let i = 0; i < desiredFakeTractionsInGroup; i++) {
      fakeTransactions.push(createFakeTransaction(groupId, members));
    }
  }
  await knex("transaction").del();
  for (let i = 0; i < fakeTransactions.length; i++) {
    const result = await Transaction.create(fakeTransactions[i]);
    if (!result) {
      console.log("Error creating transactions in seed");
      break;
    }
  }
};
