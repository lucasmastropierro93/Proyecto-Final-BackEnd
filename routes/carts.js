const {Router}= require ('express')
const routerCarts = Router()
//const { CartManager }  = require("../Dao/FileSystem/cartManager.js")
//const carrito = new CartManager()

//const ProductManager = require("../Dao/FileSystem/ProductManager.js");
//const producto = new ProductManager("./data.json")

const cartManager = require("../Dao/Mongo/cart.mongo")
const producto = require("../Dao/Mongo/product.mongo")
//GET
routerCarts.get('/', async(req, res) => {
    try {
        const cart =  await cartManager.getCarts()
    const limit = req.query.limit
    if(!limit) return res.send(cart)
    res.send(prod.slice(0,limit))
    } catch (error) {
        console.log("error en get");
    }
    
})

routerCarts.get('/:cid', async(req, res) => {
    try {
        const {cid} = req.params
        const cart =  await cartManager.getCartstById(cid)
        if(!cart) return res.send({error: 'No se encuentra el carrito'})
        res.send(cart)
    } catch (error) {
        console.log("error en get cid");
    }
   
})

//------------------------------------------------
//POST
routerCarts.post('/', async(req, res) => {
    try {
        //const cart = req.body
        let result = await cartManager.addCart()
        res.send({status: "Sucess", messaje: result})
    } catch (error) {
        console.log("error en post");
    }
  
})
routerCarts.post('/:cid/product/:pid', async(req, res) => {
    try {
        const {cid} = req.params
        const {pid} = req.params
        const  {quantity}  = req.body
        let result = await cartManager.updateCart(cid,pid,quantity)
        res.send({
            status: "succes",
            payload: result
        })
    } catch (error) {
        console.log("error en post2");
    }
  
})

//localhost:8080/carts/:cid/product/:pid
routerCarts.put('/:cid/product/:pid', async(req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        let product = await producto.getProductById(pid)
        //console.log(product)
        if (product !== null) {
            let result = await cartManager.updateCart(cid, pid)
            res.status(200).send({
                status: 'success',
                payload: result})
        }else{
            res.status(400).send({
                status: 'Error',
                payload: "El producto no existe"})
        }
    } catch (error) {
        console.log("error en post dificil");
    }
    
}
)

//------------------------------------------------
//DELETE
routerCarts.delete('/:cid/product/:pid', async(req, res) =>{
    try {
        const {cid} = req.params
        const {pid} = req.params
    let result = await cartManager.deleteCartById(cid,pid)
    res.send({status: "success", payload: `Producto eliminado`})
    } catch (error) {
        console.log("error en delete");
    }
    
})
routerCarts.delete('/:cid', async(req, res) =>{
    try {
        const {cid} = req.params
    let result = await cartManager.deleteCart(cid)
    res.send({status: "success", payload: `Carrito Id: ${cid} fue vaciado`})
    } catch (error) {
        console.log("error en delete");
    }
    
})
routerCarts.delete('/:cid', async(req, res) =>{
    try {
        const {cid} = req.params
    let result = await cartManager.deleteCarts(cid)
    res.send({status: "success", payload: `Carrito Id: ${cid} fue eliminado`})
    } catch (error) {
        console.log("error en delete");
    }
    
})

module.exports = routerCarts