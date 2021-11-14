const { response } = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');
const { emailExiste } = require('../helpers/db-validators');

const usuariosGet = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find(query)
    // .skip(Number(desde))
    // .limit(Number(limite))

    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([               // Ejecuta todas las promesas al mismo tiempo a la espera de que todas esten solucionadas
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, pasword, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, pasword, rol }); // crea una instancia de usuario

    //encrytar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.pasword = bcrypt.hashSync(pasword, salt)

    //guardar db

    await usuario.save(); // grabar en DB el usuario

    res.json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, pasword, google, correo, ...resto } = req.body;

    // Validar contra base de datos id
    if (pasword) {
        //encrytar contraseña
        const salt = bcrypt.genSaltSync();
        resto.pasword = bcrypt.hashSync(pasword, salt)
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPatch = async (req, res = response) => {
    res.json({
        msg: 'patch api controller'
    })
}
const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;


    //fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    // const usuariAutenticado = req.usuario;

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}