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
        const newCart = {products:[]}
        await cartManager.createCart(newCart)
        res.status(201).send({ message: 'Carrito creado correctamente'})
    } catch (error) {
        console.log("error en post");
    }
  
})


routerCarts.post('/:cid/product/:pid', async(req, res) => {
    try {
        const {cid} = req.params
        const {pid} = req.params
        const  {quantity}  = req.body
        let result = await cartManager.addToCart(cid,pid,quantity)
       
        res.send({
            status: "succes",
            payload: result
        })
    } catch (error) {
        console.log("error en post2");
    }
  
})

//PUT------------------------------------------------------------------------------------

routerCarts.put('/:cid', async(req, res)=>{
    try{
        const { cid } = req.params
        const {newCart} = req.body
        let respuesta= await cartManager.modifyCart(cid, newCart)
        if(!respuesta){
            return res.status(400).send({message:'No se pudo modificar el carrito'})
        }
        res.status(200).send({message: 'Se ha modificado el carrito'})
    }catch(err){
        console.log(err)
    }
})


routerCarts.put('/:cid/product/:pid', async(req, res)=>{
    try{
        const {cid} = req.params
        const {pid} = req.params
        const {quantity} = req.body
        let respuesta = await cartManager.modifyProductFromCart(cid, pid, quantity)
        if(!respuesta){
           return res.status(400).send({message:'no se pudo modificar el producto del carrito'})
        }
        res.status(200).send({status:`El producto ID:${pid} se ha modificado`});
    }catch(err){
        console.log(err)
    }
})

//------------------------------------------------
//DELETE
routerCarts.delete('/:cid/product/:pid', async(req, res) =>{
    try {
        const {cid} = req.params
        const {pid} = req.params
    let result = await cartManager.deleteProductFromCart(cid,pid)
    res.send({status: "success", payload: `Producto eliminado`})
    } catch (error) {
        console.log("error en delete");
    }
    
})
routerCarts.delete('/:cid', async(req, res) =>{
    try {
        const {cid} = req.params
    let result = await cartManager.emptyCart(cid)
    res.send({status: "success", payload: `Carrito Id: ${cid} fue vaciado`})
    } catch (error) {
        console.log("error en delete");
    }
    
})
routerCarts.delete('/carrito/:cid', async(req, res) =>{
    try {
        const {cid} = req.params
    let result = await cartManager.deleteCarts(cid)
    res.send({status: "success", payload: `Carrito Id: ${cid} fue eliminado`})
    } catch (error) {
        console.log("error en delete");
    }
    
})

module.exports = routerCarts