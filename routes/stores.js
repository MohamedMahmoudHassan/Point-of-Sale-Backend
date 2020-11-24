const express = require("express");
const {
  createStore,
  readStore,
  readStores,
  updateStore,
  deleteStore,
  deleteStores
} = require("../models/store");
const router = express.Router();

router.post("/", async (req, res) => {
  const { data, status, error } = await createStore(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/:id", async (req, res) => {
  const { data, status, error } = await readStore(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/", async (req, res) => {
  const { data, status, error } = await readStores();
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.put("/:id", async (req, res) => {
  const { data, status, error } = await updateStore(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.delete("/:id", async (req, res) => {
  const { data, status, error } = await deleteStore(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.delete("/", async (req, res) => {
  const { data, status, error } = await deleteStores(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

module.exports = router;
