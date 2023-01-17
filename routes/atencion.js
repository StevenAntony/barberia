const express = require('express');
const Atencion = require('../models/Atencion');
const Caja = require('../models/Caja');
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
        // console.log(req.body);
        const cajaDB = await Caja.findOne({ Estado: 'Aperturado' })
        if (cajaDB != null) {
            const atencionDB = new Atencion({
                Cliente:req.body.itmCliente,
                Corte:req.body.itmCorte,
                Usuario:{
                    Nombre:req.user.Nombre,
                    Codigo:req.user._id,
                },
                Monto:req.body.itmMonto,
                Adicional:req.body.itmAdicional,
                Pago:req.body.itmPago,
                Caja:cajaDB._id
              })
    
            await atencionDB.save()
            response.setData(atencionDB);
            response.setSuccess(true);
            res.json(response.result)
        }else{
            response.setError('Caja no Aperturada',500,'INTERNAL_ERROR');
            response.setSuccess(false);
            res.json(response.result)
        }
    } catch (error) {
        console.log(error);
        response.setData([]);
        response.setError('Error Servidor',500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

router.put('/estado/:id',async (req, res) => {
    const response = new Response();
    const id = req.params.id;
    const body = {
        Estado : req.body.itmEstado == 'Cobrado' ? 'Anulado' : 'Cobrado'
    };
    try {        
        const atencionDB = await Atencion.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        )

        response.setData(atencionDB);
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