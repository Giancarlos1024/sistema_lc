const express = require('express');
const router = express.Router();
const { 
    getGraficoPrimaDolares, 
    getAvailableYears, 
    getAvailableMonths 

} = require('../Controllers/Controllers_GraficoPrimaDolares');

// Rutas
router.get('/graficoprimadolares', getGraficoPrimaDolares);
router.get('/available-years', getAvailableYears);
router.get('/available-months', getAvailableMonths);

module.exports = router;
