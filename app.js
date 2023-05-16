// IMPORTSSSS
const objectConfig = require("../src/config/objectConfig")
const productRouter = require("./routes/products");
const cartRouter = require("./routes/carts");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session")
const { uploader } = require("./utils/utils");
const viewsRouter = require("./routes/views");
const userRouter = require("./routes/users")
const pruebasRouter = require("./routes/pruebas")
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
// middleware de terceros
app.use(session({
  secret: "secretCoder",
  resave: true,
  saveUninitialized: true

}))
app.use(cookieParser('P@l@br@S3CR3T@'));
app.use('/api/usuarios',  userRouter)
app.use("/api/productos", productRouter);
app.use("/api/carritos", cartRouter);
app.use("/pruebas", pruebasRouter);
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