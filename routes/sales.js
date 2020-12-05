const express = require("express");
const { createSale, readSales, readSale, updateSale } = require("../models/sale");
const router = express.Router();

router.post("/", async (req, res) => {
  const { data, status, error } = await createSale(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/:id", async (req, res) => {
  const { data, status, error } = await readSale(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/", async (req, res) => {
  const { data, status, error } = await readSales(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.put("/:id", async (req, res) => {
  const { data, status, error } = await updateSale(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

module.exports = router;
