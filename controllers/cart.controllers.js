const { Session } = require("express-session");
const { cartService, productService } = require("../service/service");
const { v4: uuidv4 } = require("uuid");

class CartController {
  getCarts = async (req, res) => {
    try {
      const carts = await cartService.getCarts();

      res.send(carts);
    } catch (error) {
      console.log("error en get carritosdas");
    }
  };
  getCartById = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);
      if (!cart) {
        res.send({ error: "No se encuentra el carrito" });
      }
      res.send({ status: "success", payload: cart });
    } catch (error) {
      console.log("error en get cid");
    }
  };
  createCart = async (req, res) => {
    try {
      const newCart = { products: [] };
      await cartService.createCart(newCart);
      res.status(201).send({ message: "Carrito creado correctamente" });
    } catch (error) {
      console.log("error en post");
    }
  };
  addToCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;
      const { quantity } = req.body;
      let result = await cartService.addToCart(cid, pid, quantity);

      res.send({
        status: "succes",
        payload: result,
      });
    } catch (error) {
      console.log("error en post2");
    }
  };
  modifyCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { newCart } = req.body;
      let respuesta = await cartService.modifyCart(cid, newCart);
      if (!respuesta) {
        return res
          .status(400)
          .send({ message: "No se pudo modificar el carrito" });
      }
      res.status(200).send({ message: "Se ha modificado el carrito" });
    } catch (err) {
      console.log(err);
    }
  };
  modifyProductFromCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;
      const { quantity } = req.body;
      let respuesta = await cartService.modifyProductFromCart(
        cid,
        pid,
        quantity
      );
      if (!respuesta) {
        return res
          .status(400)
          .send({ message: "no se pudo modificar el producto del carrito" });
      }
      res
        .status(200)
        .send({ status: `El producto ID:${pid} se ha modificado` });
    } catch (err) {
      console.log(err);
    }
  };
  deleteProductFromCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;
      let result = await cartService.deleteProductFromCart(cid, pid);
      res.send({ status: "success", payload: `Producto eliminado` });
    } catch (error) {
      console.log("error en delete");
    }
  };
  emptyCart = async (req, res) => {
    try {
      const { cid } = req.params;
      let result = await cartService.emptyCart(cid);
      res.send({
        status: "success",
        payload: `Carrito Id: ${cid} fue vaciado`,
      });
    } catch (error) {
      console.log("error en delete");
    }
  };
  deleteCarts = async (req, res) => {
    try {
      const { cid } = req.params;
      let result = await cartService.deleteCarts(cid);
      res.send({
        status: "success",
        payload: `Carrito Id: ${cid} fue eliminado`,
      });
    } catch (error) {
      console.log("error en delete");
    }
  };
  generateTicket = async (req, res) => {
    try {
            const { cid } = req.params
            const cart = await cartService.getCartById(cid)
            
            let productsUnavailable = []
            console.log(cart);
            


            for (const item of cart.products) {
              let stock = item.product.stock
              let pid = item.product._id
              if( stock >= item.quantity){
                item.product.stock -= item.quantity
                await productService.updateProduct(pid, item.product)
              } else {
                productsUnavailable.push(item)
              }
            }
            

            const productsAvaible = cart.products.filter(item => !productsUnavailable.some(p => p.product._id === item.product._id))

           console.log(productsAvaible);
           
           if(productsAvaible.length > 0 ){
              const ticket = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: productsAvaible.reduce((total, item) => total + item.quantity * item.product.price, 0),
                purchaser: req.session.email,
              }
              const createdTicket = await cartService.generateTicket(ticket)
              console.log(createdTicket);
            
              if(productsUnavailable.length > 0){
                  return res.send({status:"success", message:"compra realizada parcialmente, existen productos sin stock", ticket: createdTicket,productsUnavailable})
              }else{
                  return res.send({status:"succes", message:"compra realizada exitosamente", ticket: createdTicket})
              }
               
           } else {
            return res.send({status: "error", error: "producto sin stock"})
           }
    } catch (error) {
      console.log("error en generar ticket");
    }
  };
}

module.exports = new CartController();
