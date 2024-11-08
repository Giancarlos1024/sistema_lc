const express = require('express');
const router = express.Router();
const { 
    getPrimasPorAnio,
    getPrimasDiferencia,
    getPrimasAnterior,
    getPrimasPorAnioDolares,
    getPrimasDiferenciaDolares,
    getPrimasAnteriorDolares,
    getAvailableYears,

    
} = require('../Controllers/Controllers_PrimasSD');

// Rutas


router.get('/anio', getPrimasPorAnio);
router.get('/diferenciadia', getPrimasDiferencia);
router.get('/cifraanteriortotal', getPrimasAnterior);


router.get('/aniodolares', getPrimasPorAnioDolares);
router.get('/diferenciadiadolares', getPrimasDiferenciaDolares);
router.get('/cifraanteriortotaldolares', getPrimasAnteriorDolares);

router.get('/available-years', getAvailableYears);
module.exports = router;
