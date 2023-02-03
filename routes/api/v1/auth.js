const router = require('express').Router();
const singIn = require('../../../domain/UserUseCase');
const exceptionHandler = require('../../../core/Exception');

router.post('/signin',async (req, res) => {
    
    const usuario = req.body.p_user;
    const password = req.body.p_password;

    try {
        const response =await singIn(usuario, password);
        console.log(response);
        return res.status(200).json(response); 
    } catch (error) {
        return res.status(500).json(exceptionHandler(error.message));

    }
});

module.exports = router;