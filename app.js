const productRouter = require("./routes/products");
const cartRouter = require("./routes/carts")
const cookieParser = require("cookie-parser");
const express = require("express");
const { uploader } = require("./utils/utils");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
// middleware de terceros
app.use(cookieParser());

app.use("/api/productos", productRouter);
app.use("/api/carts", cartRouter);
//multer
app.post("/single", uploader.single("myfile"), (req, res) => {
  res.status(200).send({ status: "success" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Algo salio mal    ");
});

app.listen(8080, () => {
  console.log("Running on port 8080");
});
