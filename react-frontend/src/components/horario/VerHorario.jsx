import React, { useState, useEffect } from "react";
import "./VerHorario.css";

const subjectColors = {
  "Matemáticas": { bg: "#FF6347" },
  "Español": { bg: "#8A2BE2" },
  "Castellano": { bg: "#8A2BE2" },
  "Ciencias": { bg: "#1E90FF" },
  "Biología": { bg: "#1E90FF" },
  "Física": { bg: "#4169E1" },
  "Química": { bg: "#4682B4" },
  "Inglés": { bg: "#32CD32" },
  "Historia": { bg: "#FFD700" },
  "C. Sociales": { bg: "#FFA500" },
  "Historia y Geografía": { bg: "#FF8C00" },
  "Educación Física": { bg: "rgba(239, 68, 68, 0.9)" },
  "E. Física": { bg: "rgba(239, 68, 68, 0.9)" },
  "Arte": { bg: "rgba(251, 146, 60, 0.9)" },
  "Artística": { bg: "rgba(251, 146, 60, 0.9)" },
  "Música": { bg: "rgba(14, 165, 233, 0.9)" },
  "Tecnología": { bg: "rgba(100, 116, 139, 0.9)" },
  "Computación": { bg: "rgba(100, 116, 139, 0.9)" },
  "Recreo": { bg: "rgba(237, 234, 228, 0.9)" },
  "Descanso": { bg: "rgba(237, 234, 228, 0.9)" },
  "Almuerzo": { bg: "rgba(250, 250, 210, 0.9)" },
  "C. Lectora": { bg: "#96ceb4" },
  "Ética": { bg: "#a29bfe" },
  "Religión": { bg: "#fd7f6e" },
  "Cátedra de Paz": { bg: "#74b9ff" },
  "Estadística": { bg: "#f093fb" },
  "Geometría": { bg: "#764ba2" },
  "default": { bg: "rgba(148, 163, 184, 0.4)" }
};

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const VerHorario = ({ gradoId, titulo = "Horario Semanal" }) => {
  const [currentDay, setCurrentDay] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [diasConClases, setDiasConClases] = useState([]);

  // Actualizar hora y día actual
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      setCurrentDay(days[now.getDay()]);
      setCurrentTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  // Cargar horario desde la API
  useEffect(() => {
    if (!gradoId) {
      setDiasConClases(DIAS.map(d => ({ day: d, classes: [] })));
      setLoading(false);
      return;
    }

    const cargarHorario = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/horarios/grado/${gradoId}`);
        const data = await res.json();
        const bloques = data.filas || [];

        // Convertir a formato por día
        const nuevoHorario = DIAS.map(dia => {
          const clases = bloques.map(bloque => {
            const materia = bloque.dias[dia] || "";
            if (!materia) return null;
            return {
              time: `${bloque.inicio}-${bloque.fin}`,
              subject: materia,
              teacher: "Docente", // puedes mejorar esto más adelante
            };
          }).filter(Boolean);
          return { day: dia, classes: clases };
        });

        setDiasConClases(nuevoHorario);
      } catch (err) {
        console.error("Error al cargar horario:", err);
        setDiasConClases(DIAS.map(d => ({ day: d, classes: [] })));
      } finally {
        setLoading(false);
      }
    };

    cargarHorario();
  }, [gradoId]);

  const isCurrentClass = (day, timeRange) => {
    if (day !== currentDay) return false;
    const [start] = timeRange.split("-").map(time => time.slice(0, 5));
    const [h1, m1] = start.split(":").map(Number);
    const [ch, cm] = currentTime.split(":").map(Number);
    const current = ch * 60 + cm;
    const startMins = h1 * 60 + m1;
    const endMins = startMins + 60;
    return current >= startMins && current < endMins;
  };

  const getStyle = (subject) => {
    return subjectColors[subject] || subjectColors.default;
  };

  if (loading) return <div className="horario-loader">Cargando horario...</div>;

  return (
    <div className="schedule-containers">
      <h1 className="page-title">{titulo}</h1>
      <div className="schedule-grid">
        {diasConClases.map((diaData, idx) => (
          <div
            key={idx}
            className={`schedule-day ${diaData.day === currentDay ? "is-today" : ""}`}
          >
            <div className="schedule-header">
              <h3 className="schedule-day-title">
                {diaData.day}
                {diaData.day === currentDay && <span className="today-badge">HOY</span>}
              </h3>
            </div>
            <div className="schedule-classes">
              {diaData.classes.length > 0 ? (
                diaData.classes.map((cls, cidx) => {
                  const style = getStyle(cls.subject);
                  const isCurrent = isCurrentClass(diaData.day, cls.time);
                  return (
                    <div
                      key={cidx}
                      className={`schedule-class ${isCurrent ? "is-current" : ""}`}
                      style={{ background: style.bg }}
                    >
                      <span className="class-time">{cls.time.slice(0, 5)}</span>
                      <p className="class-subject">{cls.subject}</p>
                      <p className="class-teacher">{cls.teacher}</p>
                      {isCurrent && <span className="live-badge">EN VIVO</span>}
                    </div>
                  );
                })
              ) : (
                <p className="no-class">Sin clases</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerHorario;