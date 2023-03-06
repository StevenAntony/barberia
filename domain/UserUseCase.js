const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");
const Response = require('../core/Response');

const singIn = async(users, password) => {
    const response = new Response();
    const user = await User.findOne({Usuario: users});
    if(!user) {
        response.setData({});
        response.setSuccess(false);
        response.setMessage('Usuario no encontrado');
        
        return response.result;
    }
    if(!bcrypt.compareSync(`${password}`, user.Password)) {
        response.setData({});
        response.setSuccess(false);
        response.setMessage('Contraseña incorrecta');
        return response.result;
    }else{
        const token = jwt.sign({
            name: user.Nombre,
            id: user._id
        }, process.env.TOKEN_SECRET);
        response.setHeadersToken(token);
        response.setData({
            name: user.Nombre,
            id: user._id,
            token: token,
            url: process.env.APP_ENV == 'local' ? 'http://127.0.0.1:3000/' : process.env.BASE_URL
        });
        response.setSuccess(true);
        response.setMessage('Acceso conseguido');
        return response.result;
    }
}

module.exports = singIn;