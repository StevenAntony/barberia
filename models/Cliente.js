const mongoose = require('mongoose');

const clienteSchema = mongoose.Schema({
    Nombre:{type:String,required: true},
    Apellido:{type:String,required: true},
    Nacimiento:String,
    Estado:{type: String,default: 'Habilitado'},
    Created:{type: Date,default: Date.now},
    Documento:String,
    Foto:String,
    Updated:{type: Date,default: Date.now}
}, { collection: 'cliente' })

module.exports = mongoose.model('cliente', clienteSchema);