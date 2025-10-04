import NavbarAdmin from "../../components/layout/Navbar/NavbarAdmin";
import {docenteData} from "../../data/DocenteData";
import AdminCard from "../../components/ui/AdministradorCard";
import "./Docente.css";

const Docente = () => {
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="teacher-container">      
      <NavbarAdmin />
      <div className="home-title">
        <h1>Bienvenido Docente</h1>
        <span className="date">{fechaActual}</span>
      </div>
      <ul className="teacher-group">
        {docenteData.map((item) => (
            <AdminCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              path={item.path}
              gradient={item.gradient}
            />
          ))}
      </ul>      
    </div>
  );
};

export default Docente;
