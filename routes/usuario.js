const express = require('express');
const Usuario = require('../models/User');
const Response = require('../core/Response');
const verificarToken = require('../middlewares/VerificaToken');

const router = express.Router();

router.get('/' , (req, res) => {
    res.render('mantenimiento/usuario',{ nameApp: process.env.NAME_APP });
})

router.post('/list',verificarToken,async (req, res) => {
    const response = new Response();
    try {        
        const list = await Usuario.find();
        response.setData(list);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        response.setData([]);
        response.setError('Error Servidor',500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})


router.post('/create',verificarToken,async (req, res) => {
    const response = new Response();
    try {
        const newObjeto = new Usuario({
            Nombre: req.body.itmNombre,
            Email: req.body.itmEmail,
            Password: (new Usuario).encryptPassword(req.body.itmPassword),
            Estado: "Habilitado",
            Rol:req.body.itmRol,
            Usuario: req.body.itmUsuario
          })
        await newObjeto.save()
        response.setData(newObjeto);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

router.put('/update/:id',verificarToken,async (req, res) => {
    const response = new Response();
    const id = req.params.id;
    const body = {
        Nombre: req.body.itmNombre,
        Email: req.body.itmEmail,
        Password: (new Usuario).encryptPassword(req.body.itmPassword),
        Rol:req.body.itmRol,
        Usuario: req.body.itmUsuario,
        Updated:Date.now()
    };
    try {

        const updateObjeto = await Usuario.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        );
        
        response.setData(updateObjeto);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

router.put('/estado/:id',verificarToken,async (req, res) => {
    const response = new Response();
    const id = req.params.id;
    const body = {
        Estado : req.body.itmEstado == 'Habilitado' ? 'Inhabilitado' : 'Habilitado'
    };
    try {        
        const estadoObjeto = await Usuario.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        )

        response.setData(estadoObjeto);
        response.setSuccess(true);
        res.json(response.result)
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

module.exports = router;