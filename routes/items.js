const express = require("express");
const {
  createItem,
  readItem,
  readItems,
  updateItem,
  deleteItem,
  deleteItems
} = require("../models/item");
const router = express.Router();

router.post("/", async (req, res) => {
  const { data, status, error } = await createItem(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/:id", async (req, res) => {
  const { data, status, error } = await readItem(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/", async (req, res) => {
  const { data, status, error } = await readItems(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.put("/:id", async (req, res) => {
  const { data, status, error } = await updateItem(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.delete("/:id", async (req, res) => {
  const { data, status, error } = await deleteItem(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.delete("/", async (req, res) => {
  const { data, status, error } = await deleteItems(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

module.exports = router;
