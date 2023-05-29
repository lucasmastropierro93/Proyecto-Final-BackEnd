// IMPORTSSSS
const objectConfig = require("../src/config/objectConfig")
const productRouter = require("./routes/products");
const cartRouter = require("./routes/carts");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session")
const FileStore = require("session-file-store")
const {create} = require("connect-mongo")
const { uploader } = require("./utils/utils");
const viewsRouter = require("./routes/views");
const userRouter = require("./routes/users")
const pruebasRouter = require("./routes/pruebas")
const sessionRouter = require("./routes/session")
const logger = require("morgan")
const app = express();
const ProductManager = require("./Dao/FileSystem/ProductManager");

const productsList = new ProductManager("./data.json");
// ----------------------------------------HANDLEBARS-------------------------
const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+ "/views");
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
// hbs __________________________________________

//----------------------------SOCKET-------------------------------------------------------------------------------------
const { Server } = require("socket.io");
const { socketProduct } = require("./utils/socketProduct");

// PASSPORT
const { initPassortGithub } = require("./config/passportConfig");
const { initPassport} = require("./config/passport-jwt-config")
const passport = require("passport");

const httpServer = app.listen(8080, () => {
  console.log("Running on port 8080");
});

const io = new Server(httpServer);


socketProduct(io)
//------------------------------------- APP USE ----------------
app.use(logger('dev'))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(__dirname + "/public"));

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
    ttl: 1000,
    
  }),
  secret: "secretCoder",
  resave: false,
  saveUninitialized: false

}))


initPassport()
initPassortGithub()
passport.use(passport.initialize())
passport.use(passport.session())

//*************************************************************************************************** */
app.use('/api/usuarios',  userRouter)
app.use("/api/productos", productRouter);
app.use("/api/carritos", cartRouter);
app.use("/pruebas", pruebasRouter);
app.use("/api/session", sessionRouter)
//--------------------------MULTER------------------------------
app.post("/single", uploader.single("myfile"), (req, res) => {
  res.status(200).send({ status: "success" });
});




//---------------------------------------------------------------------------

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Algo salio mal");
});


//-----------------------CHAT    ------------------------------------------------

let  messages = []

io.on('connection', socket => {
  console.log('Nuevo cliente conectado al chat  ')
  socket.on('message', data => {
       //console.log(data)
      messages.push(data)
      io.emit('messageLogs', messages)
  })
  socket.on('authenticated', data => {
    socket.broadcast.emit('newUserConnected', data)
})

})


  
// ---------------------------------MONGOOSE----------------------------------------------------------------

objectConfig.connectDB()