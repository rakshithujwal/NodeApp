const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-demo", "root", "raksh@123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
