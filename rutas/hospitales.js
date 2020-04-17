var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var usuario = require('../modelos/hospitales');
var midautentication = require('../middleware/autenticacion');
var semilla = require('../configuracion/semilla').seed;

//traer usuarios
app.get('/',(req,res)=>{
    var desde = req.query.desde || 0;
    desde =  Number(desde);
   
    usuario.find({},'nombre  usuario')  .limit(5) .skip(desde) .exec(
        (err,hospitalesdb)=>{

            if (err){
                return res.status(500).json({
                    ok:false,
                    message:"error al buscar hospitales"
                })
            }
            if (!hospitalesdb){
                return res.status(401).json({
                    ok:false,
                    message:"no se encontraron resultados"
                });
            }

                    
            usuario.count({},(err,conteo)=>{

                res.status(200).json({
                    ok:true,
                    conteo,
                    hospitalesdb
                });

        });

          
   
           });
});


// crear usuarios


app.post('/',midautentication.verificartoken,(req,res)=>{
    var body = req.body;
    var Usuario = new usuario();

    Usuario.nombre = body.nombre;
    Usuario.img = body.img;
    Usuario.usuario = req.usuario;

   
    Usuario.save((err,datosguardados)=>{
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
            usuariotoken:req.usuario.nombre
        });
    });


});

    app.put('/:id',(req,res)=>{

    var id = req.params.id
    var actualizar = req.body;
// actualizar proyectosGET
    usuario.findByIdAndUpdate(id,actualizar,(err,datosactualizados)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                message:'Erro al actualizar actualizados',
                error:err
            });
        }
        
        res.status(200).json({
            ok:true,
            datosactualizados
        });

    });

  
});


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
                mensaje:'No se encontro un hospital con ese id',
        
            });
        }

        res.status(200).json({
            ok:true,
            datoborrado
        });
        
    })


});







module.exports  = app;