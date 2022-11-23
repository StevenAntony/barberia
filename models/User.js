const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    Nombre: {
        type: String
    },
    Email: {
        type: String
    },
    Password: {
        type: String,
        required: true
    },
    Estado: {
        type: String,
        default:'Habilitado'
    },
    Rol:{
        type: String,
        required: true
    },
    Usuario:{
        type: String,
        required: true
    },
    Created: {
        type: Date,
        default: Date.now
    },
    Updated:{
        type: Date,
        default: Date.now
    }
},{ collection: 'user' });

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
  
userSchema.methods.comparePassword= function (password) {
    return bcrypt.compareSync(password, this.Password);
};
  

module.exports = mongoose.model('user', userSchema);