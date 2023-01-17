const express = require('express');
const Caja = require('../models/Caja');
const Atencion = require('../models/Atencion');
const Response = require('../core/Response');

const router = express.Router();

router.get('/',isAuthenticated, (req, res, next) => {
    res.render('mantenimiento/caja',{ nameApp: process.env.NAME_APP,userAuth:req.user  });
});

router.post('/list',async (req, res) => {
    const response = new Response();
    try {        
        const arrayData = await Caja.find().sort({ Apertura: -1 });

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

router.post('/aperturar',async (req,res) => {
    const response = new Response();
    try {        
        const cerrarCaja = await Caja.findOneAndUpdate({ Estado: 'Aperturado' },
        {
            Estado : 'Cerrado',
            Cierre : Date.now()
        },{ returnDocument: 'after' })
        const cajaDB = new Caja({
            Apertura:Date.now(),
            Usuario:{
                Nombre:req.user.Nombre,
                Codigo:req.user._id,
            },
            Total:req.body.Inicia
        })
        await cajaDB.save()
        response.setData(cajaDB);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        response.setData([]);
        response.setError(error,500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

router.post('/verificar',async (req,res) => {
    const response = new Response();
    try {        
        const arrayData = await Caja.findOne({ Estado: 'Aperturado' });
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

router.put('/cierre/:id',async (req,res) => {
    const response = new Response();
    
    try {        
        const id = req.params.id;
        const body = {
            // Arqueo:{
            //     Realizado:req.body.Arqueo,
            //     Conteo: req.body.Conteo
            // },
            Estado:'Cerrado',
            Cierre:Date.now()
        };
        const arrayData = await Caja.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        )

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

router.put('/arqueo/:id',async (req,res) => {
    const response = new Response();
    
    try {        
        const id = req.params.id;
        const body = {
            Arqueo:{
                Realizado:req.body.Arqueo,
                Conteo: req.body.Conteo
            }
        };
        const arrayData = await Caja.findByIdAndUpdate(
            id, body, { returnDocument: 'after' }
        )

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

router.post('/detallecaja/:id',async (req,res) => {
    const response = new Response();
    
    try {        
        const id = req.params.id;
        const atenciones = await Atencion.aggregate(
            [   
                {
                    $match: {
                        Estado: "Cobrado",
                        Caja:id
                    }
                },
                {
                    $group : {
                        _id: '$Pago',
                        Total: { $sum: '$Monto' }
                    }
                },
            ]
        );

        response.setData({atenciones: atenciones});
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