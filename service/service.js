const CartManagerMongo = require("../Dao/Mongo/cart.mongo")
const ProductManagerMongo = require("../Dao/Mongo/product.mongo")
const UserManagerMongo = require("../Dao/Mongo/user.mongo")

const userService = new UserManagerMongo()
const productService = new ProductManagerMongo()
const cartService = new CartManagerMongo()
module.exports= {
    userService,
    productService,
    cartService
}