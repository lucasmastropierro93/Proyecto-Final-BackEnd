const { Router } = require("express");
const { auth } = require("../middlewares/auth");
const { userModel } = require("../Dao/Mongo/models/user.model");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");
const { passportCall } = require("../config/passportCall");
const { authorization } = require("../config/authorizationJwtRole.js");
const userManager = require("../Dao/Mongo/user.mongo");
const sessionControllers = require("../controllers/session.controllers");

const router = Router();



router.get("/privada", auth, (req, res) => {
  res.send("Todo lo que esta acá solo lo puede ver un admin loagueado");
});

router.post("/restaurarpass", sessionControllers.restorePass);

///////////////////////////////////////////////////////////////////////CON GITHUB////////////////////////////////////////////

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/api/session/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/login", sessionControllers.login);

router.post("/register", sessionControllers.register);

////////////////////////////// entrar con usuario adminCoder@code.com/////////////////////////////////////
router.get("/current", passportCall("jwt", { session: false }), authorization("user"),(req, res) => {
    res.send(req.user);
  }
);
router.get("/logout", sessionControllers.logout);
module.exports = router;
