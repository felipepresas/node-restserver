const { response } = require('express');
const { Producto } = require('../models');



// Obtener categorias - paginado - total - populate
const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };  // validar todos los que estan en estado activo

    const [total, productos] = await Promise.all([   // Ejecuta todas las promesas al mismo tiempo a la espera de que todas esten solucionadas
        Producto.countDocuments(query), Producto
            .find(query)
            .populate('usuario', 'nombre') // indicar ultimo usuario que modifico
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

// Obtener categoria - populate
const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto
        .findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
        
    res.json(producto);
}


// Crear categoria
const crearProducto = async (req, res = response) => {

    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({ nombre:body.nombre });;  // Nombre viene de schema
    //consultar si la categoria existe
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }

    // generar data a guardar
    const data = {
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    // prepara la data para ser guardada
    const producto = new Producto(data);

    // guardar la categoria
    await producto.save();

    res.status(201).json(producto);

}

//actualizar la categoria
const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase(); 
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
}

//borra categoria : cambiar estado false

const productoBorrado = async (req, res = response) => {

    const { id } = req.params;


    //fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const productoBorrada = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    // const usuariAutenticado = req.usuario;

    res.json(productoBorrada);
}

module.exports = {
    crearProducto,
     obtenerProductos,
     obtenerProducto,
     actualizarProducto,
     productoBorrado
     
}