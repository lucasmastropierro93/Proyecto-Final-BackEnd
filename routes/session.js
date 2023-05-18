const { Router } = require("express");
const { auth } = require("../middlewares/auth");
const { userModel } = require("../Dao/Mongo/models/user.model");

const router = Router();


////////////////////////////////////////////////////////GET SESSIONS////////////////////////////////////

router.get("/counter", (req,res)=>{
  if (req.session.counter) {
      req.session.counter ++
      res.send(`se ha visitado el sitio ${req.session.counter} veces.`)
  } else {
      req.session.counter = 1
      res.send('Bienvenido')
  }

})
router.get('/logout', (req, res)=>{
  req.session.destroy(err=>{
      if (err) {
          return res.send({status: 'error', error: err})
      }
      res.send('logout ok')
  })
})
router.get('/privada', auth, (req,res) => {

  res.send('Todo lo que esta acá solo lo puede ver un admin loagueado')
})

///////////////////////////////////////////POST SESSIONS//////////////////////////////////////////////////
router.post('/login', async (req, res)=> {
  try {
    let {email, password} = req.body
    email = email.trim();
    password = password.trim();
    if (!email || !password) {
      return res.status(400).send({ status: 'error', message: 'El email y la contraseña son obligatorios' });   
  }
  let role = 'user';
  if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    role = 'admin';
  }

  const userDB = await userModel.findOne({email, password})
  if(!userDB) return res.status(404).send({status: 'error', message: 'usuario inexistente'})

  req.session.user ={
      first_name: userDB.first_name,
      last_name: userDB.last_name,
      email: userDB.email,
      role: role
  }

  res.redirect('/')
  console.log(userDB)
  
  } catch (error) {
    console.log("error en login");
  }
  
})
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
        password
    }

    await userModel.create(newUser)


    res.status(200).send('Usuario creado exitosamente')
  } catch (error) {
    console.log("error en registro");
  }
});
module.exports = router;
