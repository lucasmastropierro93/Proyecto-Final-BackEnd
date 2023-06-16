const { Session } = require("express-session");
const { cartService } = require("../service/service");

class CartController {

    cartGet = async(req, res) => {
        try {
            const cart =  await cartService.getCarts()
        const limit = req.query.limit
        if(!limit) return res.send(cart)
        res.send(prod.slice(0,limit))
        } catch (error) {
            console.log("error en get");
        }
        
    }
    cartGetById = async(req, res) => {
        try {
            const {cid} = req.params
            const cart =  await cartService.getCartstById(cid)
            if(!cart) return res.send({error: 'No se encuentra el carrito'})
            res.send(cart)
        } catch (error) {
            console.log("error en get cid");
        }
       
    }
    cartPost = async(req, res) => {
        try {
            const newCart = {products:[]}
            await cartService.createCart(newCart)
            res.status(201).send({ message: 'Carrito creado correctamente'})
        } catch (error) {
            console.log("error en post");
        }
      
    }
    cartPostByPid = async(req, res) => {
        try {
            const {cid} = req.params
            const {pid} = req.params
            const  {quantity}  = req.body
            let result = await cartService.addToCart(cid,pid,quantity)
           
            res.send({
                status: "succes",
                payload: result
            })
        } catch (error) {
            console.log("error en post2");
        }
      
    }
    cartPutById = async(req, res)=>{
        try{
            const { cid } = req.params
            const {newCart} = req.body
            let respuesta= await cartService.modifyCart(cid, newCart)
            if(!respuesta){
                return res.status(400).send({message:'No se pudo modificar el carrito'})
            }
            res.status(200).send({message: 'Se ha modificado el carrito'})
        }catch(err){
            console.log(err)
        }
    }
    cartPutByPid = async(req, res)=>{
        try{
            const {cid} = req.params
            const {pid} = req.params
            const {quantity} = req.body
            let respuesta = await cartService.modifyProductFromCart(cid, pid, quantity)
            if(!respuesta){
               return res.status(400).send({message:'no se pudo modificar el producto del carrito'})
            }
            res.status(200).send({status:`El producto ID:${pid} se ha modificado`});
        }catch(err){
            console.log(err)
        }
    }
    cartDeleteByPid = async(req, res) =>{
        try {
            const {cid} = req.params
            const {pid} = req.params
        let result = await cartService.deleteProductFromCart(cid,pid)
        res.send({status: "success", payload: `Producto eliminado`})
        } catch (error) {
            console.log("error en delete");
        }
        
    }
    cartClean = async(req, res) =>{
        try {
            const {cid} = req.params
        let result = await cartService.emptyCart(cid)
        res.send({status: "success", payload: `Carrito Id: ${cid} fue vaciado`})
        } catch (error) {
            console.log("error en delete");
        }
        
    }
    cartDelete = async(req, res) =>{
        try {
            const {cid} = req.params
        let result = await cartService.deleteCarts(cid)
        res.send({status: "success", payload: `Carrito Id: ${cid} fue eliminado`})
        } catch (error) {
            console.log("error en delete");
        }
        
    }
}

module.exports = new CartController