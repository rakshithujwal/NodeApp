const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// Validation rules
const productValidationRules = [
  body("title")
    .isString()
    .isLength({ min: 3 })
    .trim()
    .withMessage("Title must be at least 3 characters long."),
  body("price").isFloat().withMessage("Please enter a valid price."),
  body("description")
    .isLength({ min: 5, max: 200 })
    .trim()
    .withMessage("Description must be between 5 and 200 characters."),
];

// Routes
router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  isAuth,
  productValidationRules,
  adminController.postAddProduct
);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  isAuth,
  productValidationRules,
  adminController.postEditProduct
);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
