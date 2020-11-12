const mongoose = require("mongoose");
const Joi = require("joi");
const { labelSchema, labelValidationSchema } = require("./label");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: labelSchema, required: true }
});

const Category = mongoose.model("Category", CategorySchema);

const validateCategory = category => {
  const schema = Joi.object({
    label: labelValidationSchema.required()
  });

  return schema.validate(category);
};

const createCategory = async ({ body }) => {
  const { error } = validateCategory(body);
  if (error) return { status: 400, error: error.details[0].message };

  const category = new Category({
    name: body.label.en,
    label: body.label
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

  const category = await Category.findByIdAndUpdate(
    params.id,
    { name: body.label.en, label: body.label },
    { new: true }
  );
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