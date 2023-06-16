const { Session } = require("express-session");
const { productModel } = require("../Dao/Mongo/models/product.model");
const { productService } = require("../service/service");

class ProductController {

    productGet = async (req, res) => {
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
      
          /*
          const products = await productManager.getProducts();
          const limit = req.query.limit;
        // http://localhost:8080/api/productos/?limit=4 ESTO ES PARA PONER LIMITE
      
      
          limit
            ? res.send({ status: "succes", products: products.slice(0, limit) })
            : res.send({ status: "success", products: products });
           */
        } catch (error) {
          console.log(error);
        }
      }
      productGetById =  async (req, res) => {
        try {
          const { pid } = req.params;
          const product = await productService.getProductById(pid);
          Object.keys(product).length === 0 // si el obj esta vacio
            ? res.status(404).send({ error: "No existe el producto" })
            : res.send(product);
        } catch (error) {
          console.log(error);
        }
      }
      productPost = async (req, res) => {
        try {
          let productSend = req.body;
          const addedProduct = await productService.addProducts(productSend);
      
          Object.keys(addedProduct).length === 0
          ? res.status(400).send({ error: "No se pudo agregar el producto" })
          : res.status(201).send({status:'producto agregado', payload: addedProduct})
        } catch (error) {
          return { status: "error", error };
        }
      }
      productPutById =  async (req, res) => {
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
      productDeleteById = async (req, res) => {
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

module.exports = new ProductController