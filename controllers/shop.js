const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Order = require("../models/order");
const Product = require("../models/product");

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Ensure page is a valid number
  let totalItems;

  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product?.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Ensure page is a valid number
  let totalItems;

  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart?.items;
      console.log("products====>", products);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((ele) => {
        return {
          quantity: ele.quantity,
          product: { ...ele.productId._doc },
        };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId) // Use findByPk for Sequelize
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userId.toString() !== req.user.id.toString()) {
        return next(new Error("Unauthorized access"));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      // **Invoice Header**
      pdfDoc.fontSize(26).text("Invoice", { underline: true });
      pdfDoc.text("----------------------");
      pdfDoc.fontSize(14).text(`Order ID: ${order.id}`);
      pdfDoc.text(`User ID: ${order.user.userId}`);
      pdfDoc.text("----------------------");

      let totalPrice = 0;

      // **Order Items**
      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          if (item.product) {
            pdfDoc
              .fontSize(12)
              .text(
                `${item.product.title} - ${item.quantity} x $${item.product.price}`
              );
            totalPrice += item.quantity * item.product.price;
          }
        });
      } else {
        pdfDoc.fontSize(12).text("No items found in this order.");
      }

      pdfDoc.text("----------------------");
      pdfDoc.fontSize(16).text(`Total Price: $${totalPrice}`, { bold: true });
      pdfDoc.end();
    })
    .catch((err) => next(err));
};
