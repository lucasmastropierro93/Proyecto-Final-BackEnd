const {Router} = require('express')
const { auth } = require('../middlewares/auth')
const configServer = require('../config/objectConfig')
const nodemailer = require('nodemailer')
const { generateProducts } = require('../utils/generateProducts')
const router = Router()

router.get('/loggerTest', async(req, res) =>{
    // req.logger.fatal('alerta fatal')
    // req.logger.error('alerta error')
     req.logger.warning('alerta warning')
    // req.logger.info('alerta info')
     //req.logger.http('alerta http')
    //logger.debug('alerta debug')
     //req.logger.fatal('fatal error')
    
    res.send({message: 'Probando de logger'})

})
router.get("/pruebamock", (req, res)=>{
    try {
        let  products = []
        for (let i = 0; i < 80; i++) {
          products.push(generateProducts())
          
        }
        res.send({status: "success", message: "productos mock creados", payload: products})
    } catch (error) {
        console.log("error");
    }
})

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
/*
const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user: configServer.gmail_user_app,
        pass: configServer.gmail_pass_app
    }
})
router.get('/mail', async (req,res)=>{
    let result =  await transport.sendMail({
        from: 'COMPRA REALIZADA<lucasmastro93@gmail.com>',
        to: 'lucasmastro93@gmail.com', //${body.purchaser}
        subject:'Gracias por realizar la compra',
        html:`<div>
        <h1>Tu compra ha sido completada con exito</h1>
        <p>Codigo:  </p>
        <p>Total:$ </p>
        </div>`
    })
    res.send('Email enviado')
})

router.get('/sms', async (req,res)=>{
    res.send('Email enviado')
})
*/
//////////////////////////////////////////////////SESIONES/////////////////////////////////////












module.exports = router