const { Session } = require("express-session");
const { userModel } = require("../Dao/Mongo/models/user.model");
const {
  generateToken,
  verifyResetToken,
  generateResetToken,
} = require("../utils/jwt");
const { createHash, isValidPassword } = require("../utils/bcryptHash");

const { userService, cartService } = require("../service/service");
const { sendResetPassMail } = require("../utils/nodemailer");
const { UserDto } = require("../dto/user.dto");

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

    const userDB = await userService.getUserByEmail(email);
    if (!userDB)
      return res
        .status(404)
        .send({ status: "error", message: "usuario incorrecto" });

    if (!isValidPassword(password, userDB))
      return res
        .status(401)
        .send({ status: "error", message: "contraseña incorrecta" });

    const currentDate =
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    await userService.updateUser(userDB._id, currentDate);

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
      cart: userDB.cart,
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

    if (!username.trim()) {
      return res.send({ message: "El username es requerido" });
    }
    if (!email) {
      return res.send({ message: "el email es requerido" });
    }
    if (!password || password.length < 6) {
      return res.send({
        message: "la contraseña debe tener 6 o mas caracteres",
      });
    }

    const existUser = await userService.getUser({ email });
    if (existUser) {
      return res
        .status(400)
        .send({ status: "error", error: "el email ya existe" });
    }

    const newCart = { products: [] };
    const cart = await cartService.createCart(newCart);
    let role = "user";

    if (email === "premium@premium.com") {
      role = "premium";
    }

    const newUser = {
      username,
      first_name,
      last_name,
      email,
      date_of_birth: new Date(date_of_birth).toLocaleDateString(),
      username,
      password: createHash(password),
      role: role,
      cart: cart._id,
    };

    await userService.createUser(newUser);
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
      .status(302)
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 100,
        httpOnly: true,
      })
      .redirect("/login");
  };
  logout = async (req, res) => {
    try {
      const userDB = await userService.getUser({
        email: req.session.user.email,
      });
      if (userDB) {
        const currentDate =
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString();
        await userService.updateUser(userDB._id, currentDate);
      }
      req.session.destroy((err) => {
        if (err) {
          return res.send({ status: "error", error: err });
        } else {
          res.clearCookie("coderCookieToken");
          res.redirect("/login");
        }
      });
    } catch (error) {
      console.log("error en logout");
    }
  };
  restorePass = async (req, res) => {
    const { email, password } = req.body;

    // Encontrar el usuario por correo electrónico
    const userDB = await userModel.findOne({ email });

    if (!userDB) {
      // Si el usuario no existe, redireccionar a una página de error
      return res
        .status(401)
        .send({ status: "error", message: "El usuario no existe" });
    }

    //Hasear Actualizar la contraseña del usuario
    userDB.password = createHash(password);
    await userDB.save();

    // Redireccionar al usuario a la página de login
    res.status(200).json({
      status: "success",
      message: "Contraseña actualizada correctamente",
    });
  };
  changeRole = async (req, res) => {
    try {
      const userId = req.params.uid;
      const userDB = await userService.getUserById(userId);
      if (!userDB)
        return res
          .status(404)
          .send({ status: "error", error: "Usuario inexistente" });

      const newRole = userDB.role === "user" ? "premium" : "user";
      userDB.role = newRole;
      await userDB.save();

      res
        .status(200)
        .send({
          status: "success",
          message: "Rol de usuario actualizado exitosamente",
          role: newRole,
        });
    } catch (error) {
      console.log("error en cambiar rol");
    }
  };
  resetPassword = async (req, res) => {
    try {
      const { password } = req.body;
      const { token } = req.query;
      const verifiedToken = verifyResetToken(token);
      if (!verifiedToken) {
        return res
          .status(400)
          .send({
            status: "error",
            message:
              "El enlace de recuperación de contraseña es inválido o ha expirado",
          });
      }

      const userDB = await userService.getUser({
        email: verifiedToken.userDB.email,
      });
      if (!userDB)
        return res
          .status(404)
          .send({ status: "error", message: "Usuario inexistente" });

      if (isValidPassword(password, userDB)) {
        return res
          .status(400)
          .send({
            status: "error",
            message: "La contraseña debe ser distinta a la anterior",
          });
      }

      userDB.password = createHash(password);
      await userDB.save();

      res.send({
        status: "success",
        message:
          "La contraseña ha sido reemplazada con exito, vuelve a iniciar sesion",
      });
    } catch (error) {
      console.log("error en resetpassword");
    }
  };
  forgotpassword = async (req, res) => {
    try {
      let { email } = req.body;
      if (!email)
        return res
          .status(400)
          .send({ status: "error", message: "El email es obligatorio" });

      const userDB = await userService.getUser({ email });
      if (!userDB)
        return res
          .status(404)
          .send({ status: "error", message: "Usuario inexistente" });

      const resetToken = generateResetToken({ userDB });
      const resetLink = `${req.protocol}://${req.get(
        "host"
      )}/resetPassword?token=${resetToken}`;

      await sendResetPassMail(userDB, resetLink);
      res.send({
        status: "success",
        message: "se ha enviado el link para resetear tu pass",
      });
    } catch (error) {
      console.log("error en forgot");
    }
  };
  getAllUsers = async (req, res) => {
    try {
      const allUsers = await userService.getAllUsers();
      if (!allUsers || allUsers.length === 0) {
        return res
          .status(500)
          .send({ status: "error", error: "no hay usuarios para mostrar" });
      }

      const response = allUsers.map((user) => new UserDto(user));
      res.status(200).send({ status: "success", payload: response });
    } catch (error) {
      console.log("error en get de users");
    }
  };
    deleteUsers = async (req, res) => {
    try {
      const allUsers = await userService.getAllUsers();
      if (!allUsers || allUsers.length === 0) {
        return res
          .status(500)
          .send({ status: "error", error: "no hay usuarios" });
      }

      const response = allUsers.map((user) => new UserDto(user));
      res.status(200).send({ status: "success", payload: response });
    } catch (error) {
      console.log("error en delete user");
    }
  };
}

module.exports = new SessionController();
