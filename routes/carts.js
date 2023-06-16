const {Router}= require ('express')
const routerCarts = Router()
//const { CartManager }  = require("../Dao/FileSystem/cartManager.js")
//const carrito = new CartManager()

//const ProductManager = require("../Dao/FileSystem/ProductManager.js");
//const producto = new ProductManager("./data.json")

const cartManager = require("../Dao/Mongo/cart.mongo")
const producto = require("../Dao/Mongo/product.mongo")
const cartControllers = require('../controllers/cart.controllers')
//GET
routerCarts.get('/', cartControllers.cartGet)

routerCarts.get('/:cid', cartControllers.cartGetById)

routerCarts.post('/', cartControllers.cartPost)

routerCarts.post('/:cid/product/:pid', cartControllers.cartPostByPid)

routerCarts.put('/:cid',cartControllers.cartPutById )


routerCarts.put('/:cid/product/:pid', cartControllers.cartPutByPid)

routerCarts.delete('/:cid/product/:pid', cartControllers.cartDeleteByPid)

routerCarts.delete('/:cid', cartControllers.cartClean)

routerCarts.delete('/carrito/:cid', cartControllers.cartDelete)

module.exports = routerCarts