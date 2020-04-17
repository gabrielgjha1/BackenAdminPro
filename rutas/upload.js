
var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var usuario = require('../modelos/usuario');
var medicos = require('../modelos/medicos');
var hospitales = require('../modelos/hospitales');
var fs = require('fs');
// default options
app.use(fileUpload());

app.put('/:tipo/:id',(req,res,nex)=>{
    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['hospitales','medicos','usuarios'];
    if (tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            mensaje:'tipo de coleccion no es valida',
            errors:{message:'tipo de coleccion no es valida'}
        })
    }


    if (!req.files){

  
    return res.status(500).json({
        ok:false,
        mensaje:'No se selecciono nada',
        errors:{message:'debe seleccionar una ibaen'}
    })
}

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.')
    var expensionArchivo = nombreCortado[nombreCortado.length-1];

    //Solo estas extensiones aceptamos
    var extensionesValidas = ['png','jpg','gif','jpeg'];

    if (extensionesValidas.indexOf(expensionArchivo)<0){
       return res.status(200).json({
            ok:true,
            mensaje:'Extension no valida',
            errors:{message:'LAs extensiones validas son' + extensionesValidas.join(', ')}
        })
    }

    // noombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${expensionArchivo}`;

    //mover el archivo del temporal a un path
    var path=`./uploads/${ tipo }/${ nombreArchivo }`;
    console.log(path)
    archivo.mv(path,err=>{

        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'error al mover el archo',
                errors:err
            })
        }

       subirPorTipo(tipo,id,nombreArchivo,res);
        
        

 })

});


function subirPorTipo(tipo,id,nombreArchivo,res){
    if (tipo==='usuarios'){

        usuario.findById(id,(err,usuarios)=>{
            if(!usuarios){
                return res.status(500).json({
                    ok:false,
                      message:"el usuario no exiszte"
                    })
            }
           var pathviejo= './uploads/usuarios/'+usuarios.img
           console.log(pathviejo);

           if (fs.existsSync(pathviejo)){
               
               fs.unlinkSync(pathviejo);
           } 

           console.log("sadad")
           usuarios.img = nombreArchivo;
           usuarios.save((err,usuarioActualizado)=>{

            if (err){
                return res.status(500).json({
                    ok:false,
                      err
                    })
            }
            usuarioActualizado.password = ":)"
            return res.status(200).json({
                ok:true,
                  mensaje:'archivos movidos',
                  usuario:usuarioActualizado
                })
           });

        });
        
    }

    if (tipo==='medicos'){
        
        medicos.findById(id,(err,medicos)=>{
            if(!medicos){
                return res.status(500).json({
                    ok:false,
                      message:"el usuario no exiszte"
                    })
            }
            var pathviejo= './uploads/medicos/'+medicos.img
            console.log(pathviejo);
 
            if (fs.existsSync(pathviejo)){
                
                fs.unlinkSync(pathviejo);
            } 
 
            console.log("sadad")
            medicos.img = nombreArchivo;
            medicos.save((err,usuarioActualizado)=>{
 
             if (err){
                 return res.status(500).json({
                     ok:false,
                       err
                     })
             }
             
             return res.status(200).json({
                 ok:true,
                   mensaje:'archivos movidos',
                   usuario:usuarioActualizado
                 })
            });
 
         });

    }
    if (tipo==='hospitales'){
        hospitales.findById(id,(err,hospitales)=>{

            if(!hospitales){
                return res.status(500).json({
                    ok:false,
                      message:"el usuario no exiszte"
                    })
            }


        var pathviejo= './uploads/hospitales/'+hospitales.img
        console.log(pathviejo);

        if (fs.existsSync(pathviejo)){
            
            fs.unlinkSync(pathviejo);
        } 

        console.log("sadad")
        hospitales.img = nombreArchivo;
        hospitales.save((err,usuarioActualizado)=>{

         if (err){
             return res.status(500).json({
                 ok:false,
                   err
                 })
         }
         
         return res.status(200).json({
             ok:true,
               mensaje:'archivos movidos',
               usuario:usuarioActualizado
             })
        });
    });
    }

}

module.exports = app;