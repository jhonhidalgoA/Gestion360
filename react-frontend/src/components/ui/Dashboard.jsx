import { Link } from 'react-router-dom';
import { getMenuData } from '../../data/MenuData'; 
import "./Dashboard.css"


const RoleDashboard = ({ role }) => {
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const titleMap = {
    admin: 'Bienvenido Administrador',
    docente: 'Bienvenido Docente',
    padre: 'Bienvenido Padre de Familia',
  };

  const title = titleMap[role] || 'Bienvenido';

  const menuItems = getMenuData(role);

  return (
    <div className="role-dashboard">
      
      <div className="home-header">
        <h1>{title}</h1>
        <p className="current-date">{fechaActual}</p>
      </div>

     
      <div className="cards-grid">
        {menuItems.map((item) => (
          <Link key={item.id} to={item.path} className="card-link">
            <div
              className="card"
              style={{
                background: item.gradient,
                color: '#fff',
              }}
            >
             
              <span
                className="material-symbols-outlined card-icon"
                style={{
                  fontSize: item.iconSize || 80,
                  color: item.iconColor || '#fff',
                }}
              >
                {item.icon}
              </span>

              
              <span className="card-title">{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoleDashboard;