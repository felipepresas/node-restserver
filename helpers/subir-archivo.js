const path = require('path');
const { v4: uuidv4 } = require('uuid');



const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');   //archivo.name separado en un arreglo por los puntos que contiene
        const extension = nombreCortado[nombreCortado.length - 1];  // obteniendo la ultima posicion del arreglo para obterner la extension

        //validar la extension

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es valida`)

        }
        const nombreTemp = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, function (err) {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });

    })


}


module.exports = {
    subirArchivo,
}