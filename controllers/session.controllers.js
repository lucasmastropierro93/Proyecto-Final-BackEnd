const { Session } = require("express-session");
const { userModel } = require("../Dao/Mongo/models/user.model");
const { generateToken } = require("../utils/jwt");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const cartmanager = require("../Dao/Mongo/cart.mongo")

class SessionController {
  login = async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (!email || !password) {
      return res.status(400).send({
        status: "error",
        message: "El email y la contraseña son obligatorios",
      });
    }

    const userDB = await userModel.findOne({ email });
    if (!userDB)
      return res
        .status(404)
        .send({ status: "error", message: "usuario incorrecto" });

    if (!isValidPassword(password, userDB))
      return res
        .status(401)
        .send({ status: "error", message: "contraseña incorrecta" });

    req.session.user = {
      first_name: userDB.first_name,
      last_name: userDB.last_name,
      email: userDB.email,
      date_of_birth: userDB.date_of_birth,
      username: userDB.username,
      role: userDB.role,
      cart: userDB.cart,
    };

    const accessToken = generateToken({
      first_name: userDB.first_name,
      last_name: userDB.last_name,
      email: userDB.email,
      date_of_birth: userDB.date_of_birth,
      username: userDB.username,
      role: userDB.role,
    });

    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 100,
        httpOnly: true,
      })
      .redirect("/");
    console.log(req.session.user);
  };

  register = async (req, res) => {
    const { username, first_name, last_name, email, date_of_birth, password } =
      req.body;
    const existUser = await userModel.findOne({ email });
    if (existUser) return res.send({ status: "error", message: "el email ya existe" });

    const newCart = {products:[]}
    const cart = await cartmanager.createCart(newCart)
    let role = userModel.schema.path('role').default()
    const newUser = {
      username,
      first_name,
      last_name,
      email,
      date_of_birth,
      username,
      password: createHash(password),
      role: role,
      cart: cart._id,
    };

    await userModel.create(newUser);
    const accessToken = generateToken({
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      date_of_birth: newUser.date_of_birth,
      username: newUser.username,
      role: newUser.role,
      cart: newUser.cart,
    });

    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 100,
        httpOnly: true,
      })
      .redirect("/login");
  };
  logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.send({ status: "error", error: err });
      } else {
        res.redirect("/login");
      }
    });
  };
}

module.exports = new SessionController();
