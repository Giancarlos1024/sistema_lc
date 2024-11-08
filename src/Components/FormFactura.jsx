import React, { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/FormFactura.css';
import Swal from 'sweetalert2';
import { UserContext } from '../Provider/UserContext';

const FormFactura = () => {

  const navigate = useNavigate();
  const { username } = useContext(UserContext);
  
  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Perderás los cambios no guardados!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#81BB49',
      cancelButtonColor: '#B1B1B1',
      confirmButtonText: 'Sí, regresar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/dashboard/tablafacturaGeneral');
      }
    });
  };
  
  const initialFormData = {
    oficina: '',
    factura: '',
    liquidacion: '',
    fecha: '',
    mes: '',
    poliza: '',
    recibo: '',
    cia_compania: '',
    cod_ramo: '',
    ramo_sbs: '',
    ramo_cia: '',
    asegurado: '',
    prima_dol: '0.0',
    com_dol: '0.0',
    prima_soles: '0.0',
    com_soles: '0.0',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [moneda, setMoneda] = useState('Dólares'); // Estado para la moneda seleccionada
  const [editId, setEditId] = useState(null);
  const [facturas, setFacturas] = useState([]); // Estado para las facturas
  const [alertMessage, setAlertMessage] = useState(''); // Estado para el mensaje de alerta
  const [alertSeverity, setAlertSeverity] = useState(''); // Estado para la severidad de la alerta
  const [open, setOpen] = useState(false);
 

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/facturas/datos`)
      .then(response => response.json())
      .then(data => {
        // Formatear la fecha antes de almacenar en el estado
        const facturasFormatted = data.map(factura => ({
          ...factura,
          fecha: new Date(factura.fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          })
        }));
        setFacturas(facturasFormatted);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [ ]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fecha') {
      const date = new Date(value);
      const formattedDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const month = date.toLocaleString('default', { month: 'long' }); // Nombre del mes
      setFormData({
        ...formData,
        [name]: formattedDate,
        mes: month
      });
    } else if (name === 'prima_dol' || name === 'com_dol' || name === 'prima_soles' || name === 'com_soles') {
      // Si se cambia una de las cantidades, actualizar la otra moneda
      const otherCurrencyField = name.includes('dol') ? 'soles' : 'dol';
      const otherCurrencyValue = name === 'prima_dol' || name === 'com_dol' ? '0.0' : ''; // Establecer 0.0 o vacío según corresponda
      setFormData({
        ...formData,
        [name]: value,
        [otherCurrencyField]: otherCurrencyValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    
    const updatedFormData = {
      ...formData,
      usuarioLogin: username
    };
    
    console.log('Datos a enviar:', updatedFormData); // Verifica los datos que se envían
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Desea ingresar la factura?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#81BB49',
      cancelButtonColor: '#B1B1B1',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${apiBaseUrl}/api/facturas/registrarfactura`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedFormData)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Respuesta del servidor:', data); // Verifica la respuesta del servidor
          setFormData(initialFormData);
          setFacturas(prevFacturas => [...prevFacturas, updatedFormData]);
          setAlertMessage('Factura registrada exitosamente');
          setAlertSeverity('success');
          setOpen(true);
          Swal.fire(
            '¡Hecho!',
            'Factura registrada exitosamente.',
            'success'
          );
        })
        .catch((error) => {
          console.error('Error:', error);
          setAlertMessage('Error al registrar la factura');
          setAlertSeverity('error');
          setOpen(true);
          Swal.fire(
            'Error',
            'Error al registrar la factura.',
            'error'
          );
        });
      }
    });
  };
  
  const handleMonedaChange = (e) => {
    const selectedMoneda = e.target.value;
    const otherCurrencyValue = selectedMoneda === 'Dólares' ? '0.0' : ''; // Establecer 0.0 o vacío para la moneda no seleccionada
    setMoneda(selectedMoneda);
    setFormData({
      ...formData,
      prima_dol: selectedMoneda === 'Dólares' ? formData.prima_dol : '0.0',
      com_dol: selectedMoneda === 'Dólares' ? formData.com_dol : '0.0',
      prima_soles: selectedMoneda === 'Soles' ? formData.prima_soles : '0.0',
      com_soles: selectedMoneda === 'Soles' ? formData.com_soles : '0.0',
    });
  };

  const handleAseguradoChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.toUpperCase(),
    }));
  };

  const oficinas = ['LIMA', 'ICA', 'CHICLAYO','PIURA','TRUJILLO','CUSCO','PISCO','VACIO'];
  const companias = ['MP', 'MP EPS', 'PPS','PPS EPS','LP','LPV','LP EPS','RIMAC','RIMAC EPS',
                    'PROTECTA','SANITAS','CRECER','CHUBB','QUALITAS','SECREX','AVLA',
                    'LIBERTY','OTROS'];

  const codRamos = ['1', '2', '3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18'];
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
    'Mapfre Proteccion-T Individual','Medicina Nacional','Multiriesgo','Multiriesgo del Hogar',
    'Multiriesgo Hidrocarburo','Multiriesgos',' Multiriesgos Hidrocarburos','Multisalud','Multiseguros',
    'Nota de Crédito','Nota de Crédito Crecer Seguros S.A','Nota de Crédito Sanitas Perú S.A',
    'Onco Integral','Otros Planes','Para Ti Familia','Plan Regular','Polizas de Transportes','Potestativo Corporativo',
    'Potestativo Familiar','Proforma Sanitas Perú S.A','Prórrogas','RAMO CIA','Responsabilidad Civil',
    'Robo','Robo y Asalto','ROMA','SALDO','Saldo Anterior','Salud','Salud Red','Salud Red Preferencial',
    'Sctr','Sctr Pensiones','Sctr Salud','SECO','Seg. Cred. A la Exportacion','Seguro de Salud','Seguro Patrimonial',
    'Soat','Transp.Maritimo/Aereo','Transporte Flota','Transporte Terrestre','Transportes','TREC','Trin','Vehiculos','Vida Inversion Oro Soles',
    'Vida Ley D.L. 688','VTHD','Web Vehiculos','Vacías'

  ]
  const ramoCia = ramoCia2.map(elemento => elemento.toUpperCase());

  const ramoSbs = ramoSbs2.map(elemento => elemento.toUpperCase());

  return (
    <div className="">
      <div className="containerFormulario">
        <div className='detallefacturaheader'>
          <h1>Ingresar detalle de factura</h1>
          <button className='buttonRegresar'onClick={handleLogout} >
            <div className='regresarDiv'>
              <img className='regresoImgbutton' src="/img/flechaRegresoButton.png" alt="error" />
            </div>
            <div className='regresarDiv'>
              Regresar
            </div>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className='fila'>
              <div className="form-group">
                <label className='ingresarLabelFactura'>PÓLIZA</label>
                <input className='form-input' type="text" name="poliza" value={formData.poliza} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className='ingresarLabelFactura'>FACTURA</label>
                <input className='form-input' type="text" name="factura" value={formData.factura} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className='ingresarLabelFactura'>LIQUIDACIÓN</label>
                <input className='form-input' type="text" name="liquidacion" value={formData.liquidacion} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className='ingresarLabelFactura'>RECIBO</label>
                <input className='form-input' type="text" name="recibo" value={formData.recibo} onChange={handleChange} /> 
              </div>
            </div>
            <div  className='fila'>
              <div className="form-group">
                <label className='ingresarLabelFactura'>OFICINA</label>
                <select className='form-input' name="oficina" value={formData.oficina} onChange={handleChange}>
                  <option value="">Seleccione</option>
                  {oficinas.map((oficina, index) => (
                    <option key={index} value={oficina}>{oficina}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className='ingresarLabelFactura'>FECHA</label>
                <input className='form-input' type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className='ingresarLabelFactura'>MES</label>
                <input className='form-input' type="text" name="mes" value={formData.mes} readOnly />
              </div>
            </div>
          </div>
          <div className='fila'>
           
            <div className="form-group">
              <label className='ingresarLabelFactura'>COMPAÑÍA ASEGURADORA</label>
              <select className='form-input' name="cia_compania" value={formData.cia_compania} onChange={handleChange}>
                <option value="">Seleccione</option>
                {companias.map((compania, index) => (
                  <option key={index} value={compania}>{compania}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className='ingresarLabelFactura'>CÓDIGO DE RAMO</label>
              <select className='form-input' name="cod_ramo" value={formData.cod_ramo} onChange={handleChange}>
                <option value="">Seleccione</option>
                {codRamos.map((ramo, index) => (
                  <option key={index} value={ramo}>{ramo}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className='ingresarLabelFactura'>RAMO ASEGURADORA</label>
              <select className='form-input' name="ramo_cia" value={formData.ramo_cia} onChange={handleChange} >
                <option value="">Seleccione</option>
                {ramoCia.map((ramoAseguradora, index) => (
                  <option key={index} value={ramoAseguradora}>{ramoAseguradora}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className='ingresarLabelFactura'>RAMO SBS</label>
              <select className='form-input' name="ramo_sbs" value={formData.ramo_sbs} onChange={handleChange}>
                <option value="">Seleccione</option>
                {ramoSbs.map((sbs, index) => (
                  <option key={index} value={sbs}>{sbs}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='fila'>
            <div className='form-group'>
            <label className='ingresarLabelFactura'>ASEGURADO</label>
            <input
                className='form-input'
                type="text"
                name="asegurado"
                value={formData.asegurado}
                onChange={handleAseguradoChange}
                required
                id='inputAsegurado'
              />
            </div>
            <div className="form-group">
              <label className='ingresarLabelFactura'>MONEDA</label>
              <select className='form-input' name="moneda" value={moneda} onChange={handleMonedaChange}>
                {monedas.map((mon, index) => (
                  <option key={index} value={mon}>{mon}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='fila'>
            <div className="form-group">
              <label className='ingresarLabelFactura '>PRIMA SOLES</label>
              <input className='form-input no-spinner'
                type="number"
                step="0.01"
                name="prima_soles"
                value={formData.prima_soles}
                onChange={handleChange}
                id={moneda !== 'Soles' ? 'active-border':''}
                disabled={moneda !== 'Soles'}
              />
            </div>
            <div className="form-group">
              <label className='ingresarLabelFactura'>COMISIÓN SOLES</label>
              <input className='form-input no-spinner'
                type="number"
                step="0.01"
                name="com_soles"
                value={formData.com_soles}
                onChange={handleChange}
                id={moneda !==  'Soles' ? 'active-border':''}
                disabled={moneda !== 'Soles'}
              />
            </div>
            <div className="form-group">
              <label className='ingresarLabelFactura'>PRIMA DÓLARES</label>
              <input className='form-input no-spinner'
                type="number"
                step="0.01"
                name="prima_dol"
                value={formData.prima_dol}
                onChange={handleChange}
                id={moneda !== 'Dólares' ? 'active-border':''}
                disabled={moneda !== 'Dólares'}
                
              />
            </div>
            <div className="form-group">
              <label className='ingresarLabelFactura'>COMISIÓN DÓLARES</label>
              <input className='form-input no-spinner'
                type="number"
                step="0.01"
                name="com_dol"
                value={formData.com_dol}
                onChange={handleChange}
                id={moneda !== 'Dólares' ? 'active-border':''}
                disabled={moneda !== 'Dólares'}
              />
            </div>
          </div>

        
          <div className="button-container">
            <button type="submit" className='buttonFacturaForm'>Guardar</button>
          </div>

        </form>
      </div>
      
    </div>
  );
};

export default FormFactura;
