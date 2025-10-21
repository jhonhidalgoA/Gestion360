import "./MisCalificaciones.css"
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import { useNavigate } from "react-router-dom";

const Tareashacer = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/estudiante");
  };

  return (
    <div className="schedules-containers">
      <NavbarModulo />
      <div className="page-container">
        <button onClick={handleBack} className="back-button">
          <span className="back-icon">←</span>
          Volver al inicio
        </button>
      </div>
      <div className="page-title">
        <h4>Mis Calificaciones</h4>
      </div>
    </div>
  );
};

export default Tareashacer;