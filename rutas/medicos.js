var medicos = require('../modelos/medicos');
var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();

var midautentication = require('../middleware/autenticacion');



//traer usuarios
app.get('/',(req,res)=>{
    var body = req.body;
    var desde = req.query.desde || 0;
    desde =  Number(desde);
    medicos.find({},'nombre img  usuario hospital') .limit(5) .skip(desde) .populate('usuario','nombre')  .exec(
        (err,meidicosdb)=>{

            if (err){
                return res.status(500).json({
                    ok:false,
                    message:"error al buscar hospitales"
                })
            }
            if (!meidicosdb){
                return res.status(401).json({
                    ok:false,
                    message:"no se encontraron resultados"
                });
            }
                   
          

                   
           medicos.count({},(err,conteo)=>{

                res.status(200).json({
                    ok:true,
                    conteo,
                    meidicosdb
                });

           });

           });

});


// crear usuarios


app.post('/',midautentication.verificartoken,(req,res)=>{
    var body = req.body;
    var Medico = new medicos();

    Medico.nombre = body.nombre;
    Medico.img = body.img;
    Medico.usuario = req.usuario._id;
    Medico.hospital = req.body.hospital;
    console.log(req.body.hospitals,)
    Medico.save((err,datosguardados)=>{
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
            usuariotoken:req.usuario.nombre,
            aszdsad:req.body.hospitals,
        });
    });


});

    app.put('/:id',(req,res)=>{

    var id = req.params.id
    var actualizar = req.body;
// actualizar proyectosGET

    medicos.findByIdAndUpdate(id,actualizar,(err,datosactualizados)=>{

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

    medicos.findByIdAndRemove(id,(err,datoborrado)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'error al borrar el dato',
        
            });
        }

        if (!datoborrado){
            return res.status(401).json({
                ok:false,
                mensaje:'No se encontro un medico con ese id',
        
            });
        }

        res.status(200).json({
            ok:true,
            datoborrado
        });
        
    })


});




module.exports  = app;