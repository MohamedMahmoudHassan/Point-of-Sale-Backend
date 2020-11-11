const express = require("express");
var cors = require("cors");
const categories = require("../routes/categories");

module.exports = app => {
  app.use(express.json());
  app.use(cors());
  app.use("/api/categories", categories);
};
