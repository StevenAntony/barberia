const express = require('express');
const Caja = require('../models/Caja');
const Response = require('../core/Response');

const router = express.Router();

router.get('/',isAuthenticated, (req, res, next) => {
    res.render('mantenimiento/caja',{ nameApp: process.env.NAME_APP,userAuth:req.user  });
});

router.post('/list',async (req, res) => {
    const response = new Response();
    try {        
        const arrayData = await Caja.find();
        response.setData(arrayData);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        response.setData([]);
        response.setError('Error Servidor',500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/signin')
}

module.exports = router;