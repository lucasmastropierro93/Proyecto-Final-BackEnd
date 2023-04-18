const { Router } = require('express')
const ProductManager = require("../managerDaos/ProductManager")
const router = Router()
const producto = new ProductManager("./data.json")

router.get('/', async(req, res) =>{
    
  const prodList =  await producto.getProducts()

  let datosProd = {
      listaProductos: prodList
  }
  res.render('index', datosProd)
})

router.get('/realtimeproducts', async(req, res) =>{
  
  const prodList =  await producto.getProducts()

  let datosProd = {
      listaProductosLive: prodList
  }
  res.render('realTimeProducts', datosProd)
})



router.get("/chat", (req, res) => {
  res.render("chat", {});
});
module.exports = router
