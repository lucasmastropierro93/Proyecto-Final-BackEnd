const nodemailer = require('nodemailer')
const configServer = require('../config/objectConfig')

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "fa407663d8feb2",
      pass: "2d6d33b350aebe"
    }
})

exports.sendMail = async (body)=>{
    return await transport.sendMail({
        from: 'COMPRA REALIZADA<lucasmastro93@gmail.com>',
        to: 'lucasmastro93@gmail.com', //${body.purchaser}
        subject:'Gracias por realizar la compra',
        html:`<div>
        <h1>Tu compra ha sido completada con exito</h1>
        <p>Usuario:${body.purchaser}</p> 
        <p>Codigo:${body.code} </p>
        <p>Total: ${body.amount}</p>
        </div>`
    })
}
exports.sendResetPassMail = async (user,resetLink)=>{
    return await transport.sendMail({
        from: 'COMPRA REALIZADA<lucasmastro93@gmail.com>',
        to: 'lucasmastro93@gmail.com', //${user.email}
        subject:'reset password',
        html:`<div>
        <h1>Hola ${user.first_name},</h1>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Para continuar con el proceso, haz clic en el siguiente enlace:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>El enlace expirará después de 1 hora.</p>
        </div>`
    })
}
exports.sendMailDeletedUser = async (user)=>{
    return await transport.sendMail({
        from: 'USUARIO ELMINADO POR INACTIVIDAD <lucasmastro93@gmail.com>',
        to: user.email ,
        subject:'usuario eliminado por inactividad',
        html:`<div>
        <h1>Tu usuario ha sido eliminado debido al periodo de inactividad!</h1>
        <p>Le comunicamos al usuario  ${user.first_name} que su cuenta ha sido eliminada debido al periodo de inactividad</p>
        </div>`
    })
}