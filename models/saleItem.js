const mongoose = require("mongoose");
const Joi = require("joi");

const SaleItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
  quantity: { type: Number, required: true }
});

const saleItemValidationSchema = Joi.object({
  item: Joi.objectId().required(),
  quantity: Joi.number().required()
});

exports.SaleItemSchema = SaleItemSchema;
exports.saleItemValidationSchema = saleItemValidationSchema;
