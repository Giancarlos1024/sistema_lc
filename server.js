const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: 'https://frontend-l22d.onrender.com', // Cambia a tu URL de Render
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Rutas
const loginRoutes = require('./src/Routes/RouterLogin');
const FacturaRoutes = require('./src/Routes/RouterReporteFactura');
const FacturaBreveRoutes = require('./src/Routes/RouterFacturaBreve');
const ResumenFacturaRoutes = require('./src/Routes/RouterReporteFactura');
const PrimasSD = require('./src/Routes/RouterPrimasSD');
const ComisionesSD = require('./src/Routes/RouterComisionesSD');


const Graficos = require('./src/Routes/RouterGraficoPrimaSoles');
const Graficosdol = require('./src/Routes/RouterGraficoPrimaDolares');
const GraficoOficinas = require('./src/Routes/RouterGraficoOficinasPrimas');
const GraficoOficinasDolares = require('./src/Routes/RouterGraficoOficinasPrimasDolares');
const GraficoRamoSBS = require('./src/Routes/RouterGraficoRamoSBSPrimaComisiones');
const GraficoRamoSBSDolares = require('./src/Routes/RouterGraficoRamoSBSPrimaComisionesDolares');


app.use('/', loginRoutes);
app.use('/api/facturas', FacturaRoutes);
app.use('/facturabreve', FacturaBreveRoutes);
app.use('/resumen', ResumenFacturaRoutes);
app.use('/prueba', PrimasSD);
app.use('/prueba2', ComisionesSD);

app.use('/graficos', Graficos);
app.use('/graficosdol', Graficosdol);
app.use('/graficosoficinas', GraficoOficinas);
app.use('/graficosoficinasdolares', GraficoOficinasDolares);
app.use('/graficosramosbs', GraficoRamoSBS);
app.use('/graficosramosbsdolares', GraficoRamoSBSDolares);


// Iniciar servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
