const express = require('express');
const Corte = require('../models/Corte');
const Response = require('../core/Response');

const router = express.Router();

router.get('/',async (req, res) => {
    res.render('mantenimiento/cliente',{ nameApp: process.env.NAME_APP });
})

router.post('/list',async (req, res) => {
    const response = new Response();
    try {        
        const arrayCorte = await Corte.find();
        response.setData(arrayCorte);
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
        response.setData([]);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

router.post('/update',async (req, res) => {
    const response = new Response();
    try {

        const corteDB = new Corte({
            Descripcion: req.body.Descripcion,
            Monto: req.body.Monto,
            Imagen: req.body.Imagen,
            Estado: "Activo"
          })
        await corteDB.save()
        
        response.setData([]);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})


module.exports = router;