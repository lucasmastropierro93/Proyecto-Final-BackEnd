const bcrypt = require('bcrypt')

// crear el hash - se usa en register
exports.createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// generar la funcón para comparar - se usa en login
exports.isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)
