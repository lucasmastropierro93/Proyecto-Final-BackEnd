const { connect } = require("mongoose");
const { cartModel } = require("../Dao/Mongo/models/carts.model");
const { productModel } = require("../Dao/Mongo/models/product.model");
const dotenv = require('dotenv');
const { commander } = require("../utils/commander");
const { MongoSingleton } = require("../utils/singleton");
const { mode } = commander.opts()
/*
dotenv.config({
  path: mode === 'development' ? './.env.development': './.env.production' 
})
*/

let url =
  "mongodb+srv://lucasmastro93:CiIL09iL8xgzBdje@cluster0.dgibp03.mongodb.net/Ecommerce?retryWrites=true&w=majority";

module.exports = {
  jwt_secret_key: 'palabrasecreta',
  gmail_user_app: process.env.GMAIL_USER,
  gmail_pass_app: process.env.GMAIL_PASS,
  connectDB: async () => {
    try {
      
      await MongoSingleton.getInstance()
    } catch (error) {
      console.log(error);
    }
  },
 
};
