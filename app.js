// @ts-nocheck
const path = require("path");
require("dotenv").config();
const DB_URL = process.env.DB_URL;

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStrore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");

const app = express();
const store = new MongoDBStrore({
  uri: DB_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "pefpJ2FdRWfp8knkACpE",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
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
