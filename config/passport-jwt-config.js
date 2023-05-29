const passport = require('passport')
const {Strategy, ExtractJwt} = require('passport-jwt')
const configServer = require('./objectConfig')

const JWTStrategy = Strategy
const extractJWT = ExtractJwt

const cookieExtractor = req =>{
    let token= null
    if(req && req.cookies){
        token = req.cookies['coderCookieToken']
    }
    return token
}

const configStrategy = {
    jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: configServer.jwt_secret_key
}

const initPassport= ()=>{
    passport.use('jwt', new JWTStrategy(configStrategy, async(jwt_payload, done)=>{
        try {
            return done(null, jwt_payload)
        } catch (error) {
            console.log(error)
        }
    }))
}


module.exports = {
    initPassport
}