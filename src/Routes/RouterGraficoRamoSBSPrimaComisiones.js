// routes/graficosramosbs.js
const express = require('express');
const router = express.Router();
const { 
    getRamoSBSPrimaSoles,
    getAvailableYears,
    getAvailableRamosSBS,
    getAvailableMonths
} = require('../Controllers/Controllers_GraficoRamoSBSPrimaComisiones');

// Ruta para obtener los datos de primas y comisiones
router.get('/ramosbsprimasoles', getRamoSBSPrimaSoles);

// Ruta para obtener años disponibles
router.get('/available-years', getAvailableYears);

// Ruta para obtener ramos SBS disponibles
router.get('/available-ramo-sbs', getAvailableRamosSBS);

// Ruta para obtener meses disponibles
router.get('/available-months', getAvailableMonths);

module.exports = router;
