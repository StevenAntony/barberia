const express = require('express');
const Corte = require('../models/Corte');
const Response = require('../core/Response');
const verificarToken = require('../middlewares/VerificaToken');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('mantenimiento/corte',{ nameApp: process.env.NAME_APP });
})

router.post('/list',verificarToken,async (req, res) => {
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


router.post('/create',verificarToken, async (req, res) => {
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

router.put('/update/:id',verificarToken,async (req, res) => {
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

router.put('/estado/:id',verificarToken,async (req, res) => {
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



module.exports = router;