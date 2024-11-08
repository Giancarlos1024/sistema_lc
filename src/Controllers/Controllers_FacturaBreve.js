const pool = require('../Config/database');

// Obtener todas las facturas breves
const getFacturaBreve = async (req, res) => {
    const query = 'SELECT * FROM factura_resumen';
    
    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(results);
    });
};


// Crear una nueva factura breve
const postFacturaBreve = async (req, res) => {
   
};

// Actualizar una factura breve existente
const updateFacturaBreve = async (req, res) => {
   
};

// Eliminar una factura breve
const deleteFacturaBreve = async (req, res) => {
   
};

module.exports = {
    getFacturaBreve,
    postFacturaBreve,
    updateFacturaBreve,
    deleteFacturaBreve
};
