const { cartModel } = require("./models/carts.model")

class CartManagerMongo {
    
    async getCarts(){
        try{
            return await cartModel.find({})
        }catch(err){
            return new Error(err)
        }
    }

    async getCartstById(cid){
        try {            
            return await cartModel.findOne({_id: cid})
        } catch (error) {
            return new Error(error)
        }

    }

    async addCart(){
        try {
            let cart = {
                products:   [],
               
            }
            return await cartModel.create({status: 'ok'})
        } catch (error) {
            return new Error(error)
        }
    }   

    async updateCart(cid, pid,quantity){
        try {
            const respUpdate = await cartModel.findOneAndUpdate(
                {_id: cid, 'products.product': pid},
                {$inc: {'products.$.quantity': quantity}},
                {new: true}
            )
            if(respUpdate){

            }
            
            await cartModel.findByIdAndUpdate(
                {_id: cid},
                {$push: {products: {product: pid, quantity}}},
                {new: true, upsert: true}
            )
        } catch (error) {
            return new Error(error)
        }
    }

    async deleteCartById(cid, pid){
        try {
            return await cartModel.findOneAndUpdate(
                {_id: cid},
                {$pull: {products: {product: pid}}},
                {new: true}
            )
        } catch (error) {
            return new Error(error)
        }
    }
    async deleteCart(cid){
        try {
            return await cartModel.findOneAndUpdate(
                {_id: cid},
                {$set: {products: []}},
                {new: true}
            )
        } catch (error) {
            return new Error(error)
        }
    }
    async deleteCarts(cid){
        try {
            return await cartModel.deleteOne(
                {_id: cid}
                
            )
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = new CartManagerMongo