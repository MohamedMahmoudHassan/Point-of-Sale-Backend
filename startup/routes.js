const express = require("express");
var cors = require("cors");
const categories = require("../routes/categories");
const items = require("../routes/items");
const static = require("../routes/static");
const stores = require("../routes/stores");

module.exports = app => {
  app.use(express.json());
  app.use(cors());
  app.use("/api/categories", categories);
  app.use("/api/items", items);
  app.use("/api/static", static);
  app.use("/api/stores", stores);
};
