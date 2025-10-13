import NavbarPadre from "../../components/layout/Navbar/NavbarModulo"; 
import { getMenuData } from "../../data/menuData";
import AdministradorCard from "../../components/ui/AdministradorCard"; 
import "./PadreFamilia.css"; 

const PadreFamilia = () => {
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  
  const padreData = getMenuData("padre");

  return (
    <div className="father-containers"> 
      <NavbarPadre />
      <div className="card-containers">
        <div className="home-title">
          <h1>Bienvenido, Padre de Familia</h1>
          <span className="date">{fechaActual}</span>
        </div>
        <ul className="card-group">
          {padreData.map((item) => (
            <AdministradorCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              path={item.path}
              gradient={item.gradient}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PadreFamilia;