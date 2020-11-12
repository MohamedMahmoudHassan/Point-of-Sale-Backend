const mongoose = require("mongoose");
const Joi = require("joi");
const { labelSchema, labelValidationSchema } = require("./label");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: labelSchema, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  inStocks: { type: Number, required: true },
  isAvailable: { type: Boolean }
});

const Item = mongoose.model("Item", ItemSchema);

const validateItem = item => {
  const schema = Joi.object({
    label: labelValidationSchema.required(),
    categoryId: Joi.objectId().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    inStocks: Joi.number().required(),
    isAvailable: Joi.boolean()
  });

  return schema.validate(item);
};

const createItem = async ({ body }) => {
  const { error } = validateItem(body);
  if (error) return { status: 400, error: error.details[0].message };

  const { label, categoryId, description, price, inStocks, isAvailable } = body;
  const item = new Item({
    name: label.en,
    label,
    categoryId,
    description,
    price,
    inStocks,
    isAvailable
  });
  await item.save();

  return { data: item };
};

const readItem = async ({ params }) => {
  return { data: await Item.findById(params.id) };
};

const readItems = async () => {
  return { data: await Item.find() };
};

const updateItem = async ({ body, params }) => {
  const { error } = validateItem(body);
  if (error) return { status: 400, error: error.details[0].message };

  const { label, categoryId, description, price, inStocks } = body;
  const item = await Item.findByIdAndUpdate(
    params.id,
    { name: label.en, label, categoryId, description, price, inStocks },
    { new: true }
  );
  if (!item) return { status: 404, error: "The item with the given ID was not found." };

  return { data: item };
};

const deleteItem = async ({ params }) => {
  const item = await Item.findByIdAndRemove(params.id);
  if (!item) return { status: 404, error: "The item with the given ID was not found." };

  return { data: item };
};

const deleteItems = async ({ body }) => {
  const items = await Item.deleteMany({ _id: body.itemsIds });
  if (!items) return { status: 404, error: "The items with the given ID were not found." };

  return { data: items };
};

exports.createItem = createItem;
exports.readItem = readItem;
exports.readItems = readItems;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.deleteItems = deleteItems;