import NavbarAdmin from "../../components/layout/Navbar/NavbarModulo";
import RoleDashboard from "../../components/ui/Dashboard"
import "./Administrador.css"

const Administrador = () => {
  return (
    <div className="admin-container">
      <NavbarAdmin />
      <RoleDashboard role="admin" />
    </div>
  );
};

export default Administrador;