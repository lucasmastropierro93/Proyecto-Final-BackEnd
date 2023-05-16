const { Router } = require('express')
//const ProductManager = require("../Dao/FileSystem/ProductManager")
const router = Router()
//const producto = new ProductManager("./data.json")
const producto = require("../Dao/Mongo/product.mongo")
const productModel = require("../Dao/Mongo/models/product.model")
const cartsManager = require("../Dao/Mongo/cart.mongo")


router.get('/', async(req, res) =>{
    try {
      const   payload   =  await producto.getProducts()

      const object = {
        
        title: "Productos",
        products: payload,
    };
  res.render('index', object)
    } catch (error) {
      console.log("error aca");
    }
  
})

router.get('/realtimeproducts', async(req, res) =>{
  try {
    const  payload  =  await producto.getProducts()
    const object = {

      title: "Productos en tiempo real",
      products: payload,
  };
  res.render('realTimeProducts', object)
    
  
  } catch (error) {
   console.log("error"); 
  }
  
})

router.get('/carts/:cid', async(req,res)=>{

  try{
      const {cid} = req.params
      const cart = await cartsManager.getCartstById(cid)
      if(!cart){
          res.status(404).send({ message: `El carrito con ID ${cid} no existe` })
      }else{
          let products= cart.products
          res.status(201).render('cart', {
              products
          })
      }
      
  } catch(err){
      console.log(err)
  }

})

router.get("/chat", (req, res) => {
  res.render("chat", {});
});
module.exports = router
