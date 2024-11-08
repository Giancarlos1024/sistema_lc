const pool = require('../Config/database');

// Obtiene los datos para el gráfico de primas en soles por oficina y año
const getGraficoOficinas = (req, res) => {
  const { year, office, month } = req.query;
  let query = `SELECT 
                TRIM(oficina) AS oficina,
                YEAR(fecha) AS anio,
                SUM(COALESCE(prima_soles, 0)) AS total_prima_soles,
                SUM(COALESCE(com_soles, 0)) AS total_comision_soles
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
      res.json({
        monthlyData: results
      });
    }
  });
};

// Obtiene las oficinas disponibles para el filtro
const getAvailableOffices = (req, res) => {
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
const getAvailableYears = (req, res) => {
  pool.query(`SELECT DISTINCT YEAR(fecha) AS year FROM factura_general ORDER BY year;`, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error en la consulta a la base de datos.');
    } else {
      res.json(results.map(row => row.year));
    }
  });
};

const getAvailableMonths = (req, res) => {
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
  getGraficoOficinas,
  getAvailableOffices,
  getAvailableYears,
  getAvailableMonths,
};
