const { Router } = require("express");

const productManager = require("../Dao/Mongo/product.mongo");
const { productModel } = require("../Dao/Mongo/models/product.model");
const productController = require("../controllers/product.controllers");
const router = Router();

//const productManager = new ProductManager("./data.json");

router.get("/mockingproducts", productController.generateProductsMock)
router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

module.exports = router;
