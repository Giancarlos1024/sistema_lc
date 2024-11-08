import React, { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../../Css/Grafico_PrimaSoles.css'; // Asegúrate de que este archivo tenga los estilos necesarios

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export const Grafico_RamoSBSPrimaComisionesDolares = () => {
  const [dataDolares, setDataDolares] = useState([]);
  const [years2, setYears2] = useState([]);
  const [ramoSBSs2, setRamoSBSs2] = useState([]);
  const [months2, setMonths2] = useState([]);
  const [selectedYear2, setSelectedYear2] = useState('');
  const [selectedRamoSBS2, setSelectedRamoSBS2] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [maxY, setMaxY] = useState(50000);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchMetadata2 = async () => {
      try {
        const yearResponse = await fetch(`${apiBaseUrl}/graficosramosbsdolares/available-yearsdolares`);
        const yearData2 = await yearResponse.json();
        setYears2(yearData2);

        const currentYear = new Date().getFullYear();
        if (yearData2.includes(currentYear)) {
          setSelectedYear2(currentYear.toString());
        }

        const ramoSBSResponse = await fetch(`${apiBaseUrl}/graficosramosbsdolares/available-ramo-sbsdolares`);
        const ramoSBSData = await ramoSBSResponse.json();
        setRamoSBSs2(ramoSBSData);

        fetchData2(currentYear.toString());
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata2();
  }, []);

  useEffect(() => {
    if (selectedYear2 && selectedRamoSBS2) {
      const fetchMonths2 = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/graficosramosbsdolares/available-monthsdolares?year=${selectedYear2}&ramo_sbs=${selectedRamoSBS2}`);
          const data = await response.json();
          setMonths2(data);
        } catch (error) {
          console.error('Error fetching months2:', error);
        }
      };
      fetchMonths2();
    } else {
      setMonths2([]);
    }
  }, [selectedYear2, selectedRamoSBS2]);

  const fetchData2 = async (year = selectedYear2, month = selectedMonth) => {
    try {
      let url = `${apiBaseUrl}/graficosramosbsdolares/ramosbsprimadolares`;
      const params = [];
      if (year) params.push(`year=${year}`);
      if (selectedRamoSBS2) params.push(`ramo_sbs=${selectedRamoSBS2}`);
      if (month) params.push(`month=${month}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setDataDolares(data);

      const maxDataValue = Math.max(
        ...data.map(item => item.total_prima_dolares),
        ...data.map(item => item.total_com_dolares)
      );
      setMaxY(Math.ceil(maxDataValue * 1.1));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getInitials = (text) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  const formatCurrency = (value) => {
    if (typeof value === 'number') {
      const formattedNumber = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `S/ ${formattedNumber}`;
    } else if (typeof value === 'string') {
      const number = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      if (isNaN(number)) {
        return value; // Retorna el valor original si no se puede parsear
      }
      const formattedNumber = number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `S/ ${formattedNumber}`;
    }
    return value; // En caso de tipo inesperado, devuelve el valor original
  };

  const chartDataDolares = useMemo(() => {
    if (dataDolares.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const getMonthName = (monthNumber) => {
      return new Date(2020, monthNumber - 1).toLocaleString('es-ES', { month: 'long' });
    };

    return {
      labels: dataDolares.map(item => 
        selectedRamoSBS2 && item.mes 
          ? getMonthName(item.mes)  // Usa el nombre del mes en lugar del número
          : getInitials(item.RamoSBS)  // Usa las iniciales del nombre del ramo en el eje X
      ),
      datasets: [
        {
          label: 'Prima Dólares',
          data: dataDolares.map(item => item.total_prima_dolares),
          backgroundColor: '#81BB49',
          borderColor: '#81BB49',
          borderWidth: 1,
        },
        {
          label: 'Comisiones Dólares',
          data: dataDolares.map(item => item.total_com_dolares),
          backgroundColor: '#38519E',
          borderColor: '#38519E',
          borderWidth: 1,
        },
      ],
    };
  }, [dataDolares, selectedRamoSBS2]);

  const handleFilterClick = () => {
    fetchData2();
  };

  return (
    <div className="grafico-container RamoSBSGrafico">
      <div className="select-container">
        <label>
          Año:
          <select 
            onChange={(e) => setSelectedYear2(e.target.value)} 
            value={selectedYear2}
          >
            {years2.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>

        <label>
          Ramo SBS:
          <select 
            onChange={(e) => setSelectedRamoSBS2(e.target.value)} 
            value={selectedRamoSBS2}
          >
            <option value="">Todos</option>
            {ramoSBSs2.map(ramo => <option key={ramo} value={ramo}>{ramo}</option>)}
          </select>
        </label>

        <label>
          Mes:
          <select 
            onChange={(e) => setSelectedMonth(e.target.value)} 
            value={selectedMonth}
            disabled={!selectedRamoSBS2}
          >
            <option value="">Todos</option>
            {months2.map(month => (
              <option key={month} value={month.toString().padStart(2, '0')}>
                {new Date(2020, month - 1).toLocaleString('es-ES', { month: 'long' })} 
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleFilterClick}>Filtrar</button>
      </div>

      <Bar
        className='ContainerPrimaSoles'
        data={chartDataDolares}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 8,
                  family: 'Arial',
                  weight: 'bold',
                },
              },
            },
            title: {
              display: true,
              text: 'PRODUCCIÓN PRIMA Y COMISION EN DÓLARES POR RAMO SBS',
              font: {
                size: 9,
                family: 'Arial',
                weight: 'bold',
              },
            },
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  const index = tooltipItems[0].dataIndex;
                  return dataDolares[index].RamoSBS; // Muestra el nombre completo del ramo en el tooltip
                },
                label: (tooltipItem) => {
                  return `${tooltipItem.dataset.label}: ${formatCurrency(tooltipItem.raw)}`; // Usa formatCurrency para el valor
                },
              },
            },
            datalabels: {
              color: '#444',
              display: false,
              anchor: 'end',
              align: 'top',
              formatter: (value) => formatCurrency(value),
              font: {
                size: 8,
                family: 'Arial',
                weight: 'bold',
              },
            },
          },
          scales: {
            x: {
              stacked: false,
              ticks: {
                font: {
                  size: 8,
                  family: 'Arial',
                  weight: 'bold',
                },
              },
              grid: {
                display: false,
              },
            },
            y: {
              stacked: false,
              beginAtZero: true,
              max: maxY,
              ticks: {
                callback: (value) => formatCurrency(value), // Usa formatCurrency para el eje Y
                font: {
                  size: 8,
                  family: 'Arial',
                  weight: 'bold',
                },
              },
              grid: {
                borderColor: '#eee',
                borderWidth: 1,
              },
            },
          },
        }}
      />
    </div>
  );
};
