var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var semilla = require('../configuracion/semilla').seed;
var jwt = require('jsonwebtoken');
var usuario = require('../modelos/usuario');

var midautentication = require('../middleware/autenticacion');

/// OPtenero todos los usuarios 

app.get('/',(req,res)=>{
    var desde = req.query.desde || 0;
    desde =  Number(desde);
    usuario.find({},'nombre email img role').limit(5) .skip(desde) .exec(
        
        (err,usuarios)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                message:'error en la base de datos',
                error:err
            });
        }

                
        usuario.count({},(err,conteo)=>{
        
            res.status(200).json({
                ok:true,
                conteo,
                usuarios
            });

       });

       

    });

});






//Actualizar datos 

app.put('/:id',(req,res)=>{

    var id = req.params.id;
    var body = req.body;
    var usuarios = new usuario();
    
    

    usuario.findById(id,(err,usuario)=>{

        if (err){
           return res.status(500).json({
                ok:false,
                message:'error al buscar el dato'
            });
        }

        if (!usuario){

           return res.status(500).json({
                ok:false,
                message:'El usuario con el id'+id+'no existe',
                error:{message:'no existe un usuario con ese id'}
            });

        }

        usuarios.nombre = body.nombre;
        usuarios.email = body.email;
        usuarios.role = body.role;

        console.log(usuarios.role);

        usuarios.save((err,datosactualizados)=>{

            if (err){
                return res.status(500).json({
                    ok:false,
                    message:'Erro al actualizar actualizados',
                    error:err
                });
            }
            datosactualizados.password=":)"
            res.status(200).json({
                ok:true,
                datosactualizados
            });



        });



    });
        


})





//guardar datos
app.post('/',midautentication.verificartoken,(req,res)=>{

    var body = req.body;
    var usuarios = new usuario();
    usuarios.nombre = body.nombre;
    usuarios.email = body.email;
    usuarios.password = bcrypt.hashSync(body.password, 10);
    usuarios.img = body.img;
    usuario.role = body.role;

    usuarios.save((err,datosguardados)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                message:'Error al fuardar los datos',
                error:err
            });
        }

        res.status(200).json({
            ok:true,
            datosguardados,
            usuariotoken:req.usuario
        });
    })


});




//eliminar un usario
app.delete('/:id',(req,res)=>{
    var id = req.params.id;

    usuario.findByIdAndRemove(id,(err,datoborrado)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'error al borrar el dato',
        
            });
        }

        if (!datoborrado){
            return res.status(401).json({
                ok:false,
                mensaje:'No se encontro un usuario con ese id',
        
            });
        }

        res.status(200).json({
            ok:true,
            datoborrado
        });
        

    
    });




});



module.exports  = app;