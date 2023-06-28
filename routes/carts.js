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
routerCarts.get('/', cartControllers.getCarts)

routerCarts.get('/:cid', cartControllers.getCartById)

routerCarts.post('/', cartControllers.createCart)

routerCarts.post('/:cid/product/:pid', cartControllers.addToCart)

routerCarts.put('/:cid',cartControllers.modifyCart )


routerCarts.put('/:cid/product/:pid', cartControllers.modifyProductFromCart)

routerCarts.delete('/:cid/product/:pid', cartControllers.deleteProductFromCart)

routerCarts.delete('/:cid', cartControllers.emptyCart)

routerCarts.delete('/carrito/:cid', cartControllers.deleteCarts)

module.exports = routerCarts