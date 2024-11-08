const pool = require('../Config/database');

// Obtiene los datos para el gráfico de primas en dólares por oficina y año
const getGraficoOficinasDolares = (req, res) => {
  const { year, office, month } = req.query;
  let query = `SELECT 
                  TRIM(oficina) AS oficina,
                  YEAR(fecha) AS año,
                  SUM(COALESCE(prima_dol, 0)) AS total_prima_dolares,
                  SUM(COALESCE(com_dol, 0)) AS total_com_dolares
               FROM 
                  factura_general`;

  const conditions = [];
  if (year) conditions.push(`YEAR(fecha) = ${year}`);
  if (office) conditions.push(`TRIM(oficina) = '${office}'`);
  if (month) conditions.push(`MONTH(fecha) = ${month}`);

  if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` GROUP BY 
                 TRIM(oficina), YEAR(fecha)
             ORDER BY 
                 TRIM(oficina), YEAR(fecha);`;

  pool.query(query, (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).send('Error en la consulta a la base de datos.');
      } else {
          res.json(results);
      }
  });
};


// Obtiene las oficinas disponibles para el filtro
const getAvailableOfficesDolares = (req, res) => {
  pool.query(`SELECT DISTINCT TRIM(oficina) AS oficina FROM factura_general ORDER BY oficina;`, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error en la consulta a la base de datos.');
    } else {
      res.json(results.map(row => row.oficina));
    }
  });
};

// Obtiene los años disponibles para el filtro
const getAvailableYearsDolares = (req, res) => {
  pool.query(`SELECT DISTINCT YEAR(fecha) AS year FROM factura_general ORDER BY year;`, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error en la consulta a la base de datos.');
    } else {
      res.json(results.map(row => row.year));
    }
  });
};

// Asumiendo que tienes esta función definida en algún lugar:
const getAvailableMonthsDolares = (req, res) => {
  pool.query(`SELECT DISTINCT MONTH(fecha) AS month FROM factura_general ORDER BY month;`, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error en la consulta a la base de datos.');
    } else {
      res.json(results.map(row => row.month));
    }
  });
};

module.exports = {
  getGraficoOficinasDolares,
  getAvailableOfficesDolares,
  getAvailableYearsDolares,
  getAvailableMonthsDolares
};
