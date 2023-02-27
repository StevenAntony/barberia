const mongoose = require('mongoose');

const presentacionSchema = mongoose.Schema({
    IdProducto: { type: String, required: true },
    Unidad: { type: String, required: true },
    Precio: { type: Number, required: true },
    Costo: { type: Number, required: true },
    Estado: { type: String, default: 'Habilitado' },
    Imagen: { type: String, required: false },
    Stock: { type: Number, default: 0 },
    Descontar: { type: Number, required: true }
}, { collection: 'presentacion' })

module.exports = mongoose.model('presentacion', presentacionSchema);