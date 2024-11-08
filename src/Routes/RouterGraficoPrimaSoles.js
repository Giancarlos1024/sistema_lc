const express = require('express');
const router = express.Router();
const { getGraficoPrimaSoles, getAvailableYears, getAvailableMonths } = require('../Controllers/Controllers_GraficoPrimaSoles');

// Rutas
router.get('/graficoprimasoles', getGraficoPrimaSoles);
router.get('/available-years', getAvailableYears);
router.get('/available-months', getAvailableMonths);

module.exports = router;
