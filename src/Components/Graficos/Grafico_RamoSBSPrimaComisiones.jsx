import React, { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../../Css/Grafico_PrimaSoles.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export const Grafico_RamoSBSPrimaComisiones = () => {
    const [dataSoles, setDataSoles] = useState([]);
    const [years, setYears] = useState([]);
    const [ramoSBSs, setRamoSBSs] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedRamoSBS, setSelectedRamoSBS] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [maxY, setMaxY] = useState(50000);


    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const yearResponse = await fetch(`${apiBaseUrl}/graficosramosbs/available-years`);
                const yearData = await yearResponse.json();
                setYears(yearData);

                const currentYear = new Date().getFullYear();
                if (yearData.includes(currentYear)) {
                    setSelectedYear(currentYear.toString());
                }

                const ramoSBSResponse = await fetch(`${apiBaseUrl}/graficosramosbs/available-ramo-sbs`);
                const ramoSBSData = await ramoSBSResponse.json();
                setRamoSBSs(ramoSBSData);
                
                fetchData(currentYear.toString());
            } catch (error) {
                console.error('Error fetching metadata:', error);
            }
        };

        fetchMetadata();
    }, []);

    useEffect(() => {
        if (selectedYear && selectedRamoSBS) {
            const fetchMonths = async () => {
                try {
                    const response = await fetch(`${apiBaseUrl}/graficosramosbs/available-months?year=${selectedYear}&ramo_sbs=${selectedRamoSBS}`);
                    const data = await response.json();
                    setMonths(data);
                } catch (error) {
                    console.error('Error fetching months:', error);
                }
            };
            fetchMonths();
        } else {
            setMonths([]);
        }
    }, [selectedYear, selectedRamoSBS]);

    const fetchData = async (year = selectedYear, month = selectedMonth) => {
        try {
            let url = `${apiBaseUrl}/graficosramosbs/ramosbsprimasoles`;
            const params = [];
            if (year) params.push(`year=${year}`);
            if (selectedRamoSBS) params.push(`ramo_sbs=${selectedRamoSBS}`);
            if (month) params.push(`month=${month}`);
            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setDataSoles(data);

            const maxDataValue = Math.max(
                ...data.map(item => item.total_prima_soles),
                ...data.map(item => item.total_comision_soles)
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
            return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (typeof value === 'string') {
            const number = parseFloat(value.replace(/[^0-9.-]+/g, ''));
            if (isNaN(number)) {
                return value; // Retorna el valor original si no se puede parsear
            }
            return `S/ ${number.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return value; // En caso de tipo inesperado, devuelve el valor original
    };

    const chartDataSoles = useMemo(() => {
        if (dataSoles.length === 0) {
            return {
                labels: [],
                datasets: [],
            };
        }
        const getMonthName = (monthNumber) => {
            return new Date(2020, monthNumber - 1).toLocaleString('es-ES', { month: 'long' });
        };

        return {
            labels: dataSoles.map(item => 
                selectedRamoSBS && item.mes 
                    ? getMonthName(item.mes)  // Usa el nombre del mes en lugar del número
                    : getInitials(item.RamoSBS)  // Usa las iniciales del nombre del ramo en el eje X
            ),
            datasets: [
                {
                    label: 'Prima Soles',
                    data: dataSoles.map(item => item.total_prima_soles),
                    backgroundColor: '#81BB49',
                    borderColor: '#81BB49',
                    borderWidth: 1,
                },
                {
                    label: 'Comisiones Soles',
                    data: dataSoles.map(item => item.total_comision_soles),
                    backgroundColor: '#38519E',
                    borderColor: '#38519E',
                    borderWidth: 1,
                },
            ],
        };
    }, [dataSoles, selectedRamoSBS]);

    const handleFilterClick = () => {
        fetchData();
    };

    return (
        <div className="grafico-container RamoSBSGrafico">
            <div className="select-container">
                <label>
                    Año:
                    <select 
                        onChange={(e) => setSelectedYear(e.target.value)} 
                        value={selectedYear}
                    >
                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </label>

                <label>
                    Ramo SBS:
                    <select 
                        onChange={(e) => setSelectedRamoSBS(e.target.value)} 
                        value={selectedRamoSBS}
                    >
                        <option value="">Todos</option>
                        {ramoSBSs.map(ramo => <option key={ramo} value={ramo}>{ramo}</option>)}
                    </select>
                </label>

                <label>
                    Mes:
                    <select 
                        onChange={(e) => setSelectedMonth(e.target.value)} 
                        value={selectedMonth}
                        disabled={!selectedRamoSBS}
                    >
                        <option value="">Todos</option>
                        {months.map(month => (
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
                data={chartDataSoles}
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
                            text: 'PRODUCCIÓN PRIMA Y COMISION EN SOLES POR RAMO SBS',
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
                                    return dataSoles[index].RamoSBS; // Muestra el nombre completo del ramo en el tooltip
                                },
                                label: (tooltipItem) => {
                                    return `${tooltipItem.dataset.label}: ${formatCurrency(tooltipItem.raw)}`;
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
                                callback: (value) => formatCurrency(value),
                                font: {
                                    size: 8,
                                    family: 'Arial',
                                    weight: 'bold',
                                },
                            },
                            grid: {
                                borderColor: '#eee',
                                borderWidth: 1,
                                drawBorder: false,
                            },
                        },
                    },
                }}
            />
        </div>
    );
};
