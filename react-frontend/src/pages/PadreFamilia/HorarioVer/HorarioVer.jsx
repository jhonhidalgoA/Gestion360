// src/pages/padre/HorarioVer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import "./HorarioVer.css";

// Datos del horario (puedes reemplazar esto más tarde con una llamada a API)
const schedules = [
  { day: 'Lunes', classes: [
    { time: '7:00-8:00', subject: 'Matemáticas', teacher: 'Prof. Rodríguez' },
    { time: '8:00-9:00', subject: 'Español', teacher: 'Prof. Martínez' },
    { time: '9:00-10:00', subject: 'Ciencias', teacher: 'Prof. López' },
    { time: '10:00-10:30', subject: 'Recreo', teacher: '-' },
    { time: '10:30-11:30', subject: 'Inglés', teacher: 'Prof. Smith' },
    { time: '11:30-12:30', subject: 'Educación Física', teacher: 'Prof. García' }
  ]},
  { day: 'Martes', classes: [
    { time: '7:00-8:00', subject: 'Ciencias', teacher: 'Prof. López' },
    { time: '8:00-9:00', subject: 'Matemáticas', teacher: 'Prof. Rodríguez' },
    { time: '9:00-10:00', subject: 'Arte', teacher: 'Prof. Herrera' },
    { time: '10:00-10:30', subject: 'Recreo', teacher: '-' },
    { time: '10:30-11:30', subject: 'Historia', teacher: 'Prof. Díaz' },
    { time: '11:30-12:30', subject: 'Inglés', teacher: 'Prof. Smith' }
  ]},
  { day: 'Miércoles', classes: [
    { time: '7:00-8:00', subject: 'Español', teacher: 'Prof. Martínez' },
    { time: '8:00-9:00', subject: 'Matemáticas', teacher: 'Prof. Rodríguez' },
    { time: '9:00-10:00', subject: 'Música', teacher: 'Prof. Torres' },
    { time: '10:00-10:30', subject: 'Recreo', teacher: '-' },
    { time: '10:30-11:30', subject: 'Ciencias', teacher: 'Prof. López' },
    { time: '11:30-12:30', subject: 'Computación', teacher: 'Prof. Ruiz' }
  ]},
  { day: 'Jueves', classes: [
    { time: '7:00-8:00', subject: 'Matemáticas', teacher: 'Prof. Rodríguez' },
    { time: '8:00-9:00', subject: 'Inglés', teacher: 'Prof. Smith' },
    { time: '9:00-10:00', subject: 'Español', teacher: 'Prof. Martínez' },
    { time: '10:00-10:30', subject: 'Recreo', teacher: '-' },
    { time: '10:30-11:30', subject: 'Educación Física', teacher: 'Prof. García' },
    { time: '11:30-12:30', subject: 'Ciencias', teacher: 'Prof. López' }
  ]},
  { day: 'Viernes', classes: [
    { time: '7:00-8:00', subject: 'Historia', teacher: 'Prof. Díaz' },
    { time: '8:00-9:00', subject: 'Matemáticas', teacher: 'Prof. Rodríguez' },
    { time: '9:00-10:00', subject: 'Español', teacher: 'Prof. Martínez' },
    { time: '10:00-10:30', subject: 'Recreo', teacher: '-' },
    { time: '10:30-11:30', subject: 'Arte', teacher: 'Prof. Herrera' },
    { time: '11:30-12:30', subject: 'Inglés', teacher: 'Prof. Smith' }
  ]}
];

const HorarioVer = () => {
  const navigate = useNavigate();

  const handleBack = () => {    
    navigate('/padrefamilia');
  };

  return (
    <div className="horario-ver-container">
      <NavbarModulo />
      <div className="page-container">
        <div className="page-content">
          <button onClick={handleBack} className="back-button">
            ← Volver al inicio
          </button>

          <h1 className="page-title">Horario Semanal</h1>

          <div className="schedule-grid">
            {schedules.map((day, idx) => (
              <div key={idx} className="schedule-day">
                <div className="schedule-header">
                  <h3 className="schedule-day-title">{day.day}</h3>
                </div>
                <div className="schedule-classes">
                  {day.classes.map((cls, cidx) => (
                    <div
                      key={cidx}
                      className={`schedule-class ${
                        cls.subject === 'Recreo' ? 'recess' : ''
                      }`}
                    >
                      <p className="class-time">{cls.time}</p>
                      <p className="class-subject">{cls.subject}</p>
                      <p className="class-teacher">{cls.teacher}</p>
                    </div>
                  ))}
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