const express = require('express');
const Producto = require('../models/Producto');
const Presentacion = require('../models/Presentacion');
const Response = require('../core/Response');

const router = express.Router();

router.get('/',isAuthenticated , (req, res) => {
    res.render('mantenimiento/producto',{ nameApp: process.env.NAME_APP,userAuth:req.user });
})

router.post('/list',async (req, res) => {
    const response = new Response();
    try {        
        const list = await Producto.find();
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


router.post('/create',async (req, res) => {
    const response = new Response();
    try {
        const corteDB = new Corte({
            Descripcion: req.body.Descripcion,
            Monto: req.body.Monto,
            Imagen: req.body.Imagen,
            Estado: "Activo"
          })
        await corteDB.save()
        response.setData(corteDB);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

router.put('/update/:id',async (req, res) => {
    const response = new Response();
    const id = req.params.id;
    const body = {
        Descripcion: req.body.Descripcion,
        Monto: req.body.Monto,
        Imagen: req.body.Imagen
    };
    try {

        const corteDB = await Corte.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        );
        
        response.setData(corteDB);
        response.setSuccess(true);
        res.json(response.result);
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
        Estado : req.body.itmEstado == 'Activo' ? 'Inhabilitado' : 'Activo'
    };
    try {        
        const corteDB = await Corte.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        )

        response.setData(corteDB);
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