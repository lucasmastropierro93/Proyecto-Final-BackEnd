const { Router } = require("express");
const { auth } = require("../middlewares/auth");
const { userModel } = require("../Dao/Mongo/models/user.model");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");
const { passportCall } = require("../config/passportCall");
const { authorization } = require("../config/authorizationjwtRole");

const router = Router();

////////////////////////////////////////////////////////GET SESSIONS////////////////////////////////////

router.get("/counter", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`se ha visitado el sitio ${req.session.counter} veces.`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido");
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ status: "error", error: err });
    }
    res.send("logout ok");
  });
});
router.get("/privada", auth, (req, res) => {
  res.send("Todo lo que esta acá solo lo puede ver un admin loagueado");
});
/*
router.get('/failregister', async (req,res)=>{
  console.log('Falló la estrategia')
  res.send({status: 'error', error: 'falló autenticación'})
})
router.get('/faillogin', async (req,res)=>{
  console.log('Falló la estrategia')
  res.send({status: 'error', error: 'falló autenticación'})
})
*/
///////////////////////////////////////////POST SESSIONS//////////////////////////////////////////////////
/*
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (!email || !password) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "El email y la contraseña son obligatorios",
        });
    }
    let role = "user";
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      role = "admin";
    }

    const userDB = await userModel.findOne({ email, password });
    if (!userDB)
      return res
        .status(404)
        .send({ status: "error", message: "usuario inexistente" });

    // validar password
    if (!isValidPassword(password, userDB))
      return res.status(401).send({
        status: "error",
        message: "El usuario o la contraseña no es la correcta",
      });

    req.session.user = {
      first_name: userDB.first_name,
      last_name: userDB.last_name,
      email: userDB.email,
      role: role,
    };

    res.redirect("/");
    console.log(userDB);
  } catch (error) {
    console.log("error en login");
  }
});
*/
/*
router.post("/register", async (req, res) => {
  try {
    const{username, first_name, last_name, email, password} = req.body
    const existUser= await userModel.findOne({email})
    if(existUser) return res.send({status: 'error', message:'el email ya existe'})

    const newUser={
        username,
        first_name,
        last_name,
        email,
        password: createHash(password) //encriptar
    }

    await userModel.create(newUser)


    res.status(200).send('Usuario creado exitosamente')
  } catch (error) {
    console.log("error en registro");
  }
});
*/
// login
/*
router.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), async (req,res) => { 
  if (!req.user) return res.status(401).send({status: 'error', message: 'invalid credencial'})
  req.session.user= {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email
  }
  res.send({status: 'success', message: 'User registered'})
})


router.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}), async (req,res) => {    
  res.send({status: 'success', message: 'User registered'})
})
*/

router.post("/restaurarpass", async (req, res) => {
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
  res
    .status(200)
    .json({
      status: "success",
      message: "Contraseña actualizada correctamente",
    });
});




///////////////////////////////////////////////////////////////////////CON GITHUB////////////////////////////////////////////


router.get('/github', passport.authenticate('github', {scope: ['user:email']}), ()=>{})
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res)=>{
    req.session.user = req.user
    res.redirect('/api/productos')
})

router.post('/login', async(req, res)=>{
  let {email, password} = req.body
  email = email.trim();
  password = password.trim();
  if (!email || !password) {
      return res.status(400).send({ status: 'error', message: 'El email y la contraseña son obligatorios' });
  }

  const userDB = await userModel.findOne({email})
  if(!userDB) return res.status(404).send({status: 'error', message: 'usuario incorrecto'})

  if(!isValidPassword(password, userDB)) return res.status(401).send({status:'error', message:'contraseña incorrecta'})

  req.session.user ={
      first_name: userDB.first_name,
      last_name: userDB.last_name,
      email: userDB.email,
      date_of_birth: userDB.date_of_birth,
      username: userDB.username,
      role: 'user'
  }

  const accessToken = generateToken({
      first_name: userDB.first_name,
      last_name: userDB.last_name,
      email: userDB.email,
      date_of_birth: userDB.date_of_birth,
      username: userDB.username,
      role: 'user'
  })

  res
  .cookie('coderCookieToken', accessToken, {
      maxAge: 60*60*100,
      httpOnly: true
  }).redirect('/')
})



router.post('/register',async(req,res)=>{ 
  const{username, first_name, last_name, email, date_of_birth, password} = req.body
  const existUser= await userModel.findOne({email})
  if(existUser) return res.send({status: 'error', message:'el email ya existe'})

  const newUser={
      username,
      first_name,
      last_name,
      email,
      date_of_birth,
      username,
      password : createHash(password)
  }

  await userModel.create(newUser)
  const accessToken = generateToken({
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      date_of_birth: newUser.date_of_birth,
      username: newUser.username,
      role: 'user'
  })

  res
  .cookie('coderCookieToken', accessToken, {
      maxAge: 60*60*100,
      httpOnly: true
  }).send({
      status:'success',
      message: 'register success',
  })
  
})

router.get('/current', passportCall('jwt', {session: false}), authorization('user') ,(req,res)=>{
  res.send(req.user)
})
module.exports = router;
