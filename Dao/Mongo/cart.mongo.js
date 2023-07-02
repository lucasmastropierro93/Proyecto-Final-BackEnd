const { cartModel } = require("./models/carts.model");
const { TicketModel } = require("./models/ticket.model");

class CartDaoMongo {
constructor(){
  this.cartModel = cartModel
}
  async getCarts() {
    try {
      return await this.cartModel.find({});
    } catch (err) {
      return new Error(err);
    }
  }

  async getCartById(cid) {
    try {
      return await this.cartModel.findOne({ _id: cid }).lean();
    } catch (error) {
      return new Error(error);
    }
  }
  async createCart(newCart) {
    try {
      return await this.cartModel.create(newCart);
    } catch (err) {
      return new Error(err);
    }
  }
  async addToCart(cid, pid, quantity) {
    try {
      const respUpdate = await this.cartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
        
      );
      if(respUpdate){
        return respUpdate
    }
    return await this.cartModel.findOneAndUpdate(
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
      return await this.cartModel.findOneAndUpdate(
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
      return await this.cartModel.findOneAndUpdate(
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
      return await this.cartModel.deleteOne({ _id: cid });
    } catch (error) {
      return new Error(error);
    }
  }
  async modifyCart(cid, newCart){
    try{
        return await this.cartModel.findOneAndUpdate(
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
        return await this.cartModel.findOneAndUpdate(
            {_id: cid,"products.product": pid},
            { $set: { "products.$.quantity": quantity } },
            {new:true}
        )
    }catch(err){
        console.log(err)
    }
}
async generateTicket(ticketData){
  try {
      return await TicketModel.create(ticketData);
  } catch (error) {
      console.log(error)
  }
}
}

module.exports = CartDaoMongo;
