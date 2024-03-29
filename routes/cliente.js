const express = require('express');
const Cliente = require('../models/Cliente');
const Response = require('../core/Response');

const router = express.Router();

router.get('/',isAuthenticated, (req, res, next) => {
    res.render('mantenimiento/cliente',{ nameApp: process.env.NAME_APP,userAuth:req.user  });
});

router.post('/list',async (req, res) => {
    const response = new Response();
    try {        
        const arrayData = await Cliente.find();
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
        const clienteDB = new Cliente({
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
        const clienteDB = await Cliente.findByIdAndUpdate(
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
        const clienteDB = await Cliente.findByIdAndUpdate(
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

router.post('/buscar',async (req, res) => {
    const response = new Response();
    try {        
        const clienteDB = await Cliente.find({$or:[
            {Nombre:{ $regex: '.*' + req.body.itmBuscar + '.*',$options:'i' }},
            {Apellido:{ $regex: '.*' + req.body.itmBuscar + '.*',$options:'i' }}
        ]})

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