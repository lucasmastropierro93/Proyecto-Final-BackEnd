const { Router } = require('express')
//const ProductManager = require("../Dao/FileSystem/ProductManager")
const router = Router()
//const producto = new ProductManager("./data.json")

const productModel = require("../Dao/Mongo/models/product.model")

const userList = require("../Dao/Mongo/user.mongo")
const { userModel } = require('../Dao/Mongo/models/user.model')
const passport = require("passport");
const { productService, cartService } = require('../service/service')


router.get('/', async(req, res) =>{
    try {
     let user = req.session.user
      const   payload   =  await productService.getProducts()
      
      const object = {
        
        title: "Productos",
        products: payload,
        user
    };
  res.render('index', object)
    } catch (error) {
      console.log("error aca");
    }
  
})

router.get('/realtimeproducts', async(req, res) =>{
  try {
    const  payload  =  await productService.getProducts()
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
      const cart = await cartService.getCartstById(cid)
      if(!cart){
          res.status(404).send({ message: `El carrito con ID ${cid} no existe` })
      }else{
          let products= cart.products
          res.status(201).render('cart', {
              products,
              id: cart._id
          })
      }
      
  } catch(err){
      console.log(err)
  }

})

router.get("/chat", (req, res) => {
  res.render("chat", {});
});
router.get('/login', (req, res) => {
  res.render('login', {
  })
})
router.get('/register', (req, res) => {
  res.render('registerForm', {
      
  })
})

module.exports = router
