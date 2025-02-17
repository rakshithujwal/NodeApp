// @ts-nocheck
const path = require("path");
require("dotenv").config();
const DB_URL = process.env.DB_URL;

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const userId = "67aef4439daa5504f1491480";
  User.findById(userId)
    .then((user) => {
      console.log("user==>", user);
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log("Failed To fetch user====>", error);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(DB_URL)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Rakshith",
          email: "raksh@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((error) => {
    console.log("Connection Error===>", error);
  });
