const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();


//obtener todas las categorias - publico
router.get('/',(req, res) => {
    res.json('get')
});
//obtener una categoria por id - publico
router.get('/:id',(req, res) => {
    res.json('get - id')
});
//Crear categoria  - privado - cualquier persona con un token valido
router.post('/',(req, res) => {
    res.json('post')
});
//actualizar - privado - cualquier persona con un token valido
router.put('/:id',(req, res) => {
    res.json('put')
});
//borrar una categoria - admin
router.delete('/:id',(req, res) => {
    res.json('delete')
});




module.exports = router;