const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);

// const { ObjectId } = require("mongodb");

// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = new ObjectId(userId);
//   }

//   save() {
//     const db = getDb();
//     let res;
//     if (this._id) {
//       res = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       res = db.collection("products").insertOne(this);
//     }
//     return res
//       .then((result) => {
//         console.log("Product Save====>", result);
//       })
//       .catch((error) => {
//         console.log("Error while saving data to db ");
//       });
//   }

//   static fetchAll() {
//     const db = getDb();

//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log("fetchAll products===>", products);
//         return products;
//       })
//       .catch((e) => console.log("Error while fetching products===>", e));
//   }

//   static findById(id) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .findOne({ _id: new ObjectId(id) })
//       .then((product) => {
//         console.log("findById product ===>", product);
//         return product;
//       })
//       .catch((e) => console.error("Error while fetching product ===>", e));
//   }

//   static deleteById(prodId) {
//     const id = new ObjectId(prodId);
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: id })
//       .then((result) => console.log("Product Deleted===>", result))
//       .catch((error) => console.log("error while deleting product===>", error));
//   }
// }

// module.exports = Product;
