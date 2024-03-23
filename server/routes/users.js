const router = require("express").Router();
const db = require("../db");
const UserBalance = require("../services/userBalance");

// Get all users
router.get("/", async (req, res) => {
  try {
    const data = await db("user");
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await db("user").where({ id: id });
    if (data.length === 0) {
      res.send("User not found");
      return;
    }
    res.json({ data: data[0] });
  } catch (err) {
    console.log(err);
  }
});

// Create user
router.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      res.send("Name and email are required");
      return;
    }
    data = {
      name: req.body.name,
      email: req.body.email,
    };
    // Check if user already exists
    const user = await db("user").where({ email: data.email });
    if (user.length > 0) {
      res.send("User already exists");
      return;
    }

    const newUser = await db.insert(data).into("user").returning("id");
    const userId = newUser[0].id;
    await UserBalance.addMember(userId);
    res.send("User created with success!");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
