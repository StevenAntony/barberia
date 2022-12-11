const express = require('express');
const Movimiento = require('../models/Movimiento');
const Response = require('../core/Response');

const router = express.Router();

router.get('/',isAuthenticated, (req, res, next) => {
    res.render('mantenimiento/atencion',{ nameApp: process.env.NAME_APP,userAuth:req.user  });
});

router.post('/list',async (req, res) => {
    const response = new Response();
    try {        
        const arrayData = await Atencion.find();
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

router.post('/create',async (req, res) => {
    const response = new Response();
    try {        
        const clienteDB = new Atencion({
            Nombre:req.body.itmNombre,
            Apellido:req.body.itmApellido,
            Nacimiento:req.body.itmNacimiento,
            Documento:req.body.itmDocumento
          })

        await clienteDB.save()
        response.setData(clienteDB);
        response.setSuccess(true);
        res.json(response.result)
    } catch (error) {
        response.setData([]);
        response.setError('Error Servidor',500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

router.put('/update/:id',async (req, res) => {
    const response = new Response();
    const id = req.params.id;
    const body = {
        Nombre:req.body.itmNombre,
        Apellido:req.body.itmApellido,
        Nacimiento:req.body.itmNacimiento,
        Documento:req.body.itmDocumento,
        Updated:Date.now()
    };
    try {        
        const clienteDB = await Atencion.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        )

        response.setData(clienteDB);
        response.setSuccess(true);
        res.json(response.result)
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

router.put('/estado/:id',async (req, res) => {
    const response = new Response();
    const id = req.params.id;
    const body = {
        Estado : req.body.itmEstado == 'Habilitado' ? 'Inhabilitado' : 'Habilitado',
        Updated:Date.now()
    };
    try {        
        const clienteDB = await Atencion.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        )

        response.setData(clienteDB);
        response.setSuccess(true);
        res.json(response.result)
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
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