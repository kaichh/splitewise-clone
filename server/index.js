const express = require("express");
const app = express();
const db = require("./db");
const port = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Routes
app.use("/users", require("./routes/users"));
app.use("/groups", require("./routes/groups"));
app.use("/transactions", require("./routes/transactions"));
app.use("/balance", require("./routes/balance"));

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
