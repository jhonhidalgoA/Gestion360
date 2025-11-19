// src/pages/padre/HorarioVer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";


const subjectColors = {
  Matemáticas: { bg: "#FF6347" },
  Español: { bg: "#8A2BE2" },
  Ciencias: { bg: "#1E90FF" },
  Inglés: { bg: "#32CD32" },
  Historia: { bg: "#FFD700" },
  "Educación Física": { bg: "rgba(239, 68, 68, 0.9)" },
  Arte: { bg: "rgba(251, 146, 60, 0.9)" },
  Música: { bg: "rgba(14, 165, 233, 0.9)" },
  Computación: { bg: "rgba(100, 116, 139, 0.9)" },
  Recreo: { bg: "rgba(237, 234, 228, 0.9)" },
};

const schedules = [
  {
    day: "Lunes",
    classes: [
      {
        time: "7:00-8:00",
        subject: "Matemáticas",
        teacher: "Docente: Jhon F. Hidalgo",
      },
      {
        time: "8:00-9:00",
        subject: "Español",
        teacher: "Docente: Alejandra Martínez",
      },
      {
        time: "9:00-10:00",
        subject: "Ciencias Naturales",
        teacher: "Prof. Marino López",
      },
      { time: "10:00-10:30", subject: "Descanso", teacher: "-" },
      {
        time: "10:30-11:30",
        subject: "Inglés",
        teacher: "Prof. Luis A. Montoya",
      },
      {
        time: "11:30-12:30",
        subject: "Educación Física",
        teacher: "Prof. Carlos M. García",
      },
    ],
  },
  {
    day: "Martes",
    classes: [
      {
        time: "7:00-8:00",
        subject: "Ciencias Naturales",
        teacher: "Prof. Marino López",
      },
      { time: "8:00-9:00", subject: "Matemáticas", teacher: "Prof. Rodríguez" },
      { time: "9:00-10:00", subject: "Arte", teacher: "Prof. Domingo Herrera" },
      { time: "10:00-10:30", subject: "Recreo", teacher: "-" },
      { time: "10:30-11:30", subject: "Historia", teacher: "Prof. Díaz" },
      { time: "11:30-12:30", subject: "Inglés", teacher: "Prof. Smith" },
    ],
  },
  {
    day: "Miércoles",
    classes: [
      {
        time: "7:00-8:00",
        subject: "Español",
        teacher: "Docente: Alejandra Martínez",
      },
      { time: "8:00-9:00", subject: "Matemáticas", teacher: "Prof. Rodríguez" },
      { time: "9:00-10:00", subject: "Música", teacher: "Prof. Torres" },
      { time: "10:00-10:30", subject: "Recreo", teacher: "-" },
      { time: "10:30-11:30", subject: "Ciencias", teacher: "Prof. López" },
      { time: "11:30-12:30", subject: "Tecnología", teacher: "Prof. Ruiz" },
    ],
  },
  {
    day: "Jueves",
    classes: [
      {
        time: "7:00-8:00",
        subject: "Matemáticas",
        teacher: "Docente: Jhon F. Hidalgo",
      },
      {
        time: "8:00-9:00",
        subject: "Inglés",
        teacher: "Docente: Aida Rodríguez",
      },
      { time: "9:00-10:00", subject: "Español", teacher: "Prof. Martínez" },
      { time: "10:00-10:30", subject: "Recreo", teacher: "-" },
      {
        time: "10:30-11:30",
        subject: "Educación Física",
        teacher: "Prof. García",
      },
      { time: "11:30-12:30", subject: "Ciencias", teacher: "Prof. López" },
    ],
  },
  {
    day: "Viernes",
    classes: [
      { time: "7:00-8:00", subject: "Historia", teacher: "Prof. Díaz" },
      { time: "8:00-9:00", subject: "Matemáticas", teacher: "Prof. Rodríguez" },
      { time: "9:00-10:00", subject: "Español", teacher: "Prof. Martínez" },
      { time: "10:00-10:30", subject: "Recreo", teacher: "-" },
      { time: "10:30-11:30", subject: "Arte", teacher: "Prof. Herrera" },
      { time: "11:30-12:30", subject: "Inglés", teacher: "Prof. Smith" },
    ],
  },
];

const HorarioVer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDay, setCurrentDay] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDateDisplay, setCurrentDateDisplay] = useState("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();

      // Día de la semana
      const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      setCurrentDay(days[now.getDay()]);

      // Hora actual
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

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
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    if (firstSegment === "estudiante" || firstSegment === "padrefamilia") {
      navigate(`/${firstSegment}`);
    } else {
      navigate(-1);
    }
  };

  const isCurrentClass = (day, timeRange) => {
    if (day !== currentDay) return false;

    const [start] = timeRange.split("-");
    const [startHour, startMinute] = start.split(":").map(Number);
    const [currentHour, currentMinute] = currentTime.split(":").map(Number);

    const currentMinutes = currentHour * 60 + currentMinute;
    const startMinutes = startHour * 60 + startMinute;

    return currentMinutes >= startMinutes && currentMinutes < startMinutes + 60;
  };

  const getSubjectStyle = (subject) => {
    return (
      subjectColors[subject] || {
        bg: "rgba(148, 163, 184, 0.4)",
      }
    );
  };

  return (
    <div className="schedules-container">
      <NavbarModulo />
      <div className="page-container">
        <div className="page-content">
          <div className="header-section">
            <button onClick={handleBack} className="back-button">
              <span className="back-icon">←</span>
              Volver al inicio
            </button>
            <div className="current-info">
              <div className="current-day">
                <span className="label">Hoy es:</span>{" "}
                <span className="date-value">{currentDateDisplay}</span>
              </div>
              <div className="current-time">
                <span className="time-value">{currentTime}</span>
              </div>
            </div>
          </div>
          <h1 className="page-title">Horario Semanal</h1>
          <div className="schedule-grid">
            {schedules.map((day, idx) => (
              <div
                key={idx}
                className={`schedule-day ${
                  day.day === currentDay ? "is-today" : ""
                }`}
              >
                <div className="schedule-header">
                  <h3 className="schedule-day-title">
                    {day.day}
                    {day.day === currentDay && (
                      <span className="today-badge">HOY</span>
                    )}
                  </h3>
                </div>
                <div className="schedule-classes">
                  {day.classes.map((cls, cidx) => {
                    const style = getSubjectStyle(cls.subject);
                    const isCurrent = isCurrentClass(day.day, cls.time);

                    return (
                      <div
                        key={cidx}
                        className={`schedule-class ${
                          isCurrent ? "is-current" : ""
                        }`}
                        style={{
                          background: style.bg,
                        }}
                      >
                        <span className="class-time">{cls.time}</span>
                        <p className="class-subject">{cls.subject}</p>
                        <p className="class-teacher">{cls.teacher}</p>
                        {isCurrent && (
                          <span className="live-badge">EN VIVO</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorarioVer;
