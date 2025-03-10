const express = require("express");
const { check, body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

// Validation rules
const emailValidator = check("email")
  .isEmail()
  .withMessage("Please enter a valid email address.")
  .custom(async (value) => {
    const userDoc = await User.findOne({ email: value });
    if (userDoc) {
      throw new Error("E-mail already exists, please pick a different one.");
    }
  })
  .normalizeEmail();

const passwordValidator = body(
  "password",
  "Please enter a password with only numbers and text and at least 5 characters."
)
  .isLength({ min: 5 })
  .isAlphanumeric()
  .trim();

const confirmPasswordValidator = body("confirmPassword")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  })
  .trim();

// Auth Routes
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    passwordValidator,
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post(
  "/signup",
  [emailValidator, passwordValidator, confirmPasswordValidator],
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
