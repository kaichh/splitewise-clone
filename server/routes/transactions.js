const lodash = require("lodash");
const moment = require("moment");

const router = require("express").Router();
const db = require("../db");
const GroupBalance = require("../services/groupBalance");
const UserBalance = require("../services/userBalance");
const Transaction = require("../services/transaction");
const Note = require("../services/note");

// Get all transactions in group
router.get("/:groupId", async (req, res) => {
  try {
    // Check if group exists
    const group = await db
      .select("*")
      .from("group")
      .where({ id: req.params.groupId });
    if (group.length === 0) {
      res.send("Group not found");
      return;
    }

    const data = await db
      .select(
        "transaction.id as transactionId",
        "transaction.payer as payerId",
        "user.name as payerName",
        "transaction.amount as totalAmount",
        "transaction.create_time as createTime",
        "transaction.description",
        "debt.debtor as debtorId",
        "debtor.name as debtorName",
        "debt.amount as debtAmount"
      )
      .from("transaction")
      .leftJoin("user", "transaction.payer", "user.id")
      .leftJoin("debt", "transaction.id", "debt.transaction_id")
      .leftJoin("user as debtor", "debt.debtor", "debtor.id")
      .where({ group_id: req.params.groupId });

    // Group by transaction id
    const result = [];
    const groupById = lodash.groupBy(data, "transactionId");
    lodash.forEach(groupById, (value, key) => {
      const transaction = {
        transactionId: key,
        payer: value[0].payerName,
        totalAmount: value[0].totalAmount,
        description: value[0].description,
        createTime: moment(value[0].createTime).format("YYYY-MM-DD HH:mm:ss"),
        debts: [],
        notes: [],
      };
      lodash.forEach(value, (v) => {
        transaction.debts.push({
          debtor: v.debtorName,
          amount: v.debtAmount,
        });
      });
      result.push(transaction);
    });

    // Get notes for each transaction
    for (let i = 0; i < result.length; i++) {
      const notes = await Note.getNotesByTransaction(result[i].transactionId);
      result[i].notes = lodash.map(notes, "content");
    }

    res.json({ data: result });
  } catch (err) {
    console.log(err);
  }
});

// Create transaction
router.post("/", async (req, res) => {
  try {
    if (!req.body.groupId || !req.body.payerId || !req.body.amount) {
      res.send("Group ID, payer ID, and amount are required");
      return;
    }
    const data = {
      group_id: req.body.groupId,
      payer: req.body.payerId,
      amount: req.body.amount,
      description: req.body.description,
      debts: req.body.debts,
      note: req.body.note,
    };

    // Check if group exists
    const group = await db("group").where({ id: data.group_id });
    if (group.length === 0) {
      res.send("Group not found");
      return;
    }

    const result = await Transaction.create(data);
    if (result) {
      res.send("Transaction created with success!");
    } else {
      res.send("Error creating transaction");
    }
  } catch (err) {
    console.log(err);
  }
});

// Delete transaction
router.delete("/:id", async (req, res) => {
  try {
    // Check if transaction exists
    const transaction = await db("transaction").where({ id: req.params.id });
    if (transaction.length === 0) {
      res.send("Transaction not found");
      return;
    }

    // Prepare data to update balance
    const updateBalanceData = {
      groupId: transaction[0].group_id,
      payerId: transaction[0].payer,
      debts: [],
    };
    const debts = await db("debt").where({ transaction_id: req.params.id });
    debts.forEach((debt) => {
      updateBalanceData.debts.push({
        debtorId: debt.debtor,
        amount: debt.amount * -1, // Reverse the amount
      });
    });

    // Delete transaction, debts would be deleted by cascade
    await db("transaction").where({ id: req.params.id }).del();
    // Update balance
    await GroupBalance.updateBalance(updateBalanceData);
    await UserBalance.updateBalance(updateBalanceData);

    res.send("Transaction deleted with success!");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
