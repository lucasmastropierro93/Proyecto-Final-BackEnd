const CartManagerMongo = require("../Dao/Mongo/cart.mongo")
const ProductManagerMongo = require("../Dao/Mongo/product.mongo")
const UserManagerMongo = require("../Dao/Mongo/user.mongo")
const { ProductDao, CartDao } = require("../Dao/factory")
const ProductRepository = require("../repositories/product.repository")
const CartRepository = require("../repositories/cart.repository")
const ChatManagerMongo = require("../Dao/Mongo/chat.mongo")



const userService = new UserManagerMongo()
const productService = new ProductRepository(new ProductDao())
const cartService = new CartRepository(new CartDao())
const chatService = new ChatManagerMongo()
module.exports= {
    userService,
    productService,
    cartService,
    chatService
}