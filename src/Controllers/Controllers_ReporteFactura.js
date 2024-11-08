const pool = require('../Config/database');

const getFacturaDatos = (req, res) => {
    const query = `
        SELECT id, oficina, factura, liquidacion, fecha, mes, poliza, recibo, 
               cia_compania, cod_ramo, ramo_sbs, ramo_cia, asegurado, 
               prima_dol, com_dol, prima_soles, com_soles, usuarioLogin, fechaModificacion 
        FROM factura_general 
        ORDER BY id desc
    `;
    
    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(results);
    });
};

const getFacturaCount = (req, res) => {
const query = 'SELECT COUNT(*) AS count FROM factura_general';
pool.query(query, (err, results) => {
    if (err) {
    res.status(500).json({ error: err.message });
    return;
    }
    res.status(200).json({ count: results[0].count });
});
};
  
const postFactura = (req, res) => {
    const {
        oficina, factura, liquidacion, fecha, mes, poliza, recibo, 
        cia_compania, cod_ramo, ramo_sbs, ramo_cia, asegurado, 
        prima_dol, com_dol, prima_soles, com_soles,usuarioLogin
    } = req.body;

    const query = `
        INSERT INTO factura_general (
            oficina, factura, liquidacion, fecha, mes, poliza, recibo, 
            cia_compania, cod_ramo, ramo_sbs, ramo_cia, asegurado, 
            prima_dol, com_dol, prima_soles, com_soles,usuarioLogin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    
    const values = [
        oficina, factura, liquidacion, fecha, mes, poliza, recibo, 
        cia_compania, cod_ramo, ramo_sbs, ramo_cia, asegurado, 
        prima_dol, com_dol, prima_soles, com_soles,usuarioLogin
    ];

    pool.query(query, values, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Factura creada exitosamente', id: results.insertId });
    });
};
/*FORMATEO PARA LA FECHA EN EL ENDPOINT updateFactura */

function formatDate(date) {
    const [year, month, day] = new Date(date).toISOString().split('T')[0].split('-');
    return `${year}-${month}-${day}`;
  }
  
  

const updateFactura = (req, res) => {
    const { id } = req.params;
    const {
        oficina, factura, liquidacion, fecha, mes, poliza, recibo, 
        cia_compania, cod_ramo, ramo_sbs, ramo_cia, asegurado, 
        prima_dol, com_dol, prima_soles, com_soles, usuarioLogin,fechaModificacion
    } = req.body;

    // Convierte la fecha a formato 'YYYY-MM-DD'
    const formattedDate = formatDate(fecha);

    const query = `
        UPDATE factura_general
        SET oficina = ?, factura = ?, liquidacion = ?, fecha = ?, mes = ?, poliza = ?, recibo = ?, 
            cia_compania = ?, cod_ramo = ?, ramo_sbs = ?, ramo_cia = ?, asegurado = ?, 
            prima_dol = ?, com_dol = ?, prima_soles = ?, com_soles = ? ,usuarioLogin = ?,fechaModificacion = ?
        WHERE id = ?
    `;
    
    const values = [
        oficina, factura, liquidacion, formattedDate, mes, poliza, recibo, 
        cia_compania, cod_ramo, ramo_sbs, ramo_cia, asegurado, 
        prima_dol, com_dol, prima_soles, com_soles,usuarioLogin, fechaModificacion, id
    ];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al actualizar factura:', err);
            res.status(500).json({ error: 'Error al actualizar la factura', details: err.message });
            return;
        }
        res.status(200).json({ message: 'Factura actualizada exitosamente' });
    });
};


const deleteFactura = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM factura_general WHERE id = ?';

    pool.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ message: 'Factura eliminada exitosamente' });
    });
};

module.exports = {
    getFacturaDatos,
    getFacturaCount,
    postFactura,
    updateFactura,
    deleteFactura
};