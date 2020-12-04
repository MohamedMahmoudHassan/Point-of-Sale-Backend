const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const { SaleItemSchema, saleItemValidationSchema } = require("./saleItem");

const SaleSchema = new mongoose.Schema({
  items: [{ type: SaleItemSchema, require: true }],
  total: { type: Number, required: true },
  status: { type: String, required: true },
  lastUpdateOn: { type: Date, required: true },
  store: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Store" }
});

const Sale = mongoose.model("Sale", SaleSchema);

const validateSale = sale => {
  const schema = Joi.object({
    items: Joi.array().items(saleItemValidationSchema).required(),
    total: Joi.number().required(),
    status: Joi.string().required(),
    lastUpdateOn: Joi.date().required(),
    store: Joi.objectId().required()
  });

  return schema.validate(sale);
};

const createSale = async ({ body }) => {
  const { error } = validateSale(body);
  if (error) return { status: 400, error: error.details[0].message };

  const sale = new Sale(_.pick(body, ["items", "total", "status", "lastUpdateOn", "store"]));
  await sale.save();

  return { data: sale };
};

const readSale = async ({ params }) => {
  return { data: await Sale.findById(params.id).populate("items.item") };
};

const readSales = async ({ query }) => {
  return { data: await Sale.find({ store: query.store }).populate("items.item") };
};

exports.createSale = createSale;
exports.readSale = readSale;
exports.readSales = readSales;
