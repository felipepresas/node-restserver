const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        //verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            });
        }
        //verificar la contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar el JWT  jason web tokens
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'hable con el administrador del servidor'
        });
    }
}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify(id_token);
        // console.log(googleUser);

        let usuario = await Usuario.findOne({correo});
        // console.log(usuario);

        if (!usuario) {
            //tengo que crear si usuario no existe
            const data = {
                nombre,
                correo,
                password:':P@ASD.com',
                img,
                rol: 'USER_ROLE',
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save(); // se graba en base de datos nuevo usuario 
        }

        //si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Contacte con administrador, usuario bloqueado'
            });
        }

        //Generar el JWT  jason web tokens
         const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(410).json({

            msg: 'Token de Google no es válido'
        });
    }

}

module.exports = {
    login,
    googleSignIn,
}