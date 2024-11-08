import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username'); // Limpia el nombre de usuario también
    navigate('/');
  };

  const confirmLogout = () => {
    Swal.fire({
      title: '¿Estás seguro de que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#81BB49',
      cancelButtonColor: '#B1B1B1',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
        Swal.fire(
          'Cerrado!',
          'Tu sesión ha sido cerrada.',
          'success'
        )
      }
    });
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className='headerLogo'>
          <img className='logoStyle' src="/img/logoEmpresa2.png" alt="Error" />
        </div>
        <div className="nav-container">
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/dashboard/graficosfacturaGeneral"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="active-bar"></div>}
                      <img src={isActive ? "/img/homeActivo.png" : "/img/home.png"} alt="error" className='iconNavDashboard' />
                      Inicio
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/formulario"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="active-bar"></div>}
                      <img src={isActive ? "/img/ingresarfacturasActivo.png" : "/img/ingresarfacturas.png"} alt="error" className='iconNavDashboard' />
                      Ingresar Facturas
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/tablafacturaGeneral"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="active-bar"></div>}
                      <img src={isActive ? "/img/detallefacturasActivo.png" : "/img/detallefacturas.png"} alt="error" className='iconNavDashboard' />
                      Detalle de Facturas
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/tablafacturacomisiones"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <div className="active-bar"></div>}
                      <img src={isActive ? "/img/comisionActivo.png" : "/img/comision.png"} alt="error" className='iconNavDashboard' />
                      Comisiones
                    </>
                  )}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <button onClick={confirmLogout} className="logout-button">
          <img src="/img/close.png" alt="error" className='iconNavDashboard' />
          Cerrar sesión
        </button>
      </div>
      <div className="containerPanel">
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
