const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        let uploadFolder = '';

        if (file.fieldname === 'uploads') {
            let uploadType = req.body.uploadType
            if(uploadType === 'profile'){
                uploadFolder = 'profiles'
            }
            else if (uploadType === 'product') {
                uploadFolder = 'products'
            }
            else if (uploadType === 'document') {
                uploadFolder = 'documents'
            }
        }
        cb(null, `${__dirname}/../public/${uploadFolder}`)
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    } 
})

const uploader = multer({
    storage,
    onError: function(err, next){
        console.log(err)
        next()
    }
})


module.exports = {
    uploader
}