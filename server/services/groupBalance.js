const db = require("../db");
const lodash = require("lodash");

// Create entries in group_balance table when a new group is created
const create = async (groupId) => {
  try {
    // Get all the members of the group
    const members = await db("group_member")
      .select("user_id")
      .where("group_id", groupId);

    if (members.length < 2) {
      console.log("Group has less than 2 members");
      return false;
    }

    // If there are already entries in the group_balance table with the group_id, delete them
    await db("group_balance").where("group_id", groupId).del();

    // For each pair of members, create a balence entry init with 0
    const groupBalanceEntries = [];
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        groupBalanceEntries.push({
          group_id: groupId,
          creditor: members[i].user_id,
          debtor: members[j].user_id,
          balance: 0,
        });
      }
    }
    // Insert the group balance entries into the group_balance table
    await db("group_balance").insert(groupBalanceEntries);

    console.log("Group " + groupId + " balance entries created successfully");
  } catch (error) {
    console.error("Error creating group balance entries:", error);
  }
};

// Get the balance of a member in a group
const getBalenceByMember = async (groupId, userId) => {
  try {
    const balance = await db("group_balance")
      .select("balance")
      .where({ group_id: groupId, creditor: userId })
      .orWhere({ group_id: groupId, debtor: userId });
    return balance[0].balance;
  } catch (error) {
    console.error("Error getting group balance:", error);
  }
};

// Add entries in group_balance table when a new member is added to a group
const addMember = async (groupId, userId) => {
  try {
    const members = await db("group_member")
      .select("user_id")
      .where("group_id", groupId);

    if (members.length < 2) {
      console.log("Group has less than 2 members");
      return false;
    }
    const groupBalanceEntries = [];
    for (let i = 0; i < members.length; i++) {
      if (members[i].user_id !== userId) {
        groupBalanceEntries.push({
          group_id: groupId,
          creditor: members[i].user_id,
          debtor: userId,
          balance: 0,
        });
      }
    }
    await db("group_balance").insert(groupBalanceEntries);
    console.log("Group " + groupId + " balance entries added successfully");
    return true;
  } catch (error) {
    console.error("Error creating group balance entries:", error);
  }
};

// Update the balance based on the transaction
const updateBalance = async (transactionData) => {
  try {
    const { groupId, payerId, debts } = transactionData;

    for (const debt of debts) {
      const balance = await db("group_balance")
        .where("group_id", groupId)
        .andWhere((builder) => {
          builder
            .where({ creditor: payerId, debtor: debt.debtorId })
            .orWhere({ creditor: debt.debtorId, debtor: payerId });
        });

      // console.log("balance: ", balance[0]);

      if (balance.length !== 1) {
        console.log(
          "Get balance error: balance not found or more than one found"
        );
        return;
      }

      // Update the new balance
      const oldBalance = Number(balance[0].balance);
      let newBalance;
      if (balance[0].creditor === payerId) {
        newBalance = oldBalance + debt.amount;
      } else {
        newBalance = oldBalance - debt.amount;
      }

      // Write the new balance to the database
      const result = await db("group_balance")
        .where("id", balance[0].id)
        // .andWhere("creditor", balance[0].creditor)
        // .andWhere("debtor", balance[0].debtor)
        .update({ balance: newBalance });
    }
  } catch (error) {
    console.error("Error updating group balance:", error);
  }
};

module.exports = {
  create,
  getBalenceByMember,
  addMember,
  updateBalance,
};
