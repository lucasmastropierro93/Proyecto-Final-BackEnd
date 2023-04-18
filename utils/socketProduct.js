const ProductManager = require("../managerDaos/ProductManager")

const productsList = new ProductManager("./data.json")

const socketProduct = async (io) => {
    const products = await productsList.getProducts()
    io.on("connection", socket => {
        console.log("cliente conectado al realtimeproducts");

        
        socket.emit("productos",products )
    })
}
module.exports = {socketProduct}