//en los routes reakizar validaciones


const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('pasword','El pasword es obligatorio').not().isEmpty(),
    validarCampos
],login );


module.exports = router;