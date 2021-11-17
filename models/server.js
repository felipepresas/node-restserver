const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../DB/config.js');
const fileUpload = require('express-fileupload');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //crear rutas son el nombre de las rutas a utilizar
        this.paths={
            auth:'/api/auth',
            buscar:'/api/buscar',
            categorias:'/api/categorias',
            productos:'/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
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

        //Fileuploads - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes(){
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.categorias,require('../routes/categorias'));
        this.app.use(this.paths.productos,require('../routes/productos'));
        this.app.use(this.paths.usuarios,require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor listening on port', this.port);
        });
    }

}

module.exports = Server;