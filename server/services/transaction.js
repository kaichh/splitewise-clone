const db = require("../db");
const lodash = require("lodash");
const GroupBalance = require("./groupBalance");
const UserBalance = require("./userBalance");
const Note = require("./note");

const create = async (data) => {
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
  const transactionData = {
    group_id: data.group_id,
    payer: data.payer,
    amount: data.amount,
    description: data.description,
  };

  const insertedTransaction = await db
    .insert(transactionData)
    .into("transaction")
    .returning("id");
  const transactionId = insertedTransaction[0].id;

  // Calculate total debt and check if it matches the total amount in transaction
  const debts = data.debts;
  let totalDebt = 0;
  if (debts) {
    debts.forEach((debt) => {
      totalDebt += debt.amount;
    });
  } else {
    console.log("No debts");
    return false;
  }
  if (totalDebt !== data.amount) {
    res.send("Total debt does not match total amount in transaction");
    return false;
  }

  // Debt data to be inserted
  const debtData = [];
  debts.forEach((debt) => {
    debtData.push({
      transaction_id: transactionId,
      debtor: debt.debtorId,
      amount: debt.amount,
    });
  });

  // Balance data to be updated
  const updateBalanceData = {
    groupId: data.group_id,
    payerId: data.payer,
    debts: [],
  };
  lodash.forEach(debts, (debt) => {
    updateBalanceData.debts.push({
      debtorId: debt.debtorId,
      amount: debt.amount,
    });
  });

  // Insert debts and update balances
  await db.insert(debtData).into("debt");
  await GroupBalance.updateBalance(updateBalanceData);
  await UserBalance.updateBalance(updateBalanceData);
  // Insert notes
  if (data.note !== "") {
    await Note.createNote({
      transactionId: transactionId,
      content: data.note,
    });
  }

  return true;
};

const update = async (data) => {
  /*
  data = {
    id: req.params.id,
    payerId: req.body.payerId,
    amount: req.body.amount,
    description: req.body.description,
    debts: req.body.debts,
    note: req.body.note,
  };
  */

  const response = await db("transaction").where({ id: data.id });
  if (response.length === 0) {
    res.send("Transaction not found");
    return;
  }
  const originalTransaction = response[0];
  const transactionId = response[0].id;

  // Reverse Balance
  // Prepare data to reverse balance
  const reverseBalanceData = {
    groupId: originalTransaction.group_id,
    payerId: originalTransaction.payer,
    debts: [],
  };
  const debts = await db("debt").where({ transaction_id: transactionId });
  debts.forEach((debt) => {
    reverseBalanceData.debts.push({
      debtorId: debt.debtor,
      amount: Number(debt.amount * -1), // Reverse the amount
    });
  });
  await GroupBalance.updateBalance(reverseBalanceData);
  await UserBalance.updateBalance(reverseBalanceData);

  // Delete existing debts
  await db("debt").where({ transaction_id: transactionId }).del();

  // Delete existing notes
  await db("note").where({ transaction_id: transactionId }).del();

  // Prepare new transaction data
  const newTransactionData = {
    group_id: originalTransaction.group_id,
    payer: data.payerId,
    amount: data.amount,
    description: data.description,
  };

  // Prepare new debt data
  const newDebtData = [];
  data.debts.forEach((debt) => {
    newDebtData.push({
      transaction_id: transactionId,
      debtor: debt.debtorId,
      amount: debt.amount,
    });
  });

  // Prepare new balance data
  const newBalanceData = {
    groupId: originalTransaction.group_id,
    payerId: data.payerId,
    debts: [],
  };
  lodash.forEach(data.debts, (debt) => {
    newBalanceData.debts.push({
      debtorId: debt.debtorId,
      amount: debt.amount,
    });
  });

  await db("transaction").where({ id: data.id }).update(newTransactionData);
  await db.insert(newDebtData).into("debt");
  await GroupBalance.updateBalance(newBalanceData);
  await UserBalance.updateBalance(newBalanceData);

  // Insert notes
  if (data.note !== "") {
    await Note.createNote({
      transactionId: transactionId,
      content: data.note,
    });
  }

  return true;
};

module.exports = {
  create,
  update,
};
