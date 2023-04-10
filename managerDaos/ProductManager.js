const fs = require("fs")


let productos = []
class ProductManager {
    constructor(filePath) {

        this.path = filePath
        this.products = productos
    }

    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8")
            this.products = JSON.parse(data)
            return this.products
        } catch (error) {
            console.log("error en traer la lista de productos");
        }

    }
    addProducts = async (title, description, price, thumbnail, code, stock) => {
        try {
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) return "todos los campos son necesarios"

            let validCode = this.products.find(prod => prod.code === product.code)
            if (validCode) return console.log('ya existe un producto con ese code')



            this.products.push({ id: this.products.length + 1, ...product })

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, 'utf-8', '\t'))
            return "producto cargado"
        } catch (error) {
            console.log("error");
        }

    }
    getProductById = async (id) => {
        try {

            let product = this.products.find(prod => prod.id === id)
            if (!product) return 'not found'
            return product


        } catch (error) {
            console.log("error2");
        }
    }


    updateProduct = async (id, ProductoActualizar) => {
        try {
            let product = this.products.find(prod => prod.id === id)
            if (!product) return 'not found'
            product.title = ProductoActualizar.title
            product.description = ProductoActualizar.description
            product.price = ProductoActualizar.price
            product.thumbnail = ProductoActualizar.thumbnail
            product.code = ProductoActualizar.code
            product.stock = ProductoActualizar.stock

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, "utf-8", "\t"))
            return "Se actualizo un producto"

        } catch (error) {
            console.log("error3");
        }
    }


    deleteProduct = async (id) => {
        try {
            const eliminar = this.products.find(prod => prod.id == id)
            if (!eliminar) return "No se encontro el producto a eliminar"
            console.log(eliminar);
            await fs.promises.writeFile(this.path, JSON.stringify(eliminar, "utf-8", "\t"))
            return "Producto eliminado correctamente"
        } catch (error) {
            console.log("error 4");
        }
    }




}



const product = new ProductManager("./Productos.json");
/*
const fileUse = async () => {
    console.log(await product.addProducts('Producto prueba', 'Este es un producto de prueba', 200, 'sin imagen', 001, 25))
    console.log(await product.addProducts('Producto prueba2', 'probando id incrementable', 200, 'sin imagen', 002, 25))
    console.log(await product.addProducts('Producto prueba3', 'probando id incrementable', 200, 'sin imagen', 003, 25))
    console.log(await product.addProducts('Producto prueba4', 'probando id incrementable', 200, 'sin imagen', 004, 25))
    console.log("mostrar todos los productos", await product.getProducts());
    //console.log("mostrar productos con id:2", product.getProductById(2));
   // console.log(await product.getProductById(10));
   // console.log(await product.updateProduct(2, { title: 'Producto actualizado', description: 'se actualizo un prod', price: 200, thumbnail: 'sin imagen', code: 002, stock: 25 }));
   // console.log(await product.deleteProduct(4));


}

fileUse()
*/
module.exports = ProductManager