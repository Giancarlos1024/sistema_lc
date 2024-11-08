const express = require('express');
const router = express.Router();
const { 
    getGraficoOficinas, 
    getAvailableYears, 
    getAvailableOffices, // Nueva función para obtener oficinas disponibles
    getAvailableMonths 
} = require('../Controllers/Controllers_GraficoOficinasPrimas');

// Rutas
router.get('/oficionasgrafico', getGraficoOficinas); // Actualiza la ruta para obtener los datos del gráfico con filtros
router.get('/available-years', getAvailableYears);
router.get('/available-offices', getAvailableOffices); // Nueva ruta para obtener oficinas disponibles
router.get('/available-months', getAvailableMonths);

module.exports = router;
