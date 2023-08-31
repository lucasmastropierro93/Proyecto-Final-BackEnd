const { Session } = require("express-session");
const { productModel } = require("../Dao/Mongo/models/product.model");
const { productService } = require("../service/service");
const { generateProducts } = require("../utils/generateProducts");
const { sendMailDeletedProduct } = require("../utils/nodemailer");
const { ProductDto } = require("../dto/product.dto");
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
          const { limit = 5 } = req.query;
          const { page = 1 } = req.query;
          let products = await productModel.paginate(
            {},
            { limit: limit, page: page, lean: true, sort: { price: -1 } }
          );
          const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } =
            products;
      
          res.status(200).send({
            status: "success", payload:
            products, 
            docs,
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
            :res.status(200).send({status: "success",payload: product});
            
        } catch (error) {
          console.log(error);
        }
      }
      
      createProduct = async (req, res, next) => {
        try {
          const {title, description, price, code, stock, category, thumbnail} = req.body

          const user = req.user
          console.log(user);
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
        let newProduct = new ProductDto({title, description, price, code, stock, category, thumbnail, owner}) 
        let product = await productService.createProduct(newProduct)
        !product
        ? res.status(400).send({status:'error', error: "No se pudo crear el producto" })
        : res.status(201).send({status:'success', payload: product})
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
              ? res.status(400).send({ status:'error', error: 'No se ha podido modificar!'  })
              : res.status(200).send({ status: 'success', payload: prod })
        } catch (err) {
          console.log(err);
        }
      }
      deleteProduct = async (req, res) => {
        try {
          const { pid } = req.params
          const user = req.user

            const product = await productService.getProductById(pid)
            if (!product) return res.status(404).send({status:'error', error: `El producto con ID ${pid} no existe` })
            
            if(user && (user.role === 'admin' || (user.role === 'premium' && product.owner === user.email))){
                if(product.owner !== 'admin'){
                    await sendMailDeletedProduct(product)
                }
                const deletedProduct = await productService.deleteProduct(pid)
                if (deletedProduct) {
                    return res.status(200).send({ status:'success', payload: product });
                }
            }
            return res.status(401).send({status:'error', error: "No tienes permiso para eliminar este producto" })
        } catch (error) {
          console.log(error);
        }
        
      }
    
}

module.exports = new ProductController()