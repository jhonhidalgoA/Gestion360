import React, { useState } from 'react';
import { Calendar, Clock, User, BookOpen, Check, AlertCircle } from 'lucide-react';
import './ParentView.css';

const ParentView = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentReason, setAppointmentReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [teachers] = useState([
    { id: 1, name: 'Sofía Giraldo', subject: 'Historia', avatar: 'MG' },
    { id: 2, name: 'Carlos Andres Rodríguez', subject: 'Español', avatar: 'CR' },
    { id: 3, name: 'Ana Lucía Martínez', subject: 'Ciencias', avatar: 'AM' },
    { id: 4, name: 'Luis Angel Montoya', subject: 'Matemáticas', avatar: 'LP' }
  ]);

  const [teacherAvailability] = useState({
    1: {
      '2025-10-06': ['09:00', '09:30', '10:00', '14:00', '14:30'],
      '2025-10-07': ['10:00', '10:30', '11:00', '15:00'],
      '2025-10-08': ['09:00', '09:30', '14:00', '14:30', '15:00']
    },
    2: {
      '2025-10-06': ['10:00', '10:30', '11:00', '15:30', '16:00'],
      '2025-10-07': ['09:00', '09:30', '14:00', '14:30'],
      '2025-10-08': ['10:00', '10:30', '15:00', '15:30']
    },
    3: {
      '2025-10-06': ['11:00', '11:30', '14:00', '14:30'],
      '2025-10-07': ['09:00', '09:30', '10:00', '15:00', '15:30'],
      '2025-10-08': ['11:00', '14:00', '14:30', '15:00']
    },
    4: {
      '2025-10-06': ['09:00', '10:00', '14:00', '15:00'],
      '2025-10-07': ['10:00', '11:00', '14:00', '15:00'],
      '2025-10-08': ['09:00', '10:00', '14:00', '15:00', '16:00']
    }
  });

  const [appointments, setAppointments] = useState([
    { id: 1, teacherId: 1, date: '2025-10-06', time: '10:30', parent: 'Juan Sánchez', reason: 'Rendimiento académico', status: 'confirmed' },
    { id: 2, teacherId: 2, date: '2025-10-07', time: '10:30', parent: 'Laura Torres', reason: 'Comportamiento en clase', status: 'confirmed' }
  ]);

  const availableDates = selectedTeacher ? Object.keys(teacherAvailability[selectedTeacher.id] || {}) : [];

  const handleBookAppointment = () => {
    const newAppointment = {
      id: appointments.length + 1,
      teacherId: selectedTeacher.id,
      date: selectedDate,
      time: selectedTime,
      parent: 'Usuario Actual',
      reason: appointmentReason,
      status: 'confirmed'
    };
    setAppointments([...appointments, newAppointment]);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedTeacher(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setAppointmentReason('');
    }, 3000);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="parent-view">
      <div className="info-banner info-banner-blue">
        <div className="info-banner-content">
          <AlertCircle className="info-banner-icon" />
          <div>
            <h3 className="info-banner-title">Reserva tu cita</h3>
            <p className="info-banner-text">Selecciona un docente y elige el horario disponible que mejor te convenga</p>
          </div>
        </div>
      </div>

      {!selectedTeacher ? (
        <div>
          <h3 className="section-title">Selecciona un Docente</h3>
          <div className="teachers-grid">
            {teachers.map(teacher => (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className="teacher-card"
              >
                <div className="teacher-info">
                  <div className="teacher-avatar">
                    {teacher.avatar}
                  </div>
                  <div>
                    <h4 className="teacher-name">{teacher.name}</h4>
                    <p className="teacher-subject">
                      <BookOpen className="icon-small" />
                      {teacher.subject}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setSelectedTeacher(null);
              setSelectedDate(null);
              setSelectedTime(null);
            }}
            className="back-button"
          >
            ← Cambiar docente
          </button>

          <div className="selected-teacher-card">
            <div className="teacher-info">
              <div className="teacher-avatar">
                {selectedTeacher.avatar}
              </div>
              <div>
                <h4 className="teacher-name">{selectedTeacher.name}</h4>
                <p className="teacher-subject">{selectedTeacher.subject}</p>
              </div>
            </div>
          </div>

          {!selectedDate ? (
            <div>
              <h3 className="section-title">Selecciona una Fecha</h3>
              <div className="dates-grid">
                {availableDates.map(date => (
                  <div
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className="date-card"
                  >
                    <Calendar className="date-icon" />
                    <p className="date-text capitalize">{formatDate(date)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="back-button"
              >
                ← Cambiar fecha
              </button>

              <div className="selected-date">
                <p className="selected-date-text capitalize">{formatDate(selectedDate)}</p>
              </div>

              {!selectedTime ? (
                <div>
                  <h3 className="section-title">Selecciona un Horario</h3>
                  <div className="times-grid">
                    {teacherAvailability[selectedTeacher.id][selectedDate].map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className="time-button"
                      >
                        <Clock className="time-icon" />
                        <p className="time-text">{time}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedTime(null)}
                    className="back-button"
                  >
                    ← Cambiar horario
                  </button>

                  <div className="confirmation-card">
                    <h3 className="section-title">Confirma tu Cita</h3>
                    
                    <div className="appointment-details">
                      <div className="detail-item">
                        <User className="detail-icon" />
                        <span>{selectedTeacher.name} - {selectedTeacher.subject}</span>
                      </div>
                      <div className="detail-item">
                        <Calendar className="detail-icon" />
                        <span className="capitalize">{formatDate(selectedDate)}</span>
                      </div>
                      <div className="detail-item">
                        <Clock className="detail-icon" />
                        <span>{selectedTime}</span>
                      </div>
                    </div>

                    <div className="reason-section">
                      <label className="input-label">Motivo de la consulta</label>
                      <textarea
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        className="reason-textarea"
                        rows="3"
                        placeholder="Describe brevemente el motivo de tu consulta..."
                      />
                    </div>

                    <button
                      onClick={handleBookAppointment}
                      disabled={!appointmentReason.trim()}
                      className="confirm-button"
                    >
                      Confirmar Cita
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <div className="success-icon">
                <Check className="check-icon" />
              </div>
              <h3 className="confirmation-title">¡Cita Confirmada!</h3>
              <p className="confirmation-text">Recibirás un recordatorio por email antes de tu cita</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentView;