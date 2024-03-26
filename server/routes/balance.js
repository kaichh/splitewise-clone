const router = require("express").Router();
const db = require("../db");
const UserBalance = require("../services/userBalance");
const GroupBalance = require("../services/groupBalance");

// Get user balance
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const rawBalance = await UserBalance.getBalenceByUser(userId);
    const result = await processBalanceResult(userId, rawBalance);

    res.json({ data: result });
  } catch (err) {
    console.log(err);
  }
});

// Get group balance by member
router.get("/group", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const groupId = Number(req.query.groupId);
    if (!userId) {
      const rawBalance = await GroupBalance.getBalence(groupId);
      res.json({ data: rawBalance });
    } else {
      const rawBalance = await GroupBalance.getBalenceByMember(groupId, userId);
      const result = await processBalanceResult(userId, rawBalance);
      res.json({ data: result });
    }
  } catch (err) {
    console.log(err);
  }
});

async function processBalanceResult(userId, rawBalance) {
  const result = [];
  for (let i = 0; i < rawBalance.length; i++) {
    if (rawBalance[i].creditor === userId) {
      const userName = (
        await db("user").select("name").where({ id: rawBalance[i].debtor })
      )[0].name;

      if (rawBalance[i].balance > 0) {
        result.push({
          role: "debtor",
          userId: rawBalance[i].debtor,
          userName: userName,
          balance: Number(rawBalance[i].balance),
        });
      } else {
        result.push({
          role: "creditor",
          userId: rawBalance[i].debtor,
          userName: userName,
          balance: -rawBalance[i].balance,
        });
      }
    } else {
      const userName = (
        await db("user").select("name").where({ id: rawBalance[i].creditor })
      )[0].name;

      if (rawBalance[i].balance > 0) {
        result.push({
          role: "creditor",
          userId: rawBalance[i].creditor,
          userName: userName,
          balance: Number(rawBalance[i].balance),
        });
      } else {
        result.push({
          role: "debtor",
          userId: rawBalance[i].creditor,
          userName: userName,
          balance: -rawBalance[i].balance,
        });
      }
    }
  }
  return result;
}

module.exports = router;
