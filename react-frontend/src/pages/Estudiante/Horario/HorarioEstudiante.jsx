import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import VerHorario from "../../../components/horario/VerHorario";

const HorarioEstudiante = () => {
  const { user, loading } = useAuth();
  console.log("AuthContext - user:", user, "loading:", loading);
  const navigate = useNavigate();

  // Solo redirigimos cuando la carga terminó
  React.useEffect(() => {
    if (loading) return; // aún no sabemos si hay usuario

    if (!user || user.role !== "estudiante") {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // Mientras carga, no hacemos nada visible ni redirigimos
  if (loading) {
    return <div className="horario-loader">Cargando sesión...</div>;
  }

  // Si ya terminó la carga y no hay usuario, no renderizamos (aunque el useEffect ya redirigió)
  if (!user) {
    return null;
  }

  // Usuario válido → mostrar horario o mensaje
  return (
    <div className="schedules-container">
      <NavbarModulo />
      <div className="page-container">
        <div className="page-content">
          <div className="header-section">
            <button onClick={() => window.history.back()} className="back-button">
              <span className="back-icon">←</span>
              Volver al inicio
            </button>
          </div>
          {user.grado_id ? (
            <VerHorario gradoId={user.grado_id} titulo="Mi Horario" />
          ) : (
            <p className="error-message">No tienes un grado asignado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorarioEstudiante;