const pool = require('../Config/database');

const getResumenFactura = (req, res) => {
    const query = 'SELECT * FROM factura_resumen';
    
    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(results);
    });
};

const postResumenFactura = (req, res) => {
    const { fecha, mes, factura, cia_seguros, dolares, soles } = req.body;

    const query = `
        INSERT INTO factura_resumen (fecha, mes, factura, cia_seguros, dolares, soles)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [fecha, mes, factura, cia_seguros, dolares, soles];

    pool.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Resumen de factura creado exitosamente', id: results.insertId });
    });
};

const updateResumenFactura = (req, res) => {
    const { id } = req.body;
    const { fecha, mes, factura, cia_seguros, dolares, soles } = req.body;

    const query = `
        UPDATE factura_resumen SET
            fecha = ?, mes = ?, factura = ?, cia_seguros = ?, dolares = ?, soles = ?
        WHERE id = ?
    `;

    const values = [fecha, mes, factura, cia_seguros, dolares, soles, id];

    pool.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ message: 'Resumen de factura actualizado exitosamente' });
    });
};

const deleteResumenFactura = (req, res) => {
    const { id } = req.body;

    const query = 'DELETE FROM factura_resumen WHERE id = ?';

    pool.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ message: 'Resumen de factura eliminado exitosamente' });
    });
};

module.exports = { getResumenFactura, postResumenFactura, updateResumenFactura, deleteResumenFactura };
