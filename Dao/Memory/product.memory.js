class ProductDaoMemory{
    constructor(){
        this.products= []
    }

    getProducts = async () => {
        try {
          return this.products;
        } catch (err) {
          console.log(err);
        }
    };

    getProductsById = (pid) =>{
        const product = this.products.find(product=>product.id === pid)
        return product? product : console.log('Not Found')
    }

    createProduct = (title, description, price, thumbnail, code, stock)=>{
        const product = { title, description, price, thumbnail, code, stock , id: ++this.lastId,}
        const existingCode = this.products.find((product) => product.code === code)

        if(existingCode){
            console.log("ya existe un producto con ese codigo")
        }
        else if(!title || !description || !code || !thumbnail || !price || !stock){
            console.log("Todos los campos son obligatorios!")
        }else{
            this.products.push(product)
        }
    }

    deleteProduct = (pid) =>{
        
    }

    updateProduct = (pid, obj) => {

    }

}

module.exports = ProductDaoMemory