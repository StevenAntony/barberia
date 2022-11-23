const mongoose = require('mongoose');

const corteSchema = mongoose.Schema({
    Descripcion:String,
    Monto:Number,
    Imagen:String,
    Estado:String
}, { collection: 'corte' })

module.exports = mongoose.model('corte', corteSchema);