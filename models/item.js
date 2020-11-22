const mongoose = require("mongoose");
const Joi = require("joi");
const { labelSchema, labelValidationSchema } = require("./label");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  label: { type: labelSchema, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  description: { type: String },
  price: { type: Number, required: true },
  inStock: { type: Number, required: true },
  isAvailable: { type: Boolean }
});

const Item = mongoose.model("Item", ItemSchema);

const validateItem = item => {
  const schema = Joi.object({
    label: labelValidationSchema.required(),
    category: Joi.objectId(),
    description: Joi.string(),
    price: Joi.number().required(),
    inStock: Joi.number().required(),
    isAvailable: Joi.boolean()
  });

  return schema.validate(item);
};

const createItem = async ({ body }) => {
  const { error } = validateItem(body);
  if (error) return { status: 400, error: error.details[0].message };

  const itemWithSameName = await Item.findOne({ name: body.label.en });
  if (itemWithSameName) return { status: 400, error: "There is an item with the same name." };

  const { label, category, description, price, inStock, isAvailable } = body;
  const item = new Item({
    name: label.en,
    label,
    category,
    description,
    price,
    inStock,
    isAvailable
  });
  await item.save();

  return { data: item };
};

const readItem = async ({ params }) => {
  return { data: await Item.findById(params.id).populate("category") };
};

const readItems = async () => {
  return { data: await Item.find().populate("category") };
};

const updateItem = async ({ body, params }) => {
  const { error } = validateItem(body);
  if (error) return { status: 400, error: error.details[0].message };

  const { label, category, description, price, inStock } = body;
  const item = await Item.findByIdAndUpdate(
    params.id,
    { name: label.en, label, category, description, price, inStock },
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
