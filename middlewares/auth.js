function auth(req, res, next) {
    if(req.session?.user !== 'lucas' || !req.session?.admin){
        return res.status(401).send('Error de autenticación')
    }
    next()
}

module.exports = {
    auth
}
