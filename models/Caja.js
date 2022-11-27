const mongoose = require('mongoose');

const cajaSchema = mongoose.Schema({
    Apertura:{type:Date,required: true},
    Cierre:{type:Date},
    Usuario:{type:Object,required:true},
    Estado:{type: String,default: 'Aperturado'},
    Total:{type: Number},
    Monto:{type:Number}
}, { collection: 'caja' })

module.exports = mongoose.model('caja', cajaSchema);