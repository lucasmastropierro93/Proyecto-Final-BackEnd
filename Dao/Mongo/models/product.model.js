const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const collection = "products";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: String,
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
});

productSchema.plugin(mongoosePaginate);
const productModel = model(collection, productSchema);

module.exports = {
  productModel,
};
