const router = require("express").Router();
const db = require("../db");
const lodash = require("lodash");

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
        debts: [],
      };
      lodash.forEach(value, (v) => {
        transaction.debts.push({
          debtor: v.debtorName,
          amount: v.debtAmount,
        });
      });
      result.push(transaction);
    });

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
    };

    // Check if group exists
    const group = await db
      .select("*")
      .from("group")
      .where({ id: data.group_id });
    if (group.length === 0) {
      res.send("Group not found");
      return;
    }

    // Insert transaction
    const insertedTransaction = await db
      .insert(data)
      .into("transaction")
      .returning("id");
    const transactionId = insertedTransaction[0].id;

    // Insert debts
    const debts = req.body.debts;

    // Calculate total debt and check if it matches the total amount in transaction
    let totalDebt = 0;
    if (debts) {
      debts.forEach((debt) => {
        totalDebt += debt.amount;
      });
    }
    if (totalDebt !== data.amount) {
      res.send("Total debt does not match total amount in transaction");
      return;
    }

    const debtData = [];
    debts.forEach((debt) => {
      debtData.push({
        transaction_id: transactionId,
        debtor: debt.debtorId,
        amount: debt.amount,
      });
    });
    await db.insert(debtData).into("debt");

    res.send("Transaction created with success!");
  } catch (err) {
    console.log(err);
  }
});

// Delete transaction
router.delete("/:id", async (req, res) => {
  try {
    // Check if transaction exists
    const transaction = await db
      .select("*")
      .from("transaction")
      .where({ id: req.params.id });
    if (transaction.length === 0) {
      res.send("Transaction not found");
      return;
    }

    // Delete transaction
    await db("transaction").where({ id: req.params.id }).del();
    res.send("Transaction deleted with success!");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
