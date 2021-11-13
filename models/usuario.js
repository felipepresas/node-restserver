
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true  // con el parametro unique solo puede existir un correo con ese nombre
    },
    pasword: {
        type: String,
        required: [true, 'La contraseña es obligatorio'],
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    }

});

UsuarioSchema.methods.toJSON = function () {
    const { __v, pasword, ...usuario } = this.toObject();
    return usuario;
}


module.exports = model('Usuario', UsuarioSchema);