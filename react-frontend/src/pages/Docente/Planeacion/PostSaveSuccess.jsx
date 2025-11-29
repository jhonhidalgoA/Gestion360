import "./PostSaveSuccess.css"; 
import NavbarDocente from "../../layout/Navbar/NavbarDocente";

const PostSaveSuccess = ({ onVerPlan, onGenerarPDF, onNuevoPlan, mensaje }) => {
  return (
    <div className="planning">
      <NavbarDocente
        title="Planes de Clase"
        color="#9c27b0"
        icon={
          <span className="material-symbols-outlined navbars-icon">
            checklist_rtl
          </span>
        }
      />
      <main className="post-save-container">
        <div className="post-save-actions">
          <h3>Planificación guardada exitosamente2</h3>
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={onVerPlan}>
              Ver Plan
            </button>
            <button className="btn btn-primary" onClick={onGenerarPDF}>
              Generar PDF2
            </button>
            <button className="btn btn-outline" onClick={onNuevoPlan}>
              Nuevo Plan
            </button>
          </div>
          {mensaje.texto && (
            <div
              className={`feedback-message feedback-${
                mensaje.tipo === "exito" ? "success" : "error"
              }`}
            >
              {mensaje.texto}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostSaveSuccess;