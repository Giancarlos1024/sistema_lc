const express = require('express');
const router = express.Router();
const {
    getFacturaBreve,
    getFacturaBreveGrafico,
    postFacturaBreve,
    updateFacturaBreve,
    deleteFacturaBreve
} = require('../Controllers/Controllers_FacturaBreve');

// Rutas
router.get('/', getFacturaBreve);
router.post('/registrarfacturaBreve', postFacturaBreve);
router.put('/actualizarfacturaBreve', updateFacturaBreve);
router.delete('/eliminarfacturaBreve', deleteFacturaBreve);

module.exports = router;
