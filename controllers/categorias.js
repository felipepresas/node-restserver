const { response } = require('express');
const { Categoria } = require('../models');



// Obtener categorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };  // validar todos los que estan en estado activo

    const [total, categorias] = await Promise.all([   // Ejecuta todas las promesas al mismo tiempo a la espera de que todas esten solucionadas
        Categoria.countDocuments(query), Categoria
            .find(query)
            .populate('usuario', 'nombre') // indicar ultimo usuario que modifico
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })
}

// Obtener categoria - populate
const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria
        .findById(id)
        .populate('usuario', 'nombre');

    res.json(categoria);
}


// Crear categoria
const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });  // Nombre viene de schema
    //consultar si la categoria existe
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    // generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    // prepara la data para ser guardada
    const categoria = new Categoria(data);

    // guardar la categoria
    await categoria.save();

    res.status(201).json(categoria);

}

//actualizar la categoria
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase(); // actualizando data mayusculas
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data,{new:true});

    res.json(categoria);
}

//borra categoria : cambiar estado false

const categoriaDelete = async (req, res = response) => {

    const { id } = req.params;


    //fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false },{new:true});
    // const usuariAutenticado = req.usuario;

    res.json(categoriaBorrada);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    categoriaDelete
}