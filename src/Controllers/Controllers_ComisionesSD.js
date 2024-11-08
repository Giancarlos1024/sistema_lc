const pool = require('../Config/database'); // Asegúrate de que la ruta sea correcta

const getComisionesPorAnio = (req, res) => {
    const { anio } = req.query;
    let query = `
        SELECT
            EXTRACT(YEAR FROM fecha) AS anio,
            SUM(com_soles) AS total_comision_soles_anio
        FROM
            factura_general
    `;

    if (anio) {
        query += ` WHERE EXTRACT(YEAR FROM fecha) = ?`;
    }

    query += `
        GROUP BY
            EXTRACT(YEAR FROM fecha)
        ORDER BY
            anio;
    `;

    const queryParams = anio ? [anio] : [];

    pool.query(query, queryParams, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(results);
    });
};

const getComisionesDiferencia = (req, res) => {
    const { anio } = req.query;

    // Consulta para obtener la fecha más reciente en el año seleccionado
    const fechaFinQuery = `
        SELECT MAX(fecha) AS fecha_fin
        FROM factura_general
        WHERE EXTRACT(YEAR FROM fecha) = ?
    `;

    pool.query(fechaFinQuery, [anio], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const fechaFin = results[0].fecha_fin;

        // Consulta para calcular la diferencia entre el total hasta la fecha de fin y el total hasta el día anterior
        const diferenciaQuery = `
            SELECT 
                SUM(CASE WHEN fecha BETWEEN ? AND ? THEN com_soles ELSE 0 END) -
                SUM(CASE WHEN fecha BETWEEN ? AND DATE_SUB(?, INTERVAL 1 DAY) THEN com_soles ELSE 0 END) AS diferencia_comision_soles
            FROM
                factura_general
            WHERE EXTRACT(YEAR FROM fecha) = ?
        `;

        pool.query(diferenciaQuery, [anio, fechaFin, anio, fechaFin, anio], (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json({ diferencia: results[0].diferencia_comision_soles });
        });
    });
};

const getComisionesAnterior = (req, res) => {
    const { anio } = req.query;
    const today = new Date();
    const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const previousDayQuery = `
        SELECT
            SUM(com_soles) AS total_comision_soles_dia
        FROM
            factura_general
        WHERE
            fecha = (SELECT MAX(fecha) FROM factura_general WHERE fecha < ? AND EXTRACT(YEAR FROM fecha) = ?)
            AND EXTRACT(YEAR FROM fecha) = ?
    `;

    pool.query(previousDayQuery, [currentDate, anio, anio], (err, previousResults) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const previousDayData = previousResults[0] || {};
        res.status(200).json(previousDayData);
    });
};

const getComisionesPorAnioDolares = (req, res) => {
    const { anio } = req.query;
    let query = `
        SELECT
            EXTRACT(YEAR FROM fecha) AS anio,
            SUM(com_dol) AS total_comision_dolares_anio
        FROM
            factura_general
    `;

    if (anio) {
        query += ` WHERE EXTRACT(YEAR FROM fecha) = ?`;
    }

    query += `
        GROUP BY
            EXTRACT(YEAR FROM fecha)
        ORDER BY
            anio;
    `;

    const queryParams = anio ? [anio] : [];

    pool.query(query, queryParams, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(results);
    });
};

const getComisionesDiferenciaDolares = (req, res) => {
    const { anio } = req.query;

    const fechaFinQuery = `
        SELECT MAX(fecha) AS fecha_fin
        FROM factura_general
        WHERE EXTRACT(YEAR FROM fecha) = ?
    `;

    pool.query(fechaFinQuery, [anio], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const fechaFin = results[0].fecha_fin;

        const diferenciaQuery = `
            SELECT 
                SUM(CASE WHEN fecha BETWEEN ? AND ? THEN com_dol ELSE 0 END) -
                SUM(CASE WHEN fecha BETWEEN ? AND DATE_SUB(?, INTERVAL 1 DAY) THEN com_dol ELSE 0 END) AS diferencia_comision_dolares
            FROM
                factura_general
            WHERE EXTRACT(YEAR FROM fecha) = ?
        `;

        pool.query(diferenciaQuery, [anio, fechaFin, anio, fechaFin, anio], (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json({ diferencia: results[0].diferencia_comision_dolares });
        });
    });
};

const getComisionesAnteriorDolares = (req, res) => {
    const { anio } = req.query;
    const today = new Date();
    const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const previousDayQuery = `
        SELECT
            SUM(com_dol) AS total_comision_dolares_dia
        FROM
            factura_general
        WHERE
            fecha = (SELECT MAX(fecha) FROM factura_general WHERE fecha < ? AND EXTRACT(YEAR FROM fecha) = ?)
            AND EXTRACT(YEAR FROM fecha) = ?
    `;

    pool.query(previousDayQuery, [currentDate, anio, anio], (err, previousResults) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const previousDayData = previousResults[0] || {};
        res.status(200).json(previousDayData);
    });
};

const getAvailableYears = (req, res) => {
    let query = `
        SELECT DISTINCT EXTRACT(YEAR FROM fecha) AS anio
        FROM factura_general
        ORDER BY anio DESC;
    `;

    pool.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(results);
    });
};

module.exports = { 
    getComisionesPorAnio,
    getComisionesDiferencia,
    getComisionesAnterior,
    getComisionesPorAnioDolares,
    getComisionesDiferenciaDolares,
    getComisionesAnteriorDolares,
    getAvailableYears
};
