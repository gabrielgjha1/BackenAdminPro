//Requires (importacion de librerias)
var moongose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser')

//Inicializar variables 
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//importar rutas

var appRoutes = require('./rutas/app');
var usuarioROutes = require('./rutas/usuarios');
var loginROutes = require('./rutas/login');
var hospitalesroutes = require('./rutas/hospitales');
var medicoROute = require('./rutas/medicos');
var uploadRoutes = require('./rutas/upload');
var imagenesRoutes = require('./rutas/img');

//COnexion a la base de datos
moongose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{

    if (err) throw err;

    console.log('Base de dato ONLINE')
});


//Rutas
app.use('/usuario',usuarioROutes);
app.use('/login',loginROutes);
app.use('/hospitales',hospitalesroutes);
app.use('/medicos',medicoROute);
app.use('/upload',uploadRoutes);
app.use('/imagenes',imagenesRoutes);
app.use('/',appRoutes);

//escuchar puerto 

app.listen(3000,()=>{
    console.log('express server coriendo en el puerto 3000')
});