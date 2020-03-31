//Requires (importacion de librerias)
var moongose = require('mongoose');
var express = require('express');


//Inicializar variables 
var app = express();

//COnexion a la base de datos
moongose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{

    if (err) throw err;

    console.log('Base de dato ONLINE')
});


//Rutas
app.get('/',(req,res)=>{
    res.status(200).json({
        ok:'true',
        mensaje:'Peticion realizada correctamente'
    })
});



//escuchar puerto 

app.listen(3000,()=>{
    console.log('express server coriendo en el puerto 3000')
});