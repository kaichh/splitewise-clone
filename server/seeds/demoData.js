/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const UserBalance = require("../services/userBalance");
const GroupBalance = require("../services/groupBalance");
const { faker } = require("@faker-js/faker");
const lodash = require("lodash");
faker.seed(0);

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// const createFakeUser = function () {
//   const firstName = faker.person.firstName();
//   return {
//     name: firstName,
//     email: `firstName{}`,
//   };
// };

// const createFakeGroup = () => {
//   return {
//     name: faker.word.noun(),
//   };
// };

// const createFakeGroupMember = function (fakeUsers) {
//   return {
//     group_id: groupId,
//     user_id: userId,
//   };
// };

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
    for (let j = 1; j < 6; j++) {
      const randomUserId = getRandomInt(1, desiredFakeUsers + 1);
      fakeGroupMembers.push({
        group_id: i,
        user_id: randomUserId,
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

  // // Transactions
  // const fakeTransactions = [];
  // const desiredFakeTractionsInGroup = 2;
  // const groupMembers = lodash.groupBy(fakeGroupMembers, "group_id");
  // for (let i = 1; i < desiredFakeGroups + 1; i++) {
  //   for (let j = 0; j < desiredFakeTractionsInGroup; j++) {
  //     const randomPayerIdx = getRandomInt(1, 6);
  //     const randomAmount = getRandomInt(10, 100);
  //     fakeTransactions.push({
  //       group_id: i,
  //       payer: randomPayer,
  //       amount: randomAmount,
  //       description: faker.lorem.sentence(),
  //     });
  //   }
  // }
};
