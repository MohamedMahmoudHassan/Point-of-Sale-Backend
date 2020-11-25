const express = require("express");
const { upload, createImage } = require("../models/static");
const router = express.Router();

router.post("/", upload, (req, res) => {
  const { data, status, error } = createImage(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

module.exports = router;
