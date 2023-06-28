const mongoose = require('mongoose')
const dotenv = require('dotenv');
class MongoSingleton {
    static #instance 
    constructor(){
        
        mongoose.connect("mongodb+srv://lucasmastro93:CiIL09iL8xgzBdje@cluster0.dgibp03.mongodb.net/Ecommerce?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    static getInstance(){
        if (this.#instance) {
            console.log('Base de datos ya está creada')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('Base de dato creada')
        return this.#instance
    }
}

module.exports = {
    MongoSingleton
}
