const fs = require("fs");

let productos = [];
class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = productos;
  }
  writeFile = async (data) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  };
  getProducts = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      console.log("error en traer la lista de productos");
    }
  };
  addProducts = async (newProduct) => {
    try {
    this.products = await this.getProducts()
      if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.price ||
        !newProduct.thumbnail ||
        !newProduct.code ||
        !newProduct.stock
      ) 
        return "todos los campos son necesarios para agregar prod";

      let validCode = this.products.find(prod => prod.code === newProduct.code);
      if (validCode) return console.log("ya existe un producto con ese code");

      if (this.products.length === 0 ) {
        newProduct.id = 1
        this.products.push(newProduct) 
    } else {
        this.products = [...this.products, {id: this.products[this.products.length - 1].id + 1, ...newProduct , status: true} ]
    }
      

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, "utf-8", "\t")
      );
      return "producto cargado";
    } catch (error) {
      console.log("error");
    }
  };
  getProductById = async (id) => {
    try {
      let product = this.products.find((prod) => prod.id === id);
      if (!product) return "not found";
      return product;
    } catch (error) {
      console.log("error2");
    }
  };

  updateProduct = async (pid, data) => {
    try {
        const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
        const parseProducts = JSON.parse(getFileProducts);
        // console.log(parseProducts);
        if (isNaN(Number(pid))) return { status: "error", message: 'No es un id válido' };

        const findId = parseProducts.findIndex(product => product.id == pid)
        if (findId === -1) return { status: "error", message: 'No se encontró el id' };

        this.products = parseProducts.map(element => {
                if(element.id == pid){
                    element = Object.assign(element, data);
                   return element
                }
                return element
            })

            const toJSON = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
       
  
    } catch (error) {
      console.log("error3");
    }
  };

  deleteProduct = async (id) => {
    try {
      let products = await this.getProducts();
      const obj = products.filter((obj) => obj.id !== id);
      await this.writeFile(obj);

      return "Producto eliminado correctamente";
    } catch (error) {
      console.log("error 4");
    }
  };

  deleteById = async (id) => {
    try {
      let products = await this.getProducts();
      const obj = products.filter((obj) => obj.id !== id);
      await this.writeFile(obj);
      return console.log("removed product");
    } catch (error) {
      console.log(error);
    }
  };
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
module.exports = ProductManager;
