import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import VerHorario from "../../../components/horario/VerHorario";
import "./HorarioEstudiante.css";

const HorarioEstudiante = () => {
  const { user, loading } = useAuth();
  console.log("AuthContext - user:", user, "loading:", loading);
  const navigate = useNavigate();

  // Estados para la fecha y hora actual
  const [currentTime, setCurrentTime] = useState("");
  const [currentDateDisplay, setCurrentDateDisplay] = useState("");

  // Efecto para actualizar la fecha y hora actual
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();

      // Fecha legible con fallback
      let formattedDate = "";
      const formatter = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      formattedDate = formatter.format(now);

      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      setCurrentDateDisplay(formattedDate);

      // Hora actual
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "estudiante") {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="horario-loader">Cargando sesión...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="schedules-container">
      <NavbarModulo />
      <div className="page-container">
        <div className="page-content">
          <div className="header-section">
            <button
              onClick={() => window.history.back()}
              className="back-button"
            >
              <span class="material-symbols-outlined icon-back">arrow_left_alt</span>
              Volver al inicio
            </button>
            <div className="current-info">
              <div className="current-day">
                <span className="label">Hoy es :</span>{" "}
                <span className="date-value">{currentDateDisplay}</span>
              </div>
              <div className="current-time">
                <span className="time-value">{currentTime}</span>
              </div>
            </div>
          </div>

          <div className="ensayo">
            {user.grado_id ? (
              <VerHorario gradoId={user.grado_id} titulo="Mi Horario" />
            ) : (
              <p className="error-message">No tienes un grado asignado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorarioEstudiante;
