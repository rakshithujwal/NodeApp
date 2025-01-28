const express = require("express");
const path = require("path");

const router = express.Router();

const products = [];

const rootDir = require("../utils/path");

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, res, next) => {
  console.log("body===>", req.body);
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
