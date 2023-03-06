const router = require('express').Router();
const User = require('../models/User');

const singIn = require('../domain/UserUseCase');
const exceptionHandler = require('../core/Exception');

router.post('/register', async (req, res) => {

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    });
    try {
        const savedUser = await user.save();
        res.json({
            error: null,
            data: savedUser
        })
    } catch (error) {
        res.status(400).json({error})
    }
})

router.get('/signin', (req, res) => {
    res.render("login", { nameApp: process.env.NAME_APP });
});


router.post('/signin',async (req, res) => {
    const usuario = req.body.usuario;
    const password = req.body.password;

    try {
        const response =await singIn(usuario, password);
        return res.status(200).json(response); 
    } catch (error) {
        return res.status(500).json(exceptionHandler(error.message));
    }
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/auth/signin');
    });
});  

module.exports = router;