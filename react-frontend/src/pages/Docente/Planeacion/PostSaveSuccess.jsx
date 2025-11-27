// src/components/planeacion/PostSaveSuccess.jsx
import React from "react";
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
          <h3>Planificación guardada exitosamente</h3>
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={onVerPlan}>
              Ver Plan
            </button>
            <button className="btn btn-primary" onClick={onGenerarPDF}>
              Generar PDF
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