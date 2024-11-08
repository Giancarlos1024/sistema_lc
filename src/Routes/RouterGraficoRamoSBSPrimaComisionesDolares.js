const express = require('express');
const router = express.Router();
const { 
    getRamoSBSPrimaDolares,
    getAvailableYears,
    getAvailableRamosSBS,
    getAvailableMonthsDolares

} = require('../Controllers/Controllers_GraficoRamoSBSPrimaComisionesDolares');

// Ruta para obtener los datos de primas y comisiones
router.get('/ramosbsprimadolares', getRamoSBSPrimaDolares);

// Ruta para obtener años disponibles
router.get('/available-yearsdolares', getAvailableYears);

// Ruta para obtener ramos SBS disponibles
router.get('/available-ramo-sbsdolares', getAvailableRamosSBS);

router.get('/available-monthsdolares', getAvailableMonthsDolares);


module.exports = router;
