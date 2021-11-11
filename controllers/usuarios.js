const { response } = require('express')


const usuariosGet = (req, res = response) => {

    const {q,nombre} = req.query;

    res.json({
        msg: 'get api controller',
        q, nombre
    })
}

const usuariosPost = (req, res= response) => {

    const body = req.body;

    res.status(201).json({
        msg: 'post api',
        body
    })
}

const usuariosPut=(req, res= response) => {

    const {id} = req.params;

    res.json({
        msg: 'put api',
        id
    })
}

const usuariosPatch = (req, res= response) => {
    res.json({
        msg: 'patch api controller'
    })
}
const usuariosDelete = (req, res= response) => {
    res.json({
        msg: 'delete api controller'
    })
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}