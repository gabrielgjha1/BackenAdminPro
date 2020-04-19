var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var usuario = require('../modelos/usuario');
var jwt = require('jsonwebtoken');
var semilla = require('../configuracion/semilla').seed;

//google

var CLIENT_ID = require('../configuracion/semilla').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

   
   
    return{
        nombre: payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
   

  }

 app.post('/google',async(req,res)=>{
     
    var token = req.body.token;
    let googleUser;
    try {

        googleUser = await verify(token);
    
    } catch (err) {
        console.log(err);
      return res.status(403).json({
        ok: false,
        msg: 'Error while client.verifyIdToken.',
        err
      });
    }

    usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                message:'error al encontrar el usuario'
            });

        }

        if (usuarioDB){
            if (usuario.google===false){
                
                return res.status(400).json({
                    ok:false,
                    message:'Debe usar su autenticacion normal'
                });

            
            }
            else {

                var token = jwt.sign({usuario:usuarioDB},semilla,{ expiresIn: 14400})
        
                return res.status(200).json({
                    ok:true,
                    usuarioDB,
                    token:token,
                    id:usuarioDB._id
                });
        

            }
           

        }
        //el usuario no existe
        else{

            var usuarios = new usuario();
            usuarios.nombre = googleUser.nombre;
            usuarios.email = googleUser.email;
            usuarios.img = googleUser.img;
            usuarios.google = true ;
            usuarios.password = ':)';

            usuarios.save ((err,usuarioDB)=>{

                var token = jwt.sign({usuario:usuarioDB},semilla,{ expiresIn: 14400})
        
                return res.status(200).json({
                    ok:true,
                    usuarioDB,
                    token:token,
                    id:usuarioDB._id
                });

            })

        }

    })

/*
        return res.status(200).json({
            status:true,
            mensaje:"hola",
            gUser:gUser
        });
*/
});

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