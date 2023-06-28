
class CartRepository {
    constructor(dao) {
        this.dao = dao
    }
    getCarts(){
        return this.dao.getCarts()
    }
    getCartById(cid){
        return this.dao.getCartById()
    }
    createCart(newCart){
        return this.dao.createCart(newCart)
    }
    addToCart(cid,pid,quantity){
        return this.dao.addToCart(cid,pid,quantity)
    }
    modifyCart(cid,newCart){
        return this.dao.modifyCart(cid,newCart)
    }
    modifyProductFromCart(cid,pid,quantity){
        return this.dao.modifyProductFromCart(cid,pid,quantity)
    }
    deleteProductFromCart(cid,pid){
        return this.dao.deleteProductFromCart(cid,pid)
    }
    emptyCart(cid){
        return this.dao.emptyCart(cid)
    }
    deleteCarts(cid){
        return this.dao.deleteCarts(cid)
    }
}
module.exports = CartRepository