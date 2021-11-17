const path = require('path'); // importaciones propias de node al comienzo
const fs = require('fs');    // importaciones propias de node al comienzo

// const cloudinary = require('cloudinary').v2;
// cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');



const cargarArchivo = async (req, res = response) => {

    try {

        // subir imagenes por defecto
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        // subir texto
        //const nombre = await subirArchivo(req.files,['txt','md','pdf'],'textos');

        res.json({ nombre });


    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }
            break;


        default:
            return res.status(500).json({ msg: 'Pendiente de validar' })
    }

    // Limpiar imagenes antreriores

    if (modelo.img){
        
        const pathImagen = path.join(__dirname, '../uploads', coleccion,modelo.img);  //construir ruta a borrar
        if (fs.existsSync(pathImagen)) {    // si la ruta existe
            fs.unlinkSync(pathImagen);      // hay que borrar imagen del servidor
            
        }   
    }


    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    
    await modelo.save();


    res.json( modelo );

}

const mostrarImagen = async(req, res = response)=>{


    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }
            break;


        default:
            return res.status(500).json({ msg: 'Pendiente de validar' })
    }

    // Limpiar imagenes antreriores

    if (modelo.img) {
        
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);  //construir ruta a borrar
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen) // enviar la imagen

        }
    }

    const pathImagen = path.join(__dirname, '../assets/not-found-image-15383864787lu.jpg');

    return res.sendFile(pathImagen)

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}