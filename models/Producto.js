const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
    Nombre: { type: String, required: true },
    Descripcion: { type: String, required: true },
    Marca: { type: String, required: false },
    Estado: { type: String, default: 'Habilitado' },
    Categoria: { type: String, required: true },
    Created: { type: Date, default: Date.now() },
    Updated: { type: Date, default: Date.now() }
}, { collection: 'producto' })

module.exports = mongoose.model('producto', productoSchema);