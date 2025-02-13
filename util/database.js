require("dotenv").config();
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

let _db;
/** @type {MongoClient} */
/** @type {import("mongodb").Db} */
/** @type {import("mongodb").Collection} */

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionString = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@shopnode.3vcih.mongodb.net/shop?retryWrites=true`;

const mongoConnect = (callback) => {
  MongoClient.connect(connectionString)
    .then((client) => {
      _db = client.db();

      callback();
    })
    .catch((error) => {
      console.log("Connection Failed ====>", error);
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
