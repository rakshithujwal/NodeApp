require("dotenv").config();
const DB_URL = process.env.DB_URL;

const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const connectionString = DB_URL;

const mongoConnect = (callback) => {
  MongoClient.connect(connectionString)
    .then((client) => {
      console.log("Connected to ShopNode");
      callback(client);
    })
    .catch((error) => {
      console.log("Connection Failed ====>", error);
    });
};

module.exports = mongoConnect;
