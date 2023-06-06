const { Schema, model } = require("mongoose");
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
    type: Date,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
});

//userSchema.plugin(mongoosePaginate);

const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
