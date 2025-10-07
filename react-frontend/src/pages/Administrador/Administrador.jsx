import NavbarAdmin from "../../components/layout/Navbar/NavbarModulo";
import { adminData } from "../../data/AdministradorData";
import AdministradorCard from "../../components/ui/AdministradorCard";
import "./Administrador.css";

const Administrador = () => {
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="admin-containers">
      <NavbarAdmin />
      <div className="card-containers">
        <div className="home-title">
          <h1>Bienvenido Administrador</h1>
          <span className="date">{fechaActual}</span>
        </div>
        <ul className="card-group">
          {adminData.map((item) => (
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

export default Administrador;
