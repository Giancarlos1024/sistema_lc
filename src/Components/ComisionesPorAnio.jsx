import React, { useEffect, useState } from 'react';

const ComisionesPorAnio = () => {
  const [comisiones, setComisiones] = useState([]);
  const [comisionesDolares, setComisionesDolares] = useState([]);
  const [diferenciaSoles, setDiferenciaSoles] = useState(0);
  const [diferenciaDolares, setDiferenciaDolares] = useState(0);
  const [cifraAnteriorSoles, setCifraAnteriorSoles] = useState(0);
  const [cifraAnteriorDolares, setCifraAnteriorDolares] = useState(0);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba2/available-years`);
        const data = await response.json();
        const years = data.map(item => item.anio);
        setAvailableYears(years);
        
        // Selecciona automáticamente el año actual si está disponible
        const currentYear = new Date().getFullYear();
        if (years.includes(currentYear)) {
          setSelectedYear(currentYear.toString());
          handleFetchData(currentYear.toString()); // Cargar datos para el año actual por defecto
        }
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    };

    fetchYears();
  }, []);


  const handleFetchData = (year) => {
    const fetchComisiones = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba2/comisionessoles?anio=${year}`);
        const data = await response.json();
        setComisiones(data);
      } catch (error) {
        console.error('Error fetching data (comisiones):', error);
      }
    };

    const fetchComisionesDolares = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba2/comisionesdolares?anio=${year}`);
        const dataDolares = await response.json();
        setComisionesDolares(dataDolares);
      } catch (error) {
        console.error('Error fetching data (comisiones dolares):', error);
      }
    };

    const fetchDiferenciaSoles = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba2/comisionessolesdiferencia?anio=${year}`);
        const data = await response.json();
        setDiferenciaSoles(data.diferencia || 0); 
      } catch (error) {
        console.error('Error fetching difference for soles:', error);
      }
    };

    const fetchDiferenciaDolares = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba2/comisionesdolaresdiferencia?anio=${year}`);
        const data = await response.json();
        setDiferenciaDolares(data.diferencia || 0); 
      } catch (error) {
        console.error('Error fetching difference for dollars:', error);
      }
    };

    const fetchCifraAnteriorSoles = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba2/comisionessolesanterior?anio=${year}`);
        const data = await response.json();
        setCifraAnteriorSoles(data.total_comision_soles_dia || 0);
        
      } catch (error) {
        console.error('Error fetching previous day data for soles:', error);
      }
    };

    const fetchCifraAnteriorDolares = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba2/comisionesdolaresanterior?anio=${year}`);
        const data = await response.json();
        setCifraAnteriorDolares(data.total_comision_dolares_dia || 0);
        
      } catch (error) {
        console.error('Error fetching previous day data for dollars:', error);
      }
    };

    // Ejecutar todas las funciones de fetch
    fetchComisiones();
    fetchComisionesDolares();
    fetchDiferenciaSoles();
    fetchDiferenciaDolares();
    fetchCifraAnteriorSoles();
    fetchCifraAnteriorDolares();
  };

  const handleFilterClick = () => {
    handleFetchData(selectedYear); // Filtrar los datos basados en el año seleccionado
  };

  return (
    <div className="primasporaniocontainer PrimasSD">
     <div className='filtroPrimaSD '>
        <h3>Año</h3>
        <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <button className='buttonPrimaSD' onClick={handleFilterClick}>Filtrar</button>
      </div>
      <section className='primacomisiones'>
        {comisiones.map((anioData, index) => {
          // Encuentra los datos de dólares correspondientes al año actual
          const dolaresData = comisionesDolares.find(d => d.anio === anioData.anio) || {};

          return (
            <div key={index}>
              <ComisionCard
                title={`Total Comisión Soles`}
                total={`S/ ${anioData.total_comision_soles_anio}`}
                diferencia={`S/ ${diferenciaSoles}`}
                anterior={`S/ ${cifraAnteriorSoles}`}
                colorClass="ColorTotalSoles"
                />
                <ComisionCard
                title={`Total Comisión Dólares `}
                total={`$ ${dolaresData.total_comision_dolares_anio || 0}`}
                diferencia={`$ ${diferenciaDolares}`}
                anterior={`$ ${cifraAnteriorDolares}`}
                colorClass="ColorTotalDolares"
                />

            </div>
          );
        })}
      </section>
    </div>
  );
};

const ComisionCard = ({ title, total, diferencia, anterior, colorClass }) => {
 
    // Función para agregar comas y prefijo de moneda
    const formatCurrency = (value) => {
      // Extraer el número de la cadena, eliminando cualquier símbolo de moneda
      const number = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      
      // Verificar si el número es NaN (lo cual significa que no se pudo parsear)
      if (isNaN(number)) {
        return value; // Retorna el valor original si no se puede parsear
      }
      
      // Formatear el número con punto como separador decimal y coma como separador de miles
      const formattedNumber = number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      // Agregar el prefijo de moneda
      if (value.startsWith('S/')) {
        return `S/ ${formattedNumber}`;
      } else if (value.startsWith('$')) {
        return `$ ${formattedNumber}`;
      } else {
        return formattedNumber; // En caso de no tener prefijo, se devuelve solo el número formateado
      }
    };
  
    return (
      <div className={`PrimaCard ${colorClass}`}>
        <h3>{title}</h3>
        <strong>{formatCurrency(total)}</strong>
        <p>{formatCurrency(diferencia)} más que ayer</p>
        <span>Cifra del día anterior {formatCurrency(anterior)}</span>
      </div>
    );
  
  
}
  


export default ComisionesPorAnio;
