const {Router}= require ('express')
const routerCarts = Router()



const cartControllers = require('../controllers/cart.controllers')
const { passportCall } = require('../config/passportCall')
const { authorization } = require('../config/authorizationJwtRole')
//GET
routerCarts.get('/', cartControllers.getCarts)

routerCarts.get('/:cid', cartControllers.getCartById)

routerCarts.post('/', cartControllers.createCart)

routerCarts.post('/:cid/product/:pid', passportCall('jwt', {session:false}), authorization('user'), cartControllers.addToCart)

routerCarts.post('/:cid/purchase', cartControllers.generateTicket)

routerCarts.put('/:cid',cartControllers.modifyCart )


routerCarts.put('/:cid/product/:pid', cartControllers.modifyProductFromCart)

routerCarts.delete('/:cid/product/:pid', cartControllers.deleteProductFromCart)

routerCarts.delete('/:cid', cartControllers.emptyCart)

routerCarts.delete('/carrito/:cid', cartControllers.deleteCarts)



module.exports = routerCarts