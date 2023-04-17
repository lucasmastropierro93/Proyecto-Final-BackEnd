const productRouter = require("./routes/products");
const cartRouter = require("./routes/carts");
const cookieParser = require("cookie-parser");
const express = require("express");
const { uploader } = require("./utils/utils");
const viewsRouter = require("./routes/views");
const app = express();
const ProductManager = require("./managerDaos/ProductManager");

const productsList = new ProductManager("./data.json");
// hbs __________________________________________
const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// hbs __________________________________________

//SOCKET-------------------------------------------------------------------------------------
const { Server } = require("socket.io");
const { socketProduct } = require("./utils/socketProduct");

const httpServer = app.listen(8080, () => {
  console.log("Running on port 8080");
});

const io = new Server(httpServer);

//-------------------------------------------------------------------------------------
app.use("/", viewsRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(__dirname + "/public"));
// middleware de terceros
app.use(cookieParser());

app.use("/api/productos", productRouter);
app.use("/api/carts", cartRouter);
//multer
app.post("/single", uploader.single("myfile"), (req, res) => {
  res.status(200).send({ status: "success" });
});


socketProduct(io)



app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Algo salio mal    ");
});



app.get("/chat", (req, res) => {
  res.render("chat", {});
});


