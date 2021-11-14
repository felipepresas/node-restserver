
const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async function (req = request, res = response, next) {

    const token = req.header('x-token');


    if (!token) {
        return res.status(401).json({
            msg: 'No token provided'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario que corresponde
        const usuario = await Usuario.findById(uid);

        //validar que el usuario si existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe db'
            })
        }

        // verificar si el uid tiene estado en true
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(req.usuario)
        console.log(error)
        res.status(401).json({
            msg: 'Invalid token'
        })
    }

}

module.exports = {
    validarJWT,
}