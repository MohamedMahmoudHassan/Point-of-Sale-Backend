const mongoose = require("mongoose");
const Joi = require("joi");
const { SaleItemSchema, saleItemValidationSchema } = require("./saleItem");

const SaleSchema = new mongoose.Schema({
  items: [{ type: SaleItemSchema, require: true }],
  status: { type: String, required: true },
  lastUpdateOn: { type: Date, required: true },
  store: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Store" }
});

const Sale = mongoose.model("Sale", SaleSchema);

const validateSale = sale => {
  const schema = Joi.object({
    item: Joi.array().items(saleItemValidationSchema).required(),
    status: Joi.string().required(),
    lastUpdateOn: Joi.date().required(),
    store: Joi.objectId().required()
  });

  return schema.validate(sale);
};
