const { productModel } = require("./models/product.model")




class ProductManagerMongo {
    constructor(){

    }
    async getProducts(){
        try {
            return await productModel.find({}).lean()
        } catch (error) {
            console.log("error en getproducts");
        }
    }
    async getProductById(pid){
        try {
            return await productModel.findOne({_id: pid})
        } catch (error) {
            console.log("error en getproductsbyid");
        }
    }
    async addProducts(newProduct){
        try {
            return await productModel.create(newProduct)
        } catch (error) {
            console.log("error en addproducts");
        }
    }
    async updateProduct(pid, newProduct){
        try {
            return await productModel.updateOne({_id: pid},newProduct)
        } catch (error) {
           console.log("error en updateProduct");
        }
    }
    async deleteProduct(pid){
        try {
            return await productModel.deleteOne({_id: pid})
        } catch (error) {
            console.log("error en deleteProduct");
        }
    }
}
module.exports =  new ProductManagerMongo