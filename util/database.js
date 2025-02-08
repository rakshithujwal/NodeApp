const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const connectionString =
  "mongodb+srv://rakshujwal:bqZfh6IiOqsNJd7h@shopnode.3vcih.mongodb.net/?retryWrites=true";

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
