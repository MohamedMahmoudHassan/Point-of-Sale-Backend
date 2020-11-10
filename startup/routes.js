const express = require("express");
const categories = require("../routes/categories");

module.exports = app => {
  app.use(express.json());
  app.use("/api/categories", categories);
};
