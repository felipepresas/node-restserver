const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete } = require('../controllers/usuarios');


    
const router = Router();

router.get('/', usuariosGet);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // middleware verifica que no este vacio
    check('pasword', 'El pasword es obligatorio y mas de 6 letras').isLength({min:6}), // middleware verifica que minimo contenga 6 caracteres
    // check('correo', 'El correo no es valido').isEmail(), //middleware verifica por medio npm express-validator que sea un correo valido
    check('correo').custom(emailExiste), //middleware verifica por medio npm express-validator que sea un correo valido
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']), // middleware verifica que sea un rol valido
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),  // validar si el id es valido
    check('id').custom(existeUsuarioPorId),   // valida si el usuario existe
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    check('id', 'No es un ID valido').isMongoId(), 
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);



module.exports = router;