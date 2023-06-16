const { Router } = require("express");

const productManager = require("../Dao/Mongo/product.mongo");
const { productModel } = require("../Dao/Mongo/models/product.model");
const productController = require("../controllers/product.controllers");
const router = Router();

//const productManager = new ProductManager("./data.json");
router.get("/", productController.productGet);
router.get("/:pid", productController.productGetById);
router.post("/", productController.productPost);
router.put("/:pid", productController.productPutById);
router.delete("/:pid", productController.productDeleteById);

module.exports = router;
