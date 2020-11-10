const express = require("express");
const {
  createCategory,
  readCategories,
  updateCategory,
  deleteCategory
} = require("../models/category");
const router = express.Router();

router.post("/", async (req, res) => {
  const { data, status, error } = await createCategory(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/", async (req, res) => {
  const { data, status, error } = await readCategories();
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.put("/:id", async (req, res) => {
  const { data, status, error } = await updateCategory(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.delete("/:id", async (req, res) => {
  const { data, status, error } = await deleteCategory(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

module.exports = router;
