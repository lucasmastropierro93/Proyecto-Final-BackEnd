const { productModel } = require("./models/product.model")




class ProductDaoMongo {
    constructor(){
            this.productModel = productModel
    }
    async getProducts(){
        try {
            return await this.productModel.find({}).lean()
        } catch (error) {
            console.log("error en getproducts");
        }
    }
    async getProductById(pid){
        try {
            return await this.productModel.findOne({_id: pid})
        } catch (error) {
            console.log("error en get products by   id");
        }
    }
    async createProduct(newProduct){
        try {
            return await this.productModel.create(newProduct)
        } catch (error) {
            console.log("error en addproducts");
        }
    }
    async updateProduct(pid, obj){
        try {
            return await this.productModel.updateOne({_id: pid}, obj)
        } catch (error) {
           console.log("error en updateProduct");
        }
    }
    async deleteProduct(pid){
        try {
            return await this.productModel.deleteOne({_id: pid})
        } catch (error) {
            console.log("error en deleteProduct");
        }
    }
}
module.exports = ProductDaoMongo