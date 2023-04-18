const { Router } = require("express");
const ProductManager = require("../managerDaos/ProductManager");
const router = Router();

const productManager = new ProductManager("./data.json");
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const limit = req.query.limit;
  


    limit
      ? res.send({ status: "succes", products: products.slice(0, limit) })
      : res.send({ status: "success", products: products });
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const params = Number(req.params.id);
    const product = await productManager.getProductById(params);
    if(isNaN(params)) return console.log("no es un numero el valor ingresado");
    res.send(product);
  } catch (error) {
    console.log(error);
  }
});
router.post("/", async (req, res) => {
  try {
    let productSend = req.body;
    const addedProduct = await productManager.addProducts(productSend);

    res.send({ status: "Sucess", product: addedProduct });
  } catch (error) {
    return { status: "error", error };
  }
});
router.put("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const prod = req.body;
    await productManager.updateProduct(pid, prod);
    res.send(productManager);
  } catch (err) {
    console.log(err);
  }
});
router.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  res.send({
    status: "Success",
    message: await productManager.deleteProduct(pid),
  });
});
module.exports = router;
