const { Schema, model, SchemaType } = require("mongoose");
//const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "users";

const userSchema = new Schema({
  first_name: {
    type: String,
    index: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: [
    {
      name: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
        required: true,
      },
      _id: false
    },
  ],
  last_connection: {
    type: Date,
  },
});

//userSchema.plugin(mongoosePaginate);

const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
