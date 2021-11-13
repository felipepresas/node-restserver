const Rol = require('../models/rol');
const Usuario = require('../models/usuario');

// verifica si rol valido
const esRolValido = async (rol = '') => {
    const existeRol = await Rol.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
    }
}

//verifica si existe mail
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya esta registrado`)
    }

}
//verifica si existe id
const existeUsuarioPorId = async (id) => {
    const existeid = await Usuario.findById(id );
    if (!existeid) {
        throw new Error(`El id ${id} no existe`);
    }

}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
}