const pool = require('../Config/database');

const getGraficoPrimaSoles = (req, res) => {
    const { year, month } = req.query;
    let query = `
        SELECT 
            YEAR(fecha) AS año,
            MONTH(fecha) AS mes,
            SUM(prima_soles) AS total_prima_soles,
            SUM(com_soles) AS total_com_soles
        FROM 
            factura_general
    `;
    
    const params = [];
    if (year) {
        query += ` WHERE YEAR(fecha) = ?`;
        params.push(year);
        if (month) {
            query += ` AND MONTH(fecha) = ?`;
            params.push(month);
        }
    } else if (month) {
        query += ` WHERE MONTH(fecha) = ?`;
        params.push(month);
    }
    
    query += `
        GROUP BY 
            año, mes
        ORDER BY 
            año, mes;
    `;

    pool.query(query, params, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
};


const getAvailableYears = (req, res) => {
    const query = `
        SELECT DISTINCT YEAR(fecha) AS año
        FROM factura_general
        ORDER BY año;
    `;

    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
};

const getAvailableMonths = (req, res) => {
    const query = `
        SELECT DISTINCT MONTH(fecha) AS mes
        FROM factura_general
        ORDER BY mes;
    `;

    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
};

module.exports = { 
    getGraficoPrimaSoles,
    getAvailableYears,
    getAvailableMonths
};
