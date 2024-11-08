import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importa Swal
import '../Css/ModalFactura.css';

const ModalFactura = ({ open, onClose, factura, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    try {
      if (factura && factura.fecha) {
        const fecha = factura.fecha;
        const [day, month, year] = fecha.split('/').map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          setFormData({ ...factura, fecha: formattedDate });
        } else {
          // Si fecha no está en el formato esperado, puedes manejar el error aquí
          // console.error('Formato de fecha no válido:', fecha);
          setFormData(factura || {});
        }
      } else {
        setFormData(factura || {});
      }
    } catch (error) {
      console.error('Error al procesar la fecha:', error);
    }
  }, [factura]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'fecha') {
      const [year, month, day] = value.split('-').map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
        const mes = new Date(value).toLocaleString('default', { month: 'long' });
        setFormData({
          ...formData,
          [name]: value,
          mes
        });
      } else {
        console.error('Formato de fecha no válido:', value);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value.trim()
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      title: '¿Guardar cambios?',
      text: '¿Estás seguro de que quieres guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#81BB49',
      cancelButtonColor: '#B1B1B1',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onSave(formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Datos modificados correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          setFormData({});
          onClose();
        });
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cancelar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#81BB49',
      cancelButtonColor: '#B1B1B1',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, regresar'
    }).then((result) => {
      if (result.isConfirmed) {
        onClose();
      }
    });
  };

  const handleAseguradoChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.toUpperCase(),
    }));
  };


  if (!open) return null;

  const oficinas = ['LIMA', 'ICA', 'CHICLAYO', 'PIURA', 'TRUJILLO', 'CUSCO','PISCO','VACIO'];
  const companias = ['MP', 'MP EPS', 'PPS', 'PPS EPS', 'LP', 'LPV', 'LP EPS', 'RIMAC', 'RIMAC EPS',
                    'PROTECTA', 'SANITAS', 'CRECER', 'CHUBB', 'QUALITAS', 'SECREX', 'AVLA',
                    'LIBERTY', 'OTROS'];

  const codRamos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
  const ramoSbs2 = ['Incendio y Lineas Aliadas', 'Lucro Cesante', 'Automoviles','Domiciliario','Ramos Tecnicos',
    'Robo y Asalto','Deshonestidad','Responsabilidad Civil','Cauciones (Fianzas) y Credito',
    'Transporte y Casco Maritimo','Otros Riesgos Generales','Accidentes Personales',
    'Asistencia Medica','Soat','Multiseguros','Vida','Vida Obligatorios','Otros'
    ];
  const monedas = ['Dólares', 'Soles'];

  const ramoCia2 = ['3D','Accidente de Trabajo y Enfermedades','Accidentes Colectivos',
  'Accidentes de Trabajo - Pensiones','Accidentes Personales','ADELANTO',
  'Agrario','AJUSTES','AMCO','AMED','Anticipo','Anulada','Asistencia Medica',
  'Asistencia Medica Familiar','Asistencia Viaje','Auto Modular','Automóviles Planes',
  'Automóviles Soat','Aviso de Cobranza Crecer S.A','Aviso de Cobranza Protecta S.A',
  'Bono','Canc','CANN','CAR','Cauciones','Comision Anual','Comisiones','Comisiones Especiales',
  'Construcción','Cuota Crecer  Seguros S.A','Cuota Protecta S.A','Cuota Sanitas Perú S.A',
  'Desgravamen','Desgravamen Hipotecario','Deshonestidad','Deshonestidad Comprensiva',
  'Deshonestidad Nominada','DIFERENCIA','Domiciliario','Embarcaciones','Eps','Equipo de Contratistas',
  'Formacion Laboral','Fullsalud','Hogar Individual','Incendio','Incendio Bancos','Incendio Multiriesgo',
  'Incendio Multiriesgos','JURI','Linea de Auto Personal','Mapfre Empresarial','Mapfre Empresas',
  'Mapfre Proteccion-T Individual','Medicina Nacional','Multiesgo','Multiriesgo del Hogar',
  'Multiriesgo Hidrocarburo','Multiriesgos',' Multiriesgos Hidrocarburos','Multisalud','Multiseguros',
  'Nota de Crédito','Nota de Crédito Crecer Seguros S.A','Nota de Crédito Sanitas Perú S.A',
  'Onco Integral','Otros Planes','Para Ti Familia','Plan Regular','Polizas de Transportes','Potestativo Corporativo',
  'Potestativo Familiar','Proforma Sanitas Perú S.A','Prorrogas','RAMO CIA','Responsabilidad Civil',
  'Robo','Robo y Asalto','ROMA','SALDO','Saldo Anterior','Salud','Salud Red','Salud Red Preferencial',
  'Sctr','Sctr Pensiones','Sctr Salud','SECO','Seg. Cred. A la Exportacion','Seguro de Salud','Seguro Patrimonial',
  'Soat','Transp.Maritimo/Aereo','Transporte Flota','Transporte Terrestre','Transportes','TREC','Trin','Vehiculos','Vida Inversion Oro Soles',
  'Vida Ley D.L. 688','VTHD','Web Vehiculos','Vacías'

  ]
  const ramoCia = ramoCia2.map(elemento => elemento.toUpperCase());

  const ramoSbs = ramoSbs2.map(elemento => elemento.toUpperCase());

  return (
    <div className="modal-container">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2 className='tituloModal'>Modificar Detalle de Factura</h2>
        <form onSubmit={handleSubmit} className='modalForm'>
          <div className="fila2">
            <div className="form-group2">
              <label className='labelFormModul' >PÓLIZA</label>
              <input className='form-input2' type="text" name="poliza" value={formData.poliza || ''} onChange={handleChange} />
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>FACTURA</label>
              <input className='form-input2' type="text" name="factura" value={formData.factura || ''} onChange={handleChange} />
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>LIQUIDACIÓN</label>
              <input className='form-input2' type="text" name="liquidacion" value={formData.liquidacion || ''} onChange={handleChange} />
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>RECIBO</label>
              <input className='form-input2' type="text" name="recibo" value={formData.recibo || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="fila2">
            <div className="form-group2">
              <label className='labelFormModul'>OFICINA</label>
              <select className='form-input2' name="oficina" value={formData.oficina || ''} onChange={handleChange}>
                <option value="">Seleccione</option>
                {oficinas.map((oficina, index) => (
                  <option key={index} value={oficina}>{oficina}</option>
                ))}
              </select>
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>FECHA</label>
              <input className='form-input2' type="date" name="fecha" value={formData.fecha || ''} onChange={handleChange} required />

            </div>
            <div className="form-group2">
              <label className='labelFormModul'>MES</label>
              <input className='form-input2' type="text" name="mes" value={formData.mes || ''} readOnly />
            </div>
          </div>
          <div className="fila2">
            <div className="form-group2">
              <label className='labelFormModul'>COMPAÑÍA ASEGURADORA</label>
              <select className='form-input2' name="cia_compania" value={formData.cia_compania || ''} onChange={handleChange}>
                <option value="">Seleccione</option>
                {companias.map((compania, index) => (
                  <option key={index} value={compania}>{compania}</option>
                ))}
              </select>
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>CÓDIGO DE RAMO</label>
              <select className='form-input2' name="cod_ramo" value={formData.cod_ramo || ''} onChange={handleChange}>
                <option value="">Seleccione</option>
                {codRamos.map((ramo, index) => (
                  <option key={index} value={ramo}>{ramo}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className='ingresarLabelFactura labelFormModul'>RAMO ASEGURADORA</label>
              <select id='form-select' className='form-input' name="ramo_cia" value={formData.ramo_cia} onChange={handleChange} >
                <option value="">Seleccione</option>
                {ramoCia.map((ramoAseguradora, index) => (
                  <option key={index} value={ramoAseguradora}>{ramoAseguradora}</option>
                ))}
              </select>
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>RAMO SBS</label>
              <select className='form-input2' name="ramo_sbs" value={formData.ramo_sbs || ''} onChange={handleChange}>
                <option value="">Seleccione</option>
                {ramoSbs.map((sbs, index) => (
                  <option key={index} value={sbs}>{sbs}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="fila2">
            <div className="form-group2">
              <label className='labelFormModul'>ASEGURADO</label>
              <input 
              id='inputAsegurado2' 
              className='form-input2' 
              type="text" 
              name="asegurado" 
              value={formData.asegurado || ''}
              onChange={handleAseguradoChange}
            />
             
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>MONEDA</label>
              <select className='form-input2' name="moneda" value={formData.moneda || ''} onChange={handleChange}>
                {monedas.map((mon, index) => (
                  <option key={index} value={mon}>{mon}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="fila2">
            <div className="form-group2">
              <label className='labelFormModul'>PRIMA SOLES</label>
              <input className='form-input2 no-spinner'
                type="number"
                step="0.01"
                name="prima_soles"
                value={formData.prima_soles || ''}
                onChange={handleChange}
                id={formData.moneda !==  'Soles' ? 'active-border':''}
                disabled={formData.moneda !== 'Soles'}
              />
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>COMISIÓN SOLES</label>
              <input className='form-input2 no-spinner'
                type="number"
                step="0.01"
                name="com_soles"
                value={formData.com_soles || ''}
                onChange={handleChange}
                id={formData.moneda !==  'Soles' ? 'active-border':''}
                disabled={formData.moneda !== 'Soles'}
              />
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>PRIMA DÓLARES</label>
              <input className='form-input2 no-spinner'
                type="number"
                step="0.01"
                name="prima_dol"
                value={formData.prima_dol || ''}
                onChange={handleChange}
                id={formData.moneda !== 'Dólares' ? 'active-border':''}
                disabled={formData.moneda !== 'Dólares'}
              />
            </div>
            <div className="form-group2">
              <label className='labelFormModul'>COMISIÓN DÓLARES</label>
              <input className='form-input2 no-spinner'
                type="number"
                step="0.01"
                name="com_dol"
                value={formData.com_dol || ''}
                onChange={handleChange}
                id={formData.moneda !== 'Dólares' ? 'active-border':''}
                disabled={formData.moneda !== 'Dólares'}
              />
            </div>
          </div>
          <div className="containerbuttonModal ">
            <button className="btn btn-guardar buttonModal" type="submit">Guardar</button>
            <button className="btn btn-cancelar buttonModal" type="button" onClick={handleCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFactura;
