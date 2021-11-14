const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../DB/config.js');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //crear rutas
        this.paths={
            auth:'/api/auth',
            categorias:'/api/categorias',
            usuarios: '/api/usuarios'
        }


        //conectar a base de datos
        this.conectarDB();

        //Middleware
        this.middlewares();
        //Rutas de la aplicacion
        this.routes();
    }
    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS -> SE UTILIZA COMO SEGURIDAD LIGERA PARA BACKEND
        this.app.use(cors());

        //LECTURA Y PARSEO DEL BODY
        this.app.use(express.json());

        //Directorio publico que sirve al cliente
        this.app.use(express.static('public'));

    }

    routes(){

        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.categorias,require('../routes/categorias'));
        this.app.use(this.paths.usuarios,require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor listening on port', this.port);
        });
    }

}

module.exports = Server;