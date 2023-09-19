const { productService } = require("../service/service")

const socketProducts = async (io) =>{

    io.on('connection', socket=>{
        console.log("cliente conectado en tiempo real a los productos")
        
        socket.on('deleteProduct', async (pid)=>{
            try{
                const isValidObjectId = ObjectId.isValid(pid.id)
                if (!isValidObjectId) {
                  return socket.emit('newList', {status: "error", message: `El ID del producto es inválido`})
                }
              
                const product = await productService.getProductById(pid.id)
                if(product) {
                  await productService.deleteProduct(pid.id)
                  const data = await productService.getProducts()
                  return socket.emit('newList', data)
                }
                return socket.emit('newList', {status: "error", message: `El producto con ID ${pid.id} no existe`})
            }catch(err){
                console.log(err)
            }
        })
    
    
    
        
        socket.on('addProducts', async (data) => {
            try {
                await productService.createProduct(data);
                const newData = await productService.getProducts()
                return socket.emit('productAdded', newData)
            } catch (error) {
                return socket.emit('productAdded', { status: 'error', message: `El code: ${data.code} ya existe!`})
            }
        })
    
    })
}
module.exports = {
    socketProducts
};
