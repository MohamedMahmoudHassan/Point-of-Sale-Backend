const express = require("express");
const { sendReceipt } = require("../models/receipt");
const router = express.Router();

router.post("/", async (req, res) => {
  const { data, status, error } = await sendReceipt(req);
  if (error) return res.status(status).send(error);
  res.send(data);
});

module.exports = router;
