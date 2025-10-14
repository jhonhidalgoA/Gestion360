import NavbarModulo from "../../components/layout/Navbar/NavbarModulo"; 
import { getMenuData } from "../../data/menuData";
import AdministradorCard from "../../components/ui/AdministradorCard"; 
import "./PadreFamilia.css"; 

const PadreFamilia = () => {  
  const padreData = getMenuData("padre");
  return (
    <div className="father-containers"> 
      <NavbarModulo />
      <div className="card-containers">        
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