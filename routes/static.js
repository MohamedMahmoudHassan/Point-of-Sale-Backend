const express = require("express");
const { upload, createImage, getImage, deleteImage } = require("../models/static");
const router = express.Router();

router.post("/", upload, (req, res) => {
  const { data, status, error } = createImage(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

router.get("/:name", async (req, res) => {
  const { data, status, error } = await getImage(req);
  if (error) return res.status(status).send(error);
  data.readStream.pipe(res);
});

router.delete("/:name", (req, res) => {
  const { data, status, error } = deleteImage(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

module.exports = router;
