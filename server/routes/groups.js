const router = require("express").Router();
const db = require("../db");
const lodash = require("lodash");
const GroupBalance = require("../services/groupBalance");

// Get all groups
router.get("/", async (req, res) => {
  try {
    const data = await db.select("*").from("group");
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
});

// Create group
router.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      res.send("Name is required");
      return;
    }
    data = {
      name: req.body.name,
    };

    const group = await db.insert(data).into("group").returning("id");
    const groupId = group[0].id;

    res.send("Group created with success!");
  } catch (err) {
    console.log(err);
  }
});

// Get group by ID
router.get("/:id", async (req, res) => {
  try {
    // Check parameters
    if (!req.params.id) {
      res.send("ID is required");
      return;
    }
    // Get group with members
    const data = await db
      .select(
        "group.id",
        "group.name",
        "user.id as user_id",
        "user.name as user_name",
        "user.email as user_email"
      )
      .from("group")
      .leftJoin("group_member", "group.id", "group_member.group_id")
      .leftJoin("user", "group_member.user_id", "user.id")
      .where({ "group.id": req.params.id });

    // Group by group id
    const result = {
      id: data[0].id,
      name: data[0].name,
      members: [],
    };
    lodash.forEach(data, (value) => {
      result.members.push({
        userId: value.user_id,
        userName: value.user_name,
        email: value.user_email,
      });
    });

    res.json({ data: result });
  } catch (err) {
    console.log(err);
  }
});

// Add member to group
router.post("/:id/members", async (req, res) => {
  try {
    if (!req.body.userId) {
      res.send("User ID is required");
      return;
    }
    const data = {
      group_id: req.params.id,
      user_id: req.body.userId,
    };
    // Check if user exists
    const user = await db.select("*").from("user").where({ id: data.user_id });
    if (user.length === 0) {
      res.send("User does not exist");
      return;
    }

    // Check if user already exists in group
    const userInGroup = await db
      .select("*")
      .from("group_member")
      .where({ group_id: data.group_id, user_id: data.user_id });
    if (userInGroup.length > 0) {
      res.send("User already exists in group");
      return;
    }

    await db.insert(data).into("group_member");
    // Add entries in group_balance table when a new member is added to a group
    const result = await GroupBalance.addMember(data.group_id, data.user_id);
    if (!result) {
      res.send("Error adding user to group");
      return;
    }
    res.send("User added to group with success!");
  } catch (err) {
    console.log("Error adding user to group");
    console.log(err);
  }
});

module.exports = router;
