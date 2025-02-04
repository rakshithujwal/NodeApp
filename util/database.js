const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-demo",
  password: "raksh@123",
});

module.exports = pool.promise();
