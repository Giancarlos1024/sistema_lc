const express = require('express');
const router = express.Router();
const { 
    getComisionesPorAnio,
    getComisionesDiferencia,
    getComisionesAnterior,
    getComisionesPorAnioDolares,
    getComisionesDiferenciaDolares,
    getComisionesAnteriorDolares,
    getAvailableYears

} = require('../Controllers/Controllers_ComisionesSD');

// Rutas
router.get('/comisionessoles', getComisionesPorAnio);
router.get('/comisionessolesdiferencia', getComisionesDiferencia);
router.get('/comisionessolesanterior', getComisionesAnterior);

router.get('/comisionesdolares', getComisionesPorAnioDolares);
router.get('/comisionesdolaresdiferencia', getComisionesDiferenciaDolares);
router.get('/comisionesdolaresanterior', getComisionesAnteriorDolares);


router.get('/available-years', getAvailableYears);
module.exports = router;
