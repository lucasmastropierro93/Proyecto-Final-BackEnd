// IMPORTSSSS
const mongoose = require('mongoose')
const objectConfig = require("./config/objectConfig")
const routerIndex = require("./routes/index")
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session")
const FileStore = require("session-file-store")
const {create} = require("connect-mongo")
const { uploader } = require("./utils/utils");
const viewsRouter = require("./routes/views");
// swagger
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

const logger = require("morgan")
const app = express();
const ProductManager = require("./Dao/FileSystem/ProductDaoFile");
const PORT = process.env.PORT || 8080;
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
const { productService } = require('./service/service');
const { errorHandler } = require('./middlewares/error.middleware');
const { addLogger } = require('./utils/logger');

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
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
app.use(cookieParser(objectConfig.jwt_secret_key));
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
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    ttl: 100000*60,
    
  }),
  secret: objectConfig.jwt_secret_key,
  resave: false,
  saveUninitialized: false

}))


initPassport()
initPassortGithub()
passport.use(passport.initialize())
passport.use(passport.session())

//*************************************************************************************************** */


//--------------------------MULTER------------------------------
app.post("/single", uploader.single("myfile"), (req, res) => {
  res.status(200).send({ status: "success" });
});




//---------------------------------------------------------------------------

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Algo salio mal");
});

// ---------------------------------MONGOOSE----------------------------------------------------------------

objectConfig.connectDB()
//-----------------------REALTIMEPRODUCT----------------------------------//
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


////////////SWAGGER///////////////////////////////////////////////////////
const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentación acerca de mis productos y de mis carritos',
          description: 'Esta es la documentación'
      }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)

app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//////////////////////////////////////////////////////////////////////////


app.use(addLogger)
  
app.use(routerIndex)
/*app.use(errorHandler)*/