import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Screens/Login'; // Asegúrate de ajustar la ruta según tu estructura
import Dashboard from './Screens/Dashboard'; // Asegúrate de ajustar la ruta según tu estructura
import './Css/App.css';
import FacturaGeneral from './Screens/FacturaGeneral';
import FormFactura from './Components/FormFactura';
import FacturaBreve from './Screens/FacturaBreve';
import FacturaTable from './Components/FacturaTable';
import { UserProvider } from './Provider/UserContext';




const App = () => {
  return (
    <UserProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="graficosfacturaGeneral" element={<FacturaGeneral />} />
                    <Route path="formulario" element={<FormFactura />} />
                    <Route path="tablafacturaGeneral" element={<FacturaTable />} />
                    <Route path="tablafacturacomisiones" element={<FacturaBreve />} />
                  </Route>
                </Routes>
              </Router>

    </UserProvider>
    
  );
};

export default App;
