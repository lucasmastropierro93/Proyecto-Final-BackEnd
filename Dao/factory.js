const { connectDB } = require('../config/objectConfig.js');

let ProductDao
let CartDao

switch ('MONGO') {
    case 'MONGO':
        //coneccion
        connectDB()
        const ProductDaoMongo = require ('./Mongo/product.mongo.js')
        const CartDaoMongo = require ('./Mongo/cart.mongo.js')
        ProductDao = ProductDaoMongo
        CartDao = CartDaoMongo
        break;
        
    case 'FILE':
        const ProductDaoFile = require ('./FileSystem/ProductDaoFile.js')
        ProductDao = ProductDaoFile
    
        break;

    case 'MEMORY':
        const ProductDaoMemory = require ('./Memory/product.memory.js')
        ProductDao = ProductDaoMemory
    
        break;

    default:
        break;
}

module.exports = {
    ProductDao,
    CartDao
}