const mongoose = require('mongoose');

const movimientoSchema = mongoose.Schema({
    Caja:{type:Object,required: true},
    Tipo:{type:String,required: true},
    Monto:{type:Number,required: true},
    Estado:{type: String,default: 'Ejecutado'},
    Usuario:{type: Object,required: true},
    Fecha:{type:Date,default:Date.now()},
    Modo:{type: String,required: true}
}, { collection: 'movimiento' })

module.exports = mongoose.model('movimiento', movimientoSchema);