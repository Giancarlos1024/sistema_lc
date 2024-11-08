import React, { useState, useEffect, useContext, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Snackbar, Alert } from '@mui/material';
import * as XLSX from 'xlsx';
import '../Css/FacturaTable.css';
import ModalFactura from './ModalFactura';

import TruncatedText from './TruncatedText'; // Importa el nuevo componente
import { UserContext } from '../Provider/UserContext';

const FacturaTable = () => {

  const { username } = useContext(UserContext); 
  


  const [facturas, setFacturas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [filtroFactura, setFiltroFactura] = useState('');
  const [filtroRecibo, setFiltroRecibo] = useState('');
  const [filtroLiquidacion, setFiltroLiquidacion] = useState('');
  const [selectedFactura, setSelectedFactura] = useState(null); 
  const [sortOrder, setSortOrder] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/facturas/datos`)
      .then(response => response.json())
      .then(data => {
        const facturasFormatted = data.map(factura => ({
          ...factura,
          fecha: new Date(factura.fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          }),
          fechaModificacion: new Date(factura.fechaModificacion).toLocaleString('es-PE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        }));
        
        setFacturas(facturasFormatted);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  const handleDownload = () => {
    const filteredFacturas = facturas.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(filteredFacturas);
    ws['!autofilter'] = { ref: 'A1:R1' };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas');
    const wscols = [
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
      { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    ];
    ws['!cols'] = wscols;
    XLSX.writeFile(wb, 'facturas.xlsx');

    setAlertMessage('Archivo descargado exitosamente');
    setAlertSeverity('success');
    setOpen(true);
  };

  const handleEdit = (factura) => {
    Swal.fire({
      title: '¿Estás seguro de que quieres editar esta factura?',
      text: "Esta acción permitirá que realices cambios en la factura seleccionada.",
      icon: 'question',
      showCancelButton: true,
     confirmButtonColor: '#81BB49',
      cancelButtonColor: '#B1B1B1',
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedFactura(factura);
      }
    });
  };

  const handleUpdate = (updatedFactura) => {
    const fechaModificacion = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
    const facturaConUsuario = {
      ...updatedFactura,
      usuarioLogin: username,
      fechaModificacion: fechaModificacion
    };
  
    fetch(`${apiBaseUrl}/api/facturas/actualizarfactura/${updatedFactura.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facturaConUsuario),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setFacturas(facturas.map(factura =>
        factura.id === updatedFactura.id ? facturaConUsuario : factura
      ));
      setAlertMessage('Factura actualizada exitosamente');
      setAlertSeverity('success');
      setOpen(true);
    })
    .catch(error => {
      setAlertMessage('Error al actualizar la factura');
      setAlertSeverity('error');
      setOpen(true);
    });
  };
  
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas eliminar esta factura?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#81BB49',
      cancelButtonColor: '#B1B1B1',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${apiBaseUrl}/api/facturas/eliminarfactura/${id}`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(() => {
            setFacturas(facturas.filter(factura => factura.id !== id));
            setAlertMessage('Factura eliminada exitosamente');
            setAlertSeverity('success');
            setOpen(true);
          })
          .catch(error => {
            console.error('Error:', error);
            setAlertMessage('Error al eliminar la factura');
            setAlertSeverity('error');
            setOpen(true);
          });
      }
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedFacturas = useMemo(() => {
    return [...facturas].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id - b.id; // Orden ascendente por ID
      } else if (sortOrder === 'desc') {
        return b.id - a.id; // Orden descendente por ID
      }
      return 0;
    });
  }, [facturas, sortOrder]);

  const currentItems = useMemo(() => {
    return sortedFacturas
      .filter((factura) =>
        (factura.factura || '').toLowerCase().includes(filtroFactura.toLowerCase()) &&
        (factura.recibo || '').toLowerCase().includes(filtroRecibo.toLowerCase()) &&
        (factura.liquidacion || '').toLowerCase().includes(filtroLiquidacion.toLowerCase())
      )
      .slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedFacturas, filtroFactura, filtroRecibo, filtroLiquidacion, indexOfFirstItem, indexOfLastItem]);

  const totalPages = useMemo(() => Math.ceil(facturas.length / itemsPerPage), [facturas.length]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const renderPageNumbers = useMemo(() => {
    let pageNumbers = [];
    const maxPageButtons = 5; // Número máximo de botones de página a mostrar
    const halfMax = Math.floor(maxPageButtons / 2);
  
    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(totalPages, currentPage + halfMax);
  
    // Ajustar el rango si hay espacio en los extremos
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
            <button onClick={() => paginate(1)} className="arrow">1</button>
            {startPage > 2 && <span>...</span>}
          </>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span>...</span>}
            <button onClick={() => paginate(totalPages)} className="arrow">{totalPages}</button>
          </>
        )}
      </>
    );
  }, [totalPages, currentPage]);

  const handleChangeFiltro = (event) => {
    setFiltroFactura(event.target.value);
  };

  const handleChangeFiltroRecibo = (event) => { 
    setFiltroRecibo(event.target.value);
  };

  const handleChangeFiltroLiquidacion = (event) => {
    setFiltroLiquidacion(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
  
  return (
    <div className="header-container">
      <div className="headerFacturaTop">
        <div className="fila-detalleFactura">
          <h2 className='comisionesbrevesubtitulo'>Todas las Facturas</h2>
          <p>Detalle de Factura</p>
        </div>
        <div className="fila-detalleFactura2">
          <div className="fila-TopButton">
            <section>
              <select name="" id="" className="mostrarDatos" onChange={handleSortChange}>
                <option value="desc">Mas Nuevo</option>
                <option value="asc">Mas Antiguo</option>
              </select>
            </section>
            <section className="containerDescargar" onClick={handleDownload}>
              <img src="/img/Download.png" alt="error" />
              <button id="reporteExcelFacturabreve">Descargar</button>
            </section>
          </div>
          <div className="fila-BotButton">
            <section className="filtrosTablaFacturabreve">
              <div className="buscadorFiltros">
                <img className="buscarIcon" src="/img/search.png" alt="error" />
                <input 
                  className="buscardorinput"
                  type="text"
                  id="filtroFactura"
                  placeholder="Buscar Factura"
                  value={filtroFactura}
                  onChange={handleChangeFiltro}
                />
              </div>
            </section>
            <section className="filtrosTablaFacturabreve">
              <div className="buscadorFiltros">
                <img className="buscarIcon" src="/img/search.png" alt="error" />
                <input 
                  className="buscardorinput"
                  type="text"
                  id="filtroRecibo"
                  placeholder="Buscar Recibo"
                  value={filtroRecibo}
                  onChange={handleChangeFiltroRecibo}
                />
              </div>
            </section>
            <section className="filtrosTablaFacturabreve">
              <div className="buscadorFiltros">
                <img className="buscarIcon" src="/img/search.png" alt="error" />
                <input 
                  className="buscardorinput"
                  type="text"
                  id="filtroLiquidacion"
                  placeholder="Buscar Liquidación"
                  value={filtroLiquidacion}
                  onChange={handleChangeFiltroLiquidacion}
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }} className='containerTable'>
        <table className="datosTable">
          <thead>
            <tr>
              <th>Oficina</th>
              <th>Factura</th>
              <th>Liquidación</th>
              <th>Fecha</th>
              <th>Mes</th>
              <th>Póliza</th>
              <th>Recibo</th>
              <th>Compañía</th>
              <th>Código Ramo</th>
              <th>Ramo SBS</th>
              <th>Ramo Compañía</th>
              <th>Asegurado</th>
              <th>Prima Dólares</th>
              <th>Comisión Dólares</th>
              <th>Prima Soles</th>
              <th>Comisión Soles</th>
              <th>Usuario</th>
              <th>Fecha Modificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((factura, index) => (
              <tr key={factura.id || index}>
                <td>{factura.oficina}</td>
                <td>{factura.factura}</td>
                <td>{factura.liquidacion}</td>
                <td>{factura.fecha}</td>
                <td>{factura.mes}</td>
                <td>{factura.poliza}</td>
                <td>{factura.recibo}</td>
                <td>{factura.cia_compania}</td>
                <td>{factura.cod_ramo}</td>
                <td>
                  <TruncatedText text={factura.ramo_sbs} maxLength={10} /> 
                </td>
                <td>
                  <TruncatedText text={factura.ramo_cia} maxLength={10} /> 
                </td>
                <td>
                  <TruncatedText text={factura.asegurado} maxLength={10} />
                </td>
                <td>${factura.prima_dol}</td>
                <td>${factura.com_dol}</td>
                <td>S/{factura.prima_soles}</td>
                <td>S/{factura.com_soles}</td>
                <td>{factura.usuarioLogin}</td>
                <td>{factura.fechaModificacion}</td>
                <td>
                  <img className='buttonImg' src="/img/editar.png" alt="error" onClick={() => handleEdit(factura)} />
                  <img className='buttonImg' src="/img/tachobasura.png" alt="error" onClick={() => handleDelete(factura.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>Mostrando datos {indexOfFirstItem + 1} al {indexOfLastItem} de {facturas.length} registros</p>
        
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
      <ModalFactura
        open={!!selectedFactura}
        onClose={() => setSelectedFactura(null)}
        factura={selectedFactura}
        onSave={handleUpdate}
      />

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

export default FacturaTable;
