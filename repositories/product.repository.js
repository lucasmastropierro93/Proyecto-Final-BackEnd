class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    

    getProducts(){
        return this.dao.getProducts()
    }
    getProductById(pid){
        return this.dao.getProductById(pid)
    }
    createProduct(newProduct){
        return this.dao.createProduct(newProduct)
    }
    deleteProduct(pid){
        return this.dao.deleteProduct(pid)
    }
    updateProduct(pid, obj){
        return this.dao.updateProduct(pid, obj)
    }
    
}

module.exports = ProductRepository