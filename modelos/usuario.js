var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;


var usuarioSchema = new schema ({

    nombre: {type:String, required:[true,'El nombre es necesario']},
    email: {type:String,unique:true, required:[true,'El correo es necesario']},
    password: {type:String},
    img: {type:String, required:[false]},
    role: { type:String , required: true , default:'USER_ROLE' },
    google: {type:Boolean,default:false}

});

usuarioSchema.plugin(uniqueValidator,{message:'El email  debe ser unico'})

module.exports = mongoose.model('Usuario',usuarioSchema);