const express = require('express');
const router = express.Router();
const {
    getFacturaDatos,
    getFacturaCount,
    postFactura,
    updateFactura,
    deleteFactura,
} = require('../Controllers/Controllers_ReporteFactura');

// Rutas
router.get('/datos', getFacturaDatos);
router.get('/count', getFacturaCount);

router.post('/registrarfactura', postFactura);
router.put('/actualizarfactura/:id', updateFactura); 
router.delete('/eliminarfactura/:id', deleteFactura);

module.exports = router;
