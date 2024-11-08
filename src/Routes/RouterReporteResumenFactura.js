const express = require('express');
const router = express.Router();
const {
    getResumenFactura, 
    postResumenFactura, 
    updateResumenFactura, 
    deleteResumenFactura
} = require('../Controllers/Controllers_ReporteResumenFactura');

// Rutas
router.get('/', getResumenFactura);
router.post('/registrarResumenfactura', postResumenFactura);
router.put('/actualizarResumenfactura', updateResumenFactura);
router.delete('/eliminarResumenfactura', deleteResumenFactura);

module.exports = router;
