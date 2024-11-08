import React, { useEffect, useState } from 'react';

const PrimasPorAnio = () => {
  const [primas, setPrimas] = useState([]);
  const [primasDolares, setPrimasDolares] = useState([]);
  const [diferenciaSoles, setDiferenciaSoles] = useState(0);
  const [diferenciaDolares, setDiferenciaDolares] = useState(0);
  const [cifraAnteriorSoles, setCifraAnteriorSoles] = useState({});
  const [cifraAnteriorDolares, setCifraAnteriorDolares] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba/available-years`);
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
    const fetchPrimas = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba/anio?anio=${year}`);
        const data = await response.json();
        setPrimas(data);
      } catch (error) {
        console.error('Error fetching data (primas):', error);
      }
    };

    const fetchPrimasDolares = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba/aniodolares?anio=${year}`);
        const dataDolares = await response.json();
        setPrimasDolares(dataDolares);
      } catch (error) {
        console.error('Error fetching data (dolares):', error);
      }
    };

    const fetchDiferenciaSoles = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba/diferenciadia?anio=${year}`);
        const data = await response.json();
        setDiferenciaSoles(data.diferencia);
      } catch (error) {
        console.error('Error fetching difference for soles:', error);
      }
    };

    const fetchDiferenciaDolares = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba/diferenciadiadolares?anio=${year}`);
        const data = await response.json();
        setDiferenciaDolares(data.diferencia);
      } catch (error) {
        console.error('Error fetching difference for dollars:', error);
      }
    };

    const fetchCifraAnteriorSoles = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba/cifraanteriortotal?anio=${year}`);
        const data = await response.json();
        setCifraAnteriorSoles(data);
      } catch (error) {
        console.error('Error fetching previous day data for soles:', error);
      }
    };

    const fetchCifraAnteriorDolares = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/prueba/cifraanteriortotaldolares?anio=${year}`);
        const data = await response.json();
        setCifraAnteriorDolares(data);
      } catch (error) {
        console.error('Error fetching previous day data for dollars:', error);
      }
    };

    // Ejecutar todas las funciones de fetch
    fetchPrimas();
    fetchPrimasDolares();
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
      <div className='filtroPrimaSD'>
        <h3>Año</h3>
        <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <button className='buttonPrimaSD' onClick={handleFilterClick}>Filtrar</button>
      </div>
      <section className='primacomisiones'>
        {primas.map((anioData, index) => {
          // Encuentra los datos de dólares correspondientes al año actual
          const dolaresData = primasDolares.find(d => d.anio === anioData.anio) || {};

          return (
            <div key={index}>
              <PrimaCard
                title={`Total Prima Soles`}
                total={`S/ ${anioData.total_prima_soles_anio || 0}`}
                diferencia={`S/ ${diferenciaSoles}`}
                anterior={`S/ ${cifraAnteriorSoles.total_prima_soles_dia || 0}`}
                colorClass="ColorTotalSoles"
              />
              <PrimaCard
                title={`Total Prima Dólares`}
                total={`$ ${dolaresData.total_prima_dolares_anio || 0}`}
                diferencia={`$ ${diferenciaDolares}`}
                anterior={`$ ${cifraAnteriorDolares.total_prima_dolares_dia || 0}`}
                colorClass="ColorTotalDolares"
              />
            </div>
          );
        })}
      </section>
    </div>
  );
};

const PrimaCard = ({ title, total, diferencia, anterior, colorClass }) => {
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
};

export default PrimasPorAnio;
