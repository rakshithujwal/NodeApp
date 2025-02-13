const { ObjectId } = require("mongodb");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );
  product
    .save()
    .then((result) => {
      console.log("Created Product in db====>", result);
      return res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log("Error posAddProduct===>", error);
    });
};

exports.getEditProduct = (req, res, next) => {
  console.log("cominggggg");
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((products) => {
      console.log("products====>", products);
      const product = products;
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((error) => {
      console.log("Error while fetching product in admin edit===>", error);
      return res.redirect("/");
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  const product = new Product(title, price, description, imageUrl, productId);

  product
    .save()
    .then((result) => {
      console.log("Updated Product====>", result);
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(
        "error while fetching product details in Post Edit product====>",
        error
      );
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error) => {
      console.log("error while fetching admin products====>", error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then((result) => console.log("Deleted Product===>", result))
    .catch((error) => console.log("Error deleting Product ====>", error));

  res.redirect("/admin/products");
};
