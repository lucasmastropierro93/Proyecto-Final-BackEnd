const { connect } = require("mongoose");
const { cartModel } = require("../Dao/Mongo/models/carts.model");
const { productModel } = require("../Dao/Mongo/models/product.model");
const dotenv = require('dotenv');
const { commander } = require("../utils/commander");
const { MongoSingleton } = require("../utils/singleton");
const { mode } = commander.opts()

dotenv.config({
  path: mode === 'development' ? './.env.development': './.env.production' 
})




module.exports = {
  mode,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  gmail_user_app: process.env.GMAIL_USER,
  gmail_pass_app: process.env.GMAIL_PASS,
  port: process.env.PORT,
  persistence: process.env.PERSISTENCE,
  connectDB: async () => {
    try {
      
      await MongoSingleton.getInstance()
    } catch (error) {
      console.log(error);
    }
  },
 
};
