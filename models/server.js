const express = require('express')
const cors = require('cors')

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath='/api/usuarios';

        //Middleware
        this.middlewares();
        //Rutas de la aplicacion
        this.routes();
    }

    middlewares(){
        //CORS -> SE UTILIZA COMO SEGURIDAD LIGERA PARA BACKEND
        this.app.use(cors());

        //LECTURA Y PARSEO DEL BODY
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

    }

    routes(){

        this.app.use(this.usuariosPath,require('../routes/usuarios.js'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor listening on port', this.port);
        });
    }

}

module.exports = Server;