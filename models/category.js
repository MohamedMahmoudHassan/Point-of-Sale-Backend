const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  store: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Store" }
});

CategorySchema.index({ name: 1, store: 1 }, { unique: true });

const Category = mongoose.model("Category", CategorySchema);

const validateCategory = category => {
  const schema = Joi.object({
    name: Joi.string().required(),
    store: Joi.objectId().required()
  });

  return schema.validate(category);
};

const isCategoryNameUnique = async ({ _id, name, store }) => {
  const category = await Category.findOne({ name, store });
  return !category || `${category._id}` === _id;
};

const createCategory = async ({ body }) => {
  const { error } = validateCategory(body);
  if (error) return { status: 400, error: error.details[0].message };

  if (!await isCategoryNameUnique(_.pick(body, ["name", "store"])))
    return { status: 400, error: "There is a category with the same name." };

  const category = new Category(_.pick(body, ["name", "store"]));
  await category.save();

  return { data: category };
};

const readCategory = async ({ params }) => {
  return { data: await Category.findById(params.id) };
};

const readCategories = async ({ query }) => {
  return { data: await Category.find({ store: query.store }) };
};

const updateCategory = async ({ body, params }) => {
  const { error } = validateCategory(body);
  if (error) return { status: 400, error: error.details[0].message };

  if (!await isCategoryNameUnique({ ..._.pick(body, ["name", "store"]), _id: params.id }))
    return { status: 400, error: "There is a category with the same name." };

  const category = await Category.findByIdAndUpdate(params.id, _.pick(body, ["name", "store"]), {
    new: true
  });
  if (!category) return { status: 404, error: "The category with the given ID was not found." };

  return { data: category };
};

const deleteCategory = async ({ params }) => {
  const category = await Category.findByIdAndRemove(params.id);
  if (!category) return { status: 404, error: "The category with the given ID was not found." };

  return { data: category };
};

const deleteCategories = async ({ body }) => {
  const categories = await Category.deleteMany({ _id: body.categoriesIds });
  if (!categories)
    return { status: 404, error: "The categories with the given ID were not found." };

  return { data: categories };
};

exports.createCategory = createCategory;
exports.readCategory = readCategory;
exports.readCategories = readCategories;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.deleteCategories = deleteCategories;
