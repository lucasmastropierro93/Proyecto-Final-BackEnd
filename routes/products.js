const { Router } = require("express");

const productManager = require("../Dao/Mongo/product.mongo");
const { productModel } = require("../Dao/Mongo/models/product.model");
const productController = require("../controllers/product.controllers");
const { passportCall } = require("../config/passportCall");
const { authorization } = require("../config/authorizationJwtRole");
const router = Router();

//const productManager = new ProductManager("./data.json");

router.get("/mockingproducts", productController.generateProductsMock)
router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/",passportCall('jwt',{session:false}),authorization(['admin','premium']),productController.createProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", passportCall('jwt',{session:false}),authorization(['admin','premium']),productController.deleteProduct);

module.exports = router;
