const mongoose = require("mongoose");
const Joi = require("joi");
const { Category } = require("./category");
const { Item } = require("./item");
const AddItemsCounter = require("../Utils/AddItemsCounter");

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

const Store = mongoose.model("Store", StoreSchema);

const validateStore = store => {
  const schema = Joi.object({
    name: Joi.string().required()
  });

  return schema.validate(store);
};

const isStoreNameUnique = async (storeName, storeId) => {
  const store = await Store.findOne({ name: storeName });
  return !store || `${store._id}` === storeId;
};

const createStore = async ({ body }) => {
  const { error } = validateStore(body);
  if (error) return { status: 400, error: error.details[0].message };

  if (!(await isStoreNameUnique(body.name)))
    return { status: 400, error: "There is a store with the same name." };

  const store = new Store({
    name: body.name
  });
  await store.save();

  return { data: store };
};

const readStore = async ({ params }) => {
  return { data: await Store.findById(params.id) };
};

const readStores = async () => {
  const stores = await Store.find().lean();

  const items = await Item.aggregate([{ $group: { _id: "$store", ref: { $sum: 1 } } }]).sort("_id");
  const categories = await Category.aggregate([
    { $group: { _id: "$store", ref: { $sum: 1 } } }
  ]).sort("_id");

  return {
    data: AddItemsCounter(AddItemsCounter(stores, categories, "noOfCategories"), items, "noOfItems")
  };
};

const updateStore = async ({ body, params }) => {
  const { error } = validateStore(body);
  if (error) return { status: 400, error: error.details[0].message };

  if (!(await isStoreNameUnique(body.name, params.id)))
    return { status: 400, error: "There is a store with the same name." };

  const store = await Store.findByIdAndUpdate(params.id, { name: body.name }, { new: true });
  if (!store) return { status: 404, error: "The store with the given ID was not found." };

  return { data: store };
};

const deleteStore = async ({ params }) => {
  const store = await Store.findByIdAndRemove(params.id);
  if (!store) return { status: 404, error: "The store with the given ID was not found." };

  return { data: store };
};

const deleteStores = async ({ body }) => {
  const stores = await Store.deleteMany({ _id: body.storesIds });
  if (!stores) return { status: 404, error: "The stores with the given ID were not found." };

  return { data: stores };
};

exports.createStore = createStore;
exports.readStore = readStore;
exports.readStores = readStores;
exports.updateStore = updateStore;
exports.deleteStore = deleteStore;
exports.deleteStores = deleteStores;
