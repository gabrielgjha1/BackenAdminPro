var semilla = require('../configuracion/semilla').seed;
var jwt = require('jsonwebtoken');

exports.verificartoken = function(req,res,nex){


        var token = req.query.token;
        jwt.verify(token,semilla,(err,decoded)=>{
            
            if (err){
                return res.status(401).json({
                    ok:false,
                    message:'TOken no valido',
                    error:err
                });
            }

            req.usuario = decoded.usuario;

            nex();
    
        });

}

    

