const { connect } = require("mongoose");
const { cartModel } = require("../Dao/Mongo/models/carts.model");
const { productModel } = require("../Dao/Mongo/models/product.model");

let url =
  "mongodb+srv://lucasmastro93:CiIL09iL8xgzBdje@cluster0.dgibp03.mongodb.net/Ecommerce?retryWrites=true&w=majority";

module.exports = {
  connectDB: async () => {
    try {
      connect(url);
      console.log("Base de datos conectada MONGO");
      /*
            let carrito = await cartModel.create({
                products:[]
            })
            const cart = await cartModel.findById({_id: '645948bfd732f85887a2b9dd'})
            cart.products.push({product: '64593704019cf36217eb2bb7'})
            let resp = await cartModel.findByIdAndUpdate({_id: '645948bfd732f85887a2b9dd'}, cart)
            console.log(cart);*/

      //const cart = await cartModel.findOne({_id: '645948bfd732f85887a2b9dd'})

      //console.log(JSON.stringify(cart,null, "\t"));
/*
      const result = await productModel.aggregate([
        {
          $limit: 10,
        },
        {
            $sort: {price: -1}
        }
      ]);
      console.log(result);
      */
    } catch (error) {
      console.log(error);
    }
  },
};
