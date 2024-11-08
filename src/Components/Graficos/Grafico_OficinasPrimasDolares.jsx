import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../../Css/Grafico_PrimaSoles.css'; // Importa el archivo CSS

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

export const Grafico_OficinasPrimasDolares = () => {
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [years, setYears] = useState([]);
  const [offices, setOffices] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [maxY, setMaxY] = useState(50000);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


  useEffect(() => {
    fetch(`${apiBaseUrl}/graficosoficinasdolares/available-yearsdolares`)
      .then(response => response.json())
      .then(data => {
        setYears(data);
      })
      .catch(error => console.error("Error fetching years: ", error));

    fetch(`${apiBaseUrl}/graficosoficinasdolares/available-officesdolares`)
      .then(response => response.json())
      .then(data => {
        const normalizedOffices = [...new Set(data.map(office => office.trim()))];
        setOffices(normalizedOffices);
      })
      .catch(error => console.error("Error fetching offices: ", error));

    fetch(`${apiBaseUrl}/graficosoficinasdolares/available-monthsdolares`)
      .then(response => response.json())
      .then(data => {
        setMonths(data);
      })
      .catch(error => console.error("Error fetching months: ", error));

    fetchData(currentYear, '', '');
  }, []);

  const fetchData = (year = selectedYear, office = selectedOffice, month = selectedMonth) => {
    let url = `${apiBaseUrl}/graficosoficinasdolares/oficionasgraficodolares`;
    const params = [];
    if (year) params.push(`year=${year}`);
    if (office) params.push(`office=${encodeURIComponent(office.trim())}`);
    if (month) params.push(`month=${month}`);

    if (params.length > 0) url += `?${params.join('&')}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const uniqueOffices = [...new Set(data.map(item => item.oficina))];
        const uniqueYears = [...new Set(data.map(item => item.año))];

        const colors = ['#81BB49', '#38519E'];

        const datasets = uniqueYears.map((year, index) => {
          return [
            {
              label: `Prima Dólares`,
              data: uniqueOffices.map(office => {
                const item = data.find(d => d.oficina === office && d.año === year);
                return item ? item.total_prima_dolares || 0 : 0;
              }),
              backgroundColor: colors[0].replace('1)', '0.5)'),
              borderColor: colors[0],
              borderWidth: 1
            },
            {
              label: `Comisiones Dólares`,
              data: uniqueOffices.map(office => {
                const item = data.find(d => d.oficina === office && d.año === year);
                return item ? item.total_com_dolares || 0 : 0;
              }),
              backgroundColor: colors[1].replace('1)', '0.5)'),
              borderColor: colors[1],
              borderWidth: 1
            }
          ];
        }).flat();

        const maxDataValue = Math.max(
          ...datasets.flatMap(dataset => dataset.data)
        );

        setMaxY(Math.ceil(maxDataValue * 1.1));

        setChartData({
          labels: uniqueOffices,
          datasets
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  };

  const handleFilterClick = () => {
    fetchData(selectedYear, selectedOffice, selectedMonth);
  };

  return (
    <>
      <div className="grafico-container">
        <div className="select-container">
          <label>
            Año:
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
          <label>
            Oficina:
            <select value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
              <option value="">Todas</option>
              {offices.map(office => (
                <option key={office} value={office}>{office}</option>
              ))}
            </select>
          </label>
          <label>
            Mes:
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={!selectedOffice}
            >
              <option value="">Todos</option>
              {months.map(month => {
                const date = new Date(0);
                date.setUTCMonth(month - 1);
                return (
                  <option key={month} value={month}>
                    {date.toLocaleString('default', { month: 'long', timeZone: 'UTC' })}
                  </option>
                );
              })}
            </select>
          </label>
          <button id='buttonGrafico' onClick={handleFilterClick}>Filtrar</button>
        </div>
        <Bar
          className='ContainerPrimaSoles'
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: {
                    size: 8,
                    family: 'Arial',
                    weight: 'bold'
                  }
                }
              },
              title: {
                display: true,
                text: 'PRODUCCIÓN PRIMAS Y COMISIONES DÓLARES POR OFICINA',
                font: {
                  size: 9,
                  family: 'Arial',
                  weight: 'bold'
                }
              },
              tooltip: { // Configuración del tooltip
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += `$ ${context.parsed.y.toLocaleString()}`;
                    }
                    return label;
                  }
                }
              },
              datalabels: {
                color: '#444',
                display: false,
                anchor: 'center',
                align: 'top',
                formatter: (value) => `$ ${value.toLocaleString()}`,
                font: {
                  size: 8,
                  family: 'Arial',
                  weight: 'bold'
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 7,
                    family: 'Arial',
                    weight: 'bold'
                  }
                },
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                max: maxY,
                ticks: {
                  callback: function(value) {
                    return `$ ${value.toLocaleString()}`;
                  },
                  font: {
                    size: 8,
                    family: 'Arial',
                    weight: 'bold'
                  }
                },
                grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  drawBorder: false
                }
              }
            }
          }}
        />
      </div>
    </>
  );
};
