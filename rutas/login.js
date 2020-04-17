var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var usuario = require('../modelos/usuario');
var jwt = require('jsonwebtoken');
var semilla = require('../configuracion/semilla').seed;

app.post('/',(req,res)=>{
    var body = req.body;
    console.log(body)
    usuario.findOne({email:body.email},(err,usuarioDB)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                message:'error al encontrar el usuario'
            });

        }
        console.log(usuarioDB);
        if (!usuarioDB)
        
        return res.status(500).json({
            ok:false,
            message:'El el correo no fue encontrado'
        });

        if (!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                message:'La contraseña no fue encontrada'
            });
        }

        var token = jwt.sign({usuario:usuarioDB},semilla,{ expiresIn: 14400})
        
        return res.status(200).json({
            ok:true,
            usuarioDB,
            token:token,
            id:usuarioDB._id
        });

    });

});


module.exports = app;