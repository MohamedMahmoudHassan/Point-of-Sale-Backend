const express = require("express");
const { upload, createImage, getImage, deleteImage } = require("../models/static");
const router = express.Router();

router.post("/", upload, (req, res) => {
  const { data, status, error } = createImage(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/:name", (req, res) => {
  const { data, status, error } = getImage(req);
  if (error) return res.status(status).send(error);
  res.sendFile(data.imagePath);
});

router.delete("/:name", (req, res) => {
  const { data, status, error } = deleteImage(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

module.exports = router;
