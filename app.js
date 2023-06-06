// IMPORTSSSS
const mongoose = require('mongoose')
const objectConfig = require("../src/config/objectConfig")
const routerIndex = require("./routes/index")
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session")
const FileStore = require("session-file-store")
const {create} = require("connect-mongo")
const { uploader } = require("./utils/utils");
const viewsRouter = require("./routes/views");
const logger = require("morgan")
const app = express();
const ProductManager = require("./Dao/FileSystem/ProductManager");
const productmanagers = require("./Dao/Mongo/product.mongo")
const chatmanager = require("./Dao/Mongo/chat.mongo")
const ObjectId = mongoose.Types.ObjectId

// ----------------------------------------HANDLEBARS-------------------------
const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+ "/views");
app.set("view engine", "handlebars");

// hbs __________________________________________

//----------------------------SOCKET-------------------------------------------------------------------------------------
const { Server } = require("socket.io");


// PASSPORT
const { initPassortGithub } = require("./config/passportConfig");
const { initPassport} = require("./config/passport-jwt-config")
const passport = require("passport");

const httpServer = app.listen(8080, () => {
  console.log("Running on port 8080");
});

const io = new Server(httpServer);



//------------------------------------- APP USE ----------------
app.use(logger('dev'))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(__dirname+'/public'))
//-----------------------------------------------------------------------------------------------
// middleware de terceros

/*app.use(session({
  secret: "secretCoder",
  resave: true,
  saveUninitialized: true

}))*/
app.use(cookieParser('palabrasecreta'));
/*
              CON FILE STORE
const fileStore = FileStore(session)

app.use(session({
  store: new fileStore({
    ttl: 100000*60,
    path: './session',
    retries: 0
  }),
  secret: "secretCoder",
  resave: true,
  saveUninitialized: true

}))*/
/* CON MONGO*/
app.use(session({
  store: create({
    mongoUrl: "mongodb+srv://lucasmastro93:CiIL09iL8xgzBdje@cluster0.dgibp03.mongodb.net/Ecommerce?retryWrites=true&w=majority",
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    ttl: 100000*60,
    
  }),
  secret: "palabrasecreta",
  resave: false,
  saveUninitialized: false

}))


initPassport()
initPassortGithub()
passport.use(passport.initialize())
passport.use(passport.session())

//*************************************************************************************************** */
app.use(routerIndex)

//--------------------------MULTER------------------------------
app.post("/single", uploader.single("myfile"), (req, res) => {
  res.status(200).send({ status: "success" });
});




//---------------------------------------------------------------------------

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Algo salio mal");
});

//-----------------------REALTIMEPRODUCT----------------------------------//
io.on('connection', socket=>{
	console.log("cliente conectado en tiempo real a los productos")
	
	socket.on('deleteProduct', async (pid)=>{
		try{
			const isValidObjectId = ObjectId.isValid(pid.id)
			if (!isValidObjectId) {
			  return socket.emit('newList', {status: "error", message: `El ID del producto es inválido`})
			}
		  
			const product = await productmanagers.getProductById(pid.id)
			if(product) {
			  await productmanagers.deleteProduct(pid.id)
			  const data = await productmanagers.getProducts()
			  return socket.emit('newList', data)
			}
			return socket.emit('newList', {status: "error", message: `El producto con ID ${pid.id} no existe`})
		}catch(err){
			console.log(err)
		}
	})



	
	socket.on('addProducts', async (data) => {
		try {
			await productmanagers.addProducts(data);
			const newData = await productmanagers.getProducts()
			return socket.emit('productAdded', newData)
		} catch (error) {
			return socket.emit('productAdded', { status: 'error', message: `El code: ${data.code} ya existe!`})
		}
    })

})
//-----------------------CHAT    ------------------------------------------------



io.on('connection', socket => {
  console.log('Nuevo cliente conectado al chat  ')
  socket.on('message', async (data) => {
    try {
      await chatmanager.saveMessages(data)
      const messages = await chatmanager.getMessages()
  
      io.emit('messageLogs', messages)
    } catch (error) {
      console.log("error en chat");
    }
    
  })
  socket.on('authenticated', data => {
    socket.broadcast.emit('newUserConnected', data)
})

})


  
// ---------------------------------MONGOOSE----------------------------------------------------------------

objectConfig.connectDB()