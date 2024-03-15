const pg = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "root",
    password: "root",
    database: "postgres",
  },
});

module.exports = pg;
