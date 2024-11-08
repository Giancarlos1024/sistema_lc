const pool = require('../Config/database'); // Asegúrate de que esta configuración sea correcta

// Controlador para obtener datos de primas y comisiones
const getRamoSBSPrimaDolares = (req, res) => {
  const year = req.query.year;
  const ramoSBS = req.query.ramo_sbs;
  const month = req.query.month;

  let query = `
      SELECT 
          TRIM(ramo_sbs) AS RamoSBS,
          YEAR(fecha) AS anio,
          ${ramoSBS ? 'MONTH(fecha) AS mes,' : ''}
          SUM(COALESCE(prima_dol, 0)) AS total_prima_dolares,
          SUM(COALESCE(com_dol, 0)) AS total_com_dolares
      FROM 
          factura_general
      WHERE 1=1
  `;

  if (year) {
      query += ` AND YEAR(fecha) = ${pool.escape(year)}`;
  }

  if (ramoSBS) {
      query += ` AND TRIM(ramo_sbs) = ${pool.escape(ramoSBS)}`;
  }

  if (month) {
      query += ` AND MONTH(fecha) = ${pool.escape(month)}`;
  }

  query += `
      GROUP BY 
          TRIM(ramo_sbs), YEAR(fecha)
          ${ramoSBS ? ', MONTH(fecha)' : ''}
      ORDER BY 
          TRIM(ramo_sbs), YEAR(fecha)
          ${ramoSBS ? ', MONTH(fecha)' : ''}
  `;

  pool.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching RamoSBS Prima Dolares:', error);
          res.status(500).json({ error: 'Database query error' });
      } else {
          res.json(results);
      }
  });
};

// Controlador para obtener los años disponibles
const getAvailableYears = (req, res) => {
  const query = `
  SELECT DISTINCT YEAR(fecha) AS year
  FROM factura_general
  ORDER BY year DESC;
`;

pool.query(query, (error, results) => {
  if (error) {
      return res.status(500).json({ error: error.message });
  }
  const years = results.map(row => row.year);
  res.json(years);
});
};

// Controlador para obtener los ramos SBS disponibles
const getAvailableRamosSBS = (req, res) => {
  const query = `
  SELECT DISTINCT TRIM(ramo_sbs) AS ramo_sbs
  FROM factura_general
  ORDER BY ramo_sbs;
`;

pool.query(query, (error, results) => {
  if (error) {
      return res.status(500).json({ error: error.message });
  }
  const ramosSBS = results.map(row => row.ramo_sbs);
  res.json(ramosSBS);
});
};
const getAvailableMonthsDolares = (req, res) => {
  const year = req.query.year;
  const ramoSBS = req.query.ramo_sbs;

  if (!year || !ramoSBS) {
      return res.status(400).json({ error: 'Year and Ramo SBS are required' });
  }

  const query = `
      SELECT DISTINCT MONTH(fecha) AS month
      FROM factura_general
      WHERE YEAR(fecha) = ${pool.escape(year)} 
        AND TRIM(ramo_sbs) = ${pool.escape(ramoSBS)}
      ORDER BY month;
  `;

  pool.query(query, (error, results) => {
      if (error) {
          return res.status(500).json({ error: error.message });
      }
      const months = results.map(row => row.month);
      res.json(months);
  });
};

module.exports = {
    getRamoSBSPrimaDolares,
    getAvailableYears,
    getAvailableRamosSBS,
    getAvailableMonthsDolares
};
