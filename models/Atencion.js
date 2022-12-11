const mongoose = require('mongoose');

const atencionSchema = mongoose.Schema({
    Cliente:{type:Object,required: true},
    Corte:{type:String,required: true},
    Fecha:{type:Date,default:Date.now},
    Estado:{type: String,default: 'Cobrado'},
    Usuario:{type: Object,required: true},
    Monto:{type:Number,required: true},
    Adicional:Array,
    Pago:{type: String,required: true},
    Caja:{type:String,required:true}
}, { collection: 'atencion' })

module.exports = mongoose.model('atencion', atencionSchema);