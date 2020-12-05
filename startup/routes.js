const express = require("express");
var cors = require("cors");
const categories = require("../routes/categories");
const items = require("../routes/items");
const receipts = require("../routes/receipts");
const sales = require("../routes/sales");
const static = require("../routes/static");
const stores = require("../routes/stores");

var logger = function (req, res, next) {
  console.log("GOT REQUEST !");
  next(); // Passing the request to the next handler in the stack.
};

module.exports = app => {
  app.use(express.json());
  app.use(cors());
  app.use(logger);
  app.use("/api/categories", categories);
  app.use("/api/items", items);
  app.use("/api/receipts", receipts);
  app.use("/api/sales", sales);
  app.use("/api/static", static);
  app.use("/api/stores", stores);
};
