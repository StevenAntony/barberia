const router = require('express').Router();
const User = require('../../../models/User');
const bcrypt = require('bcrypt-nodejs');
const Response = require('../../../core/Response');

router.post('/signin',async (req, res) => {
    const response = new Response();
    const usuario = req.body.p_user;
    const password = req.body.p_password;

    try {
        const user = await User.findOne({Usuario: usuario});
        if(!user) {
            response.setData([]);
            response.setSuccess(false);
            response.setMessage('Usuario no encontrado');
            res.status(200).json(response.result);
        }
        if(!bcrypt.compareSync(`${password}`, user.Password)) {
            response.setData([]);
            response.setSuccess(false);
            response.setMessage('Contraseña incorrecta');
            console.log(response.result);
            res.status(200).json(response.result);
        }else{
            response.setData(user);
            response.setSuccess(true);
            response.setMessage('Usuario encontrado');
            res.status(200).json(response.result);
        }
    } catch (error) {
        console.log(error);
        response.setData([]);
        response.setError('Error Servidor',500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.status(500).json(response.result)
    }
});

module.exports = router;