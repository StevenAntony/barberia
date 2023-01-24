const express = require('express');
const Response = require('../../core/Response');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/resumen-mes/atencion',async (req, res) => {
    const response = new Response();
    try {        
        const mes = req.body.mes;
        const year = req.body.year;
        let fechaIni = new Date(year,mes-1,1);
        let fechaFin = new Date(year,mes,1);
        
        const arrayData = await mongoose.model('atencion').aggregate([
            {
                $match: {
                    Estado: "Cobrado",
                    Fecha:{$gte: fechaIni, $lt: fechaFin}
                }
            },
            {
                $group :{
                    _id : {moth:{$month : "$Fecha"},day:{$dayOfMonth : "$Fecha"},year:{$year : "$Fecha"}},
                    Total : {$sum : "$Monto"},
                }
            }
        ]);
        response.setData(arrayData);
        response.setSuccess(true);
        res.json(response.result);
    } catch (error) {
        console.log(error);
        response.setData([]);
        response.setError('Error Servidor',500,'INTERNAL_ERROR');
        response.setSuccess(false);
        res.json(response.result)
    }
})

module.exports = router;
