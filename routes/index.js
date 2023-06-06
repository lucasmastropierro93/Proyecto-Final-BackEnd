const { Router }= require('express')
const productsRouter= require('./products')
const cartRouter = require('./carts')
const viewsRouter = require('./views')
const sessionRouter= require('./session')
const router= Router()

router.use('/api/productos', productsRouter)

router.use('/', viewsRouter)

router.use('/api/carts', cartRouter)

router.use('/api/session', sessionRouter)

module.exports= router