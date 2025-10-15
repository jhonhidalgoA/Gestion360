import NavbarAdmin from "../../components/layout/Navbar/NavbarModulo";
import RoleDashboard from "../../components/ui/Dashboard"
import "./Docente.css"


const Docente = () => {
  return (
    <div className="docente-container">
      <NavbarAdmin />
      <RoleDashboard role="docente" />
    </div>
  );
};

export default Docente;