const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; //{items:[]}
    this._id = new ObjectId(id);
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((ele) => {
      return ele.productId;
    });

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((ele) => {
          return {
            ...ele,
            quantity: this.cart.items.find(
              (cartItem) => cartItem.productId.toString() === ele._id.toString()
            ).quantity,
          };
        });
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();

    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDb();
    const id = new ObjectId(userId);

    return db
      .collection("users")
      .findOne({ _id: id })
      .then((user) => {
        console.log("User found====>", user);
        return user;
      })
      .catch((error) => {
        console.log("User not found===>", error);
      });
  }
}

module.exports = User;
