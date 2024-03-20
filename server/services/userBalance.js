const db = require("../db");

// Create entries in user_balance table when a new group is created
const create = async () => {
  try {
    // Get all the users
    const users = await db("user").select("id");

    if (users.length < 2) {
      console.log("User has less than 2 members");
      return false;
    }

    // If there are already entries in the user_balance table with the group_id, delete them
    await db("user_balance").del();

    // For each pair of members, create a balence entry init with 0
    const userBalanceEntries = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        userBalanceEntries.push({
          creditor: users[i].id,
          debtor: users[j].id,
          balance: 0,
        });
      }
    }
    // Insert the user balance entries into the user_balance table
    await db("user_balance").insert(userBalanceEntries);

    // console.log("User balance entries created successfully");
  } catch (error) {
    console.error("Error creating group balance entries:", error);
  }
};

// Get balance of a user
const getBalenceByUser = async (userId) => {
  try {
    // Get the balance of a user that is either in the creditor or debtor column and return the rows that balance is not 0
    const balance = await db("user_balance")
      .select("creditor", "debtor", "balance")
      .where((builder) => {
        builder.where("creditor", userId).orWhere("debtor", userId);
      })
      .andWhere("balance", "!=", 0);
    return balance;
  } catch (error) {
    console.error("Error getting user balance:", error);
  }
};

// Add entries in user_balance table when a new member created
const addMember = async (userId) => {
  try {
    const users = await db("user").select("id");

    if (users.length < 2) {
      console.log("User has less than 2 members");
      return false;
    }

    const userBalanceEntries = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].id !== userId) {
        userBalanceEntries.push({
          creditor: users[i].id,
          debtor: userId,
          balance: 0,
        });
      }
    }
    // Insert the user balance entries into the user_balance table
    await db("user_balance").insert(userBalanceEntries);

    console.log("User balance entries created successfully");
  } catch (error) {
    console.error("Error creating group balance entries:", error);
  }
};

// Update the balance based on the transaction
const updateBalance = async (transactionData) => {
  try {
    const { payerId, debts } = transactionData;

    for (const debt of debts) {
      const balance = await db("user_balance")
        .where({ creditor: payerId, debtor: debt.debtorId })
        .orWhere({ creditor: debt.debtorId, debtor: payerId });

      //   console.log("balance: ", balance[0]);

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
      const result = await db("user_balance")
        .where("id", balance[0].id)
        .update({ balance: newBalance });
    }
  } catch (error) {
    console.error("Error updating group balance:", error);
  }
};

module.exports = {
  create,
  getBalenceByUser,
  addMember,
  updateBalance,
};
