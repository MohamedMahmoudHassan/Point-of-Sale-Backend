const mongoose = require("mongoose");
const Joi = require("joi");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

const Category = mongoose.model("Category", CategorySchema);

const validateCategory = category => {
  const schema = Joi.object({
    name: Joi.string().required()
  });

  return schema.validate(category);
};

const isCategoryNameUnique = async (categoryName, categoryId) => {
  const category = await Category.findOne({ name: categoryName });
  return !category || `${category._id}` === categoryId;
};

const createCategory = async ({ body }) => {
  const { error } = validateCategory(body);
  if (error) return { status: 400, error: error.details[0].message };

  if (!await isCategoryNameUnique(body.name))
    return { status: 400, error: "There is a category with the same name." };

  const category = new Category({
    name: body.name
  });
  await category.save();

  return { data: category };
};

const readCategory = async ({ params }) => {
  return { data: await Category.findById(params.id) };
};

const readCategories = async () => {
  return { data: await Category.find() };
};

const updateCategory = async ({ body, params }) => {
  const { error } = validateCategory(body);
  if (error) return { status: 400, error: error.details[0].message };

  if (!await isCategoryNameUnique(body.name, params.id))
    return { status: 400, error: "There is a category with the same name." };

  const category = await Category.findByIdAndUpdate(params.id, { name: body.name }, { new: true });
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
