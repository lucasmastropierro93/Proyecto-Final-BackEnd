const { cartModel } = require("./models/carts.model");

class CartManagerMongo {
  async getCarts() {
    try {
      return await cartModel.find({});
    } catch (err) {
      return new Error(err);
    }
  }

  async getCartstById(cid) {
    try {
      return await cartModel.findOne({ _id: cid }).lean();
    } catch (error) {
      return new Error(error);
    }
  }
  async createCart(newCart) {
    try {
      return await cartModel.create(newCart);
    } catch (err) {
      return new Error(err);
    }
  }
  async addToCart(cid, pid, quantity) {
    try {
      const respUpdate = await cartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
        
      );
      if(respUpdate){
        return respUpdate
    }
    return await cartModel.findOneAndUpdate(
        {_id: cid},
        { $push: { products: { product: pid, quantity} } },
        {new:true, upsert:true}
    )
    } catch (error) {
      return new Error(error);
    }
  }


  async deleteProductFromCart   (cid, pid) {
    try {
      return await cartModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
      );
    } catch (error) {
      return new Error(error);
    }
  }
  async emptyCart(cid) {
    try {
      return await cartModel.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] } },
        { new: true }
      );
    } catch (error) {
      return new Error(error);
    }
  }
  async deleteCarts(cid) {
    try {
      return await cartModel.deleteOne({ _id: cid });
    } catch (error) {
      return new Error(error);
    }
  }
  async modifyCart(cid, newCart){
    try{
        return await cartModel.findOneAndUpdate(
            {_id:cid},
            {$set: {products: newCart}},
            {new:true}
        )
    }catch(err){
        console.log(err)
    }
}
async modifyProductFromCart(cid, pid, quantity){
    try{
        return await cartModel.findOneAndUpdate(
            {_id: cid,"products.product": pid},
            { $set: { "products.$.quantity": quantity } },
            {new:true}
        )
    }catch(err){
        console.log(err)
    }
}
}

module.exports = CartManagerMongo;
