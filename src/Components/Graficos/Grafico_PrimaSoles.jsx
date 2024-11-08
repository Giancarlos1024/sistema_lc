import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../../Css/Grafico_PrimaSoles.css'; // Importa el archivo CSS

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

export const Grafico_PrimaSoles = () => {
    const currentYear = new Date().getFullYear();
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Prima Soles',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Comisiones Soles',
                data: [],
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }
        ]
    });

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState('');
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [maxY, setMaxY] = useState(50000);

    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];


    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const fetchData = () => {
        let url = `${apiBaseUrl}/graficos/graficoprimasoles`;
        const params = [];
        if (year) params.push(`year=${year}`);
        if (month) params.push(`month=${month}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Solo extraer el mes para las etiquetas del eje X
                const labels = data.map(item => monthNames[item.mes - 1]);
                const totalPrimaSoles = data.map(item => item.total_prima_soles);
                const totalComSoles = data.map(item => item.total_com_soles);
               
                const maxDataValue = Math.max(...totalPrimaSoles, ...totalComSoles);
                setMaxY(Math.ceil(maxDataValue * 1.1));

                const newChartData = {
                    labels,
                    datasets: [
                        {
                            label: 'Prima Soles',
                            data: totalPrimaSoles,
                            backgroundColor: '#81BB49',
                            borderColor: '#81BB49',
                            borderWidth: 1
                        },
                        {
                            label: 'Comisiones Soles',
                            data: totalComSoles,
                            backgroundColor: '#38519E',
                            borderColor: '#38519E',
                            borderWidth: 1
                        }
                    ]
                };

                setChartData(newChartData);
            })
            .catch(error => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetch(`${apiBaseUrl}/graficos/available-years`)
            .then(response => response.json())
            .then(data => setAvailableYears(data))
            .catch(error => console.error("Error fetching available years:", error));

        fetch(`${apiBaseUrl}/graficos/available-months`)
            .then(response => response.json())
            .then(data => setAvailableMonths(data))
            .catch(error => console.error("Error fetching available months:", error));
    }, []);

    return (
        <div className="grafico-container">
            <div className="select-container">
                <label>
                    Año:
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        {availableYears.map((y) => (
                            <option key={y.año} value={y.año}>{y.año}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Mes:
                    <select value={month} onChange={(e) => setMonth(e.target.value)}>
                        <option value="">Todos</option>
                        {availableMonths.map((m) => (
                            <option key={m.mes} value={m.mes}>{monthNames[m.mes - 1]}</option> // Convertir mes a nombre
                        ))}
                    </select>
                </label>
                <button onClick={fetchData}>Filtrar</button>
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
                text: 'PRODUCCIÓN PRIMA Y COMISIÓN EN SOLES POR MESES',
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
                            label += `S/ ${context.parsed.y.toLocaleString()}`;
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                color: '#444',
                display: false,
                anchor: 'end',
                align: 'top',
                formatter: (value) => `S/ ${value.toLocaleString()}`,
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
                        size: 8,
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
                    callback: (value) => `S/ ${value.toLocaleString()}`, // Formatear las etiquetas del eje Y
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
    );
};
