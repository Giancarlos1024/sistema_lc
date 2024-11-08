import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Snackbar, Alert } from '@mui/material';
import * as XLSX from 'xlsx';
import '../Css/FacturaBreve.css';

const FacturaBreve = () => {
  const [facturas, setFacturas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroFactura, setFiltroFactura] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [facturasPerPage, setFacturasPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/facturabreve`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFacturas(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFacturas();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-PE', options);
  };

  const handleFechaFilterChange = (event) => setFiltroFecha(event.target.value);
  const handleFacturaFilterChange = (event) => setFiltroFactura(event.target.value);
  const handleSortChange = (event) => setSortOrder(event.target.value);

  const exportToExcel = () => {
    const fileName = 'facturaBreve.xlsx';
    const worksheet = XLSX.utils.json_to_sheet(facturas.map(factura => ({
      Fecha: formatDate(factura.fecha),
      Mes: factura.mes,
      Factura: factura.factura,
      Compañia_de_Seguros: factura.cia_seguros,
      Dolares: factura.dolares,
      Soles: factura.soles,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Facturas');
    XLSX.writeFile(wb, fileName);

    setAlertMessage('Archivo descargado exitosamente');
    setAlertSeverity('success');
    setOpen(true);
  };

  const indexOfLastFactura = currentPage * facturasPerPage;
  const indexOfFirstFactura = indexOfLastFactura - facturasPerPage;

  const filteredFacturas = useMemo(() => {
    return facturas.filter(factura =>
      formatDate(factura.fecha).includes(filtroFecha) &&
      factura.factura.toLowerCase().includes(filtroFactura.toLowerCase())
    );
  }, [facturas, filtroFecha, filtroFactura]);

  const sortedFacturas = useMemo(() => {
    return [...filteredFacturas].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  }, [filteredFacturas, sortOrder]);

  const currentFacturas = useMemo(() => {
    return sortedFacturas.slice(indexOfFirstFactura, indexOfLastFactura);
  }, [sortedFacturas, indexOfFirstFactura, indexOfLastFactura]);

  const totalPages = useMemo(() => Math.ceil(filteredFacturas.length / facturasPerPage), [filteredFacturas.length, facturasPerPage]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = useMemo(() => {
    let pageNumbers = [];
    const maxPageButtons = 5;
    const halfMax = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(totalPages, currentPage + halfMax);

    if (currentPage - halfMax < 1) {
      endPage = Math.min(totalPages, endPage + (halfMax - (currentPage - 1)));
    }
    if (currentPage + halfMax > totalPages) {
      startPage = Math.max(1, startPage - ((currentPage + halfMax) - totalPages));
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        {startPage > 1 && (
          <>
            <button onClick={() => paginate(1)} className="arrow arrow2">1</button>
            {startPage > 2 && <span>...</span>}
          </>
        )}
       
        {pageNumbers}
       
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span>...</span>}
            <button onClick={() => paginate(totalPages)} className="arrow arrow2">{totalPages}</button>
          </>
        )}
      </>
    );
  }, [totalPages, currentPage]);

  return (
    <div className='GeneralDivFactura'>
      <div className='HeaderComisiones'>
        <div className='headerTop'>
          <h2 className='comisionesbrevesubtitulo'>Comisiones</h2>
          <p>Facturas - Comisiones</p>
        </div>

        <div className="filtrosTable">
          <section className='filtrosTablaFacturabreve'>
            <div className='buscadorFiltros' id='filtrobreve'>
              <img className='buscarIcon' src="/img/search.png" alt="error" />
              <input 
                className='buscardorinput'
                type="text" 
                id="filtroFactura" 
                value={filtroFactura} 
                placeholder='Buscar Factura'
                onChange={handleFacturaFilterChange} 
              />
            </div>
          </section>
          <section>
            <select 
              name="" 
              id="" 
              className='mostrarDatos' 
              onChange={handleSortChange}
              value={sortOrder}
            >
              <option value="asc">Más Antiguo</option>
              <option value="desc">Más Nuevo</option>
            </select>
          </section>
          <section className='containerDescargar' onClick={exportToExcel}>
            <img src="/img/Download.png" alt="error" />
            <button id='reporteExcelFacturabreve'>Descargar</button>
          </section>
        </div>
      </div>
      <table className='facturaTable'>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Mes</th>
            <th>Factura</th>
            <th>Compañia de Seguros</th>
            <th>Dólares</th>
            <th>Soles</th>
          </tr>
        </thead>
        <tbody>
          {currentFacturas.length > 0 ? (
            currentFacturas.map(factura => (
              <tr key={factura.id}>
                <td>{formatDate(factura.fecha)}</td>
                <td>{factura.mes}</td>
                <td>{factura.factura}</td>
                <td>{factura.cia_seguros}</td>
                <td>${factura.dolares}</td>
                <td>S/{factura.soles}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No se encontraron resultados</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Mostrando datos {filteredFacturas.length > 0 ? `1 al ${Math.min(facturasPerPage, filteredFacturas.length)}` : '0'} de {filteredFacturas.length} registros</p>
      <div className="pagination">
      <button
          className="arrow"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {renderPageNumbers}
        <button
          className="arrow"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FacturaBreve;
