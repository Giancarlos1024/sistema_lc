import React, { useContext,useEffect, useState } from 'react';
import '../Css/FacturaGeneral.css';
import '../Css/Grafico_PrimaSoles.css';
import { UserContext } from '../Provider/UserContext';
import { Grafico_PrimaSoles } from '../Components/Graficos/Grafico_PrimaSoles';
import { Grafico_PrimaDolares } from '../Components/Graficos/Grafico_PrimaDolares';
import { Grafico_OficinasPrimas } from '../Components/Graficos/Grafico_OficinasPrimas';
import { Grafico_OficinasPrimasDolares } from '../Components/Graficos/Grafico_OficinasPrimasDolares';
import { Grafico_RamoSBSPrimaComisiones } from '../Components/Graficos/Grafico_RamoSBSPrimaComisiones';
import { Grafico_RamoSBSPrimaComisionesDolares } from '../Components/Graficos/Grafico_RamoSBSPrimaComisionesDolares';
import PrimasPorAnio from '../Components/PrimasPorAnio';
import ComisionesPorAnio from '../Components/ComisionesPorAnio';




const FacturaGeneral = () => {
  const { username } = useContext(UserContext);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const today = new Date();

      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric',  
        hour12: true 
      };

      const formatted = today.toLocaleDateString('es-ES', options);
      setFormattedDate(formatted);
    };

    // Actualiza la fecha cada segundo
    const intervalId = setInterval(updateDate, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="factura-general-container">
      <div className="user-info">
        <h3>¡Hola, {username} 👋🏼!</h3>
        <div>
          <h4>Resumen de Hoy</h4>
          <p>{formattedDate}</p>
        </div>
      </div><br />
      <section className='containerPC'>
        <PrimasPorAnio />
        <ComisionesPorAnio />
      </section>
      <div className='TodosGraficos'>
        <div>
          <div className='GraficosBloque1'>
            <Grafico_PrimaSoles />
          </div>
          <div className='GraficosBloque1'>
            <Grafico_PrimaDolares />
          </div>
        </div>
        <div>
        <div className='GraficosBloque1'>
            <Grafico_OficinasPrimas />
          </div>
          <div className='GraficosBloque1'>
            <Grafico_OficinasPrimasDolares />
          </div>
        </div>

        <div className='GraficosBloque1 RamoSBSGrafico'>
          <Grafico_RamoSBSPrimaComisiones />
        </div>
        <div className='GraficosBloque1 RamoSBSGrafico'>
          <Grafico_RamoSBSPrimaComisionesDolares />
        </div>
      </div>

      
      
    </div>
  );
};

export default FacturaGeneral;
