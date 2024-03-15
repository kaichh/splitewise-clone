const express = require("express");
const app = express();
const pg = require("./db");
const knex = require("knex");
const port = 8080;

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/newtable", async (req, res) => {
  try {
    await pg.schema.createTable("test", (table) => {
      table.increments("id");
      table.string("name");
    });
  } catch (err) {
    console.log(err);
  }
  res.send("Table created with success!");
});

app.post("/newtable", async (req, res) => {
  try {
    await pg.insert({ name: "test" }).into("test");
  } catch (err) {
    console.log(err);
  }
  res.send("Table content added");
});

app.get("/table", async (req, res) => {
  try {
    const data = await pg.select("*").from("test");
    console.log(data);
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
