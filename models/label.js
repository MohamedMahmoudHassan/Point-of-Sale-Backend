const mongoose = require("mongoose");
const Joi = require("joi");

const labelSchema = new mongoose.Schema({
  en: {
    type: String,
    required: true
  },
  ar: {
    type: String
  }
});

const labelValidationSchema = Joi.object({
  en: Joi.string().required(),
  ar: Joi.string()
});

exports.labelSchema = labelSchema;
exports.labelValidationSchema = labelValidationSchema;
