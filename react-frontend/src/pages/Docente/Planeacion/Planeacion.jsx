import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import "./Planeacion.css";
import { useNavigate } from "react-router-dom";

const Planeacion = () => {
  const navigate = useNavigate();

  const handleCrearPlan = () => {
    navigate("/crear-plan");
  };

  const handleMisPlanes = () => {
    navigate("/ver-planes");
  };

  return (
    <>
      <NavbarDocente
        title="Gestión de Planes de Clase"
        color="#9c27b0"
        icon={
          <span className="material-symbols-outlined navbars-icon">
            checklist_rtl
          </span>
        }
      />

      <main className="main-content ">
        <div className="planning-class-container">
          <div className="planeacion-header">
            <h3>Selecciona la opción que deseas realizar</h3>
          </div>

          <div className="planeacion-actions">
            <div className="action-cards" onClick={handleCrearPlan}>
              <div className="action-icons">
                <span className="material-symbols-outlined icon-white">
                  add_circle
                </span>
              </div>
              <div className="planning-title">
                <h3>Crear Nuevo Plan</h3>
                <p>Diseña y crea un nuevo plan de clase </p>
              </div>
            </div>
            <div className="action-cards" onClick={handleMisPlanes}>
              <div className="action-icons">
                <span className="material-symbols-outlined icon-white">
                  folder_open
                </span>
              </div>
              <div className="planning-title">
                <h3>Mis Planes</h3>
              <p>Consulta, edita o gestiona tus planes existentes</p>
              </div>              
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Planeacion;
