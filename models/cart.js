const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);
module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //analyze the cart-> find existing product
      const existingProductIndex = cart.products.findIndex(
        (ele) => ele.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += Number(productPrice);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("Error While writing cart to file ====>", err);
      });
    });
  }
};
