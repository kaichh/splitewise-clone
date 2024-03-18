const router = require("express").Router();
const db = require("../db");
const UserBalance = require("../services/userBalance");
const GroupBalance = require("../services/groupBalance");

// Get user balance
router.get("/:userId", async (req, res) => {
  try {
    const balance = await UserBalance.getBalenceByUser(req.params.userId);
    res.json({ balance: balance });
  } catch (err) {
    console.log(err);
  }
});

// Get group balance by member
router.get("/:groupId/:userId", async (req, res) => {
  try {
    const balance = await GroupBalance.getBalenceByMember(
      req.params.groupId,
      req.params.userId
    );
    res.json({ balance: balance });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
