const { Session } = require("express-session");
const { productModel } = require("../Dao/Mongo/models/product.model");
const { productService } = require("../service/service");
const { generateProducts } = require("../utils/generateProducts");

class ProductController {
    generateProductsMock = async (req,res) => {
      try {
        let  products = []
        for (let i = 0; i < 80; i++) {
          products.push(generateProducts())
          
        }
        res.send({status: "success", message: "productos mock creados", payload: products})
      } catch (error) {
        console.log("error en generar productos mock");
      }
    }
    getProducts = async (req, res) => {
        try {
          const { limit = 10 } = req.query;
          const { page = 1 } = req.query;
          let products = await productModel.paginate(
            {},
            { limit: limit, page: page, lean: true, sort: { price: -1 } }
          );
          const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } =
            products;
      
          res.send({
            status: "success",
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
          });
    
         
        } catch (error) {
          console.log(error);
        }
      }
      
      getProductById =  async (req, res) => {
        try {
          const { pid } = req.params;
          const product = await productService.getProductById(pid);
          !product
            ?res.status(404).send({ error: 'No existe el producto' })
            :res.send(product);
            
        } catch (error) {
          console.log(error);
        }
      }
      
      createProduct = async (req, res, next) => {
        try {
          const {title, description, price, code, stock, category, thumbnail} = req.body

          const user = req.session.user
          if(!title || !description || !price || !code || !stock || !category){
            CustomError.createError({
                name: 'Product creation error',
                cause: createProductErrorInfo({
                    title, 
                    description, 
                    price, 
                    code, 
                    stock, 
                    category
                }),
                message: 'Error trying to create product',
                code: Error.INVALID_TYPE_ERROR
            })
        }

        let owner = 'admin'
        if(user && user.role === 'premium'){
            owner = user.email
        }
          let productSend = ({title, description, price, code, stock, category, thumbnail, owner}) 
          const addedProduct = await productService.createProduct(productSend);
      
          Object.keys(addedProduct).length === 0
          ? res.status(400).send({ error: "No se pudo agregar el producto" })
          : res.status(201).send({status:'producto agregado', payload: addedProduct})
        } catch (error) {
          next(error)
        }
      }
      updateProduct =  async (req, res) => {
        try {
          const { pid } = req.params;
          const  prod  = req.body;
          const result = await productService.updateProduct(pid, prod);
          Object.keys(result).length === 0
              ? res.status(400).send({ error: 'No se ha podido modificar!' })
              : res.status(200).send({ status: `el producto se ha modificado con exito!`, payload: prod })
        } catch (err) {
          console.log(err);
        }
      }
      deleteProduct = async (req, res) => {
        try {
          const { pid } = req.params;
        const deletedProduct = await productService.deleteProduct(pid)
        Object.keys(deletedProduct).length === 0
        ? res.status(404).send({error: `El producto no existe`})
        : res.status(200).send({ status:`El producto se ha eliminado`, payload: deletedProduct});
        } catch (error) {
          console.log(error);
        }
        
      }
    
}

module.exports = new ProductController()