// @ts-nocheck
/**
 * @type {import("sequelize").Sequelize}
 */
const Sequelize = require("sequelize");

/**
 * @type {Sequelize}
 */
const sequelize = new Sequelize("node-demo", "root", "raksh@123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
