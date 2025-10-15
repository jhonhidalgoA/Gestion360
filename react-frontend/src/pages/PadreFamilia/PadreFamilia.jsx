import NavbarAdmin from "../../components/layout/Navbar/NavbarModulo";
import RoleDashboard from "../../components/ui/Dashboard"
import "./PadreFamilia.css"


const PadreFamilia = () => {
  return (
    <div className="padre-container">
      <NavbarAdmin />
      <RoleDashboard role="padre" />
    </div>
  );
};

export default PadreFamilia;