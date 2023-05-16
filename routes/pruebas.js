const {Router} = require('express')
const { auth } = require('../middlewares/auth')

const router = Router()


router.get("/setCookie", (req,res)=>{
    res.cookie('CoderCookie', 'Esta es una cookie muy poderosa', {maxAge: 10000000}).send('cookie setada')
})
//router.get("/getCookie", (req,res)=>{
  //  res.send(req.cookies)
//})
router.get('/deleteCookie', (req, res)=>{
    res.clearCookie('CoderCookie').send('cookie removed')
})


/////////////////////////////////COOKIE FIRMADA ///////////////////////////

router.get('/setSignedCookie', (req, res)=> {
    res.cookie('SignedCookie', 'Esta es una cookie muy poderosa', {maxAge: 10000000, signed: true}).send('cookie setada')
})
router.get("/getCookie", (req,res)=>{
    res.send(req.signedCookies)
})


///////////////////////////////////login   DESAFIO CLASE 1 /////////////////////////////////

router.get("/",(req,res)=>{

    res.render("login",{})
})
router.post("/getcookieuser",(req,res)=>{

    const {username, email} = req.body

    res.cookie(username, email, {maxAge: 1000000,signed: true}).send({mensaje: "seteado"})
})




//////////////////////////////////////////////////SESIONES/////////////////////////////////////

router.get("/session", (req,res)=>{
    if (req.session.counter) {
        req.session.counter ++
        res.send(`se ha visitado el sitio ${req.session.counter} veces.`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido')
    }

})
router.post('/session', (req, res)=> {
    const {username, password} = req.body
    if (username!=='lucas' || password!== 'lucas123') {
        return res.send('login failed')
    }

    req.session.user = username
    req.session.admin = true
    console.log(req.session)
    res.send('login success')
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







module.exports = router