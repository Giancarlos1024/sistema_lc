const express = require('express');
const router = express.Router();
const { 
    getGraficoOficinasDolares, 
    getAvailableYearsDolares, 
    getAvailableOfficesDolares, 
    getAvailableMonthsDolares 
} = require('../Controllers/Controllers_GraficoOficinasPrimasDolares');

// Rutas
router.get('/oficionasgraficodolares', getGraficoOficinasDolares);
router.get('/available-yearsdolares', getAvailableYearsDolares);
router.get('/available-officesdolares', getAvailableOfficesDolares);
router.get('/available-monthsdolares', getAvailableMonthsDolares);

module.exports = router;
