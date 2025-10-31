import React, { useState } from 'react';
import { Calendar, Clock, User, BookOpen, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import './ParentView.css';

const ParentView = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentReason, setAppointmentReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [teachers] = useState([
    { id: 1, name: 'Sofía Giraldo', subject: 'Historia', avatar: 'SG' },
    { id: 2, name: 'Carlos Andres Rodríguez', subject: 'Español', avatar: 'CR' },
    { id: 3, name: 'Ana Lucía Martínez', subject: 'Ciencias', avatar: 'AM' },
    { id: 4, name: 'Luis Angel Montoya', subject: 'Matemáticas', avatar: 'LM' }
  ]);

  // Función para generar disponibilidad de lunes a viernes
  const generateAvailability = () => {
    const availability = {};
    const today = new Date();
    
    // Generar disponibilidad para los próximos 30 días
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Solo lunes a viernes (1-5)
      if (date.getDay() >= 1 && date.getDay() <= 5) {
        const dateStr = date.toISOString().split('T')[0];
        
        // Horarios disponibles (mañana y tarde)
        const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
        const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
        
        // Combinar horarios (algunos días tienen menos disponibilidad)
        let timeSlots = [];
        if (i % 4 === 0) {
          timeSlots = [...morningSlots.slice(0, 3), ...afternoonSlots.slice(0, 3)];
        } else if (i % 4 === 1) {
          timeSlots = [...morningSlots.slice(2, 5), ...afternoonSlots.slice(1, 4)];
        } else if (i % 4 === 2) {
          timeSlots = [...morningSlots, ...afternoonSlots.slice(3)];
        } else {
          timeSlots = [...morningSlots.slice(1), ...afternoonSlots];
        }
        
        availability[dateStr] = timeSlots;
      }
    }
    
    return availability;
  };

  // Disponibilidad base para todos los profesores
  const baseAvailability = generateAvailability();

  const [teacherAvailability] = useState({
    1: baseAvailability,
    2: baseAvailability,
    3: baseAvailability,
    4: baseAvailability
  });

  const [appointments, setAppointments] = useState([]);

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

  // Funciones para el calendario
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const isDateAvailable = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availableDates.includes(dateStr);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isWeekend = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-empty-day" />);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isAvailable = isDateAvailable(date);
      const isSelected = selectedDate === dateStr;
      const today = isToday(date);
      const weekend = isWeekend(date);
      
      days.push(
        <button
          key={day}
          onClick={() => isAvailable && setSelectedDate(dateStr)}
          disabled={!isAvailable}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${today ? 'today' : ''} ${isAvailable ? 'available' : 'unavailable'} ${weekend ? 'weekend' : ''}`}
        >
          {day}
        </button>
      );
    }
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="calendar-nav-button"
          >
            <ChevronLeft size={20} />
          </button>
          <h4 className="calendar-month-title">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="calendar-nav-button"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Días de la semana */}
        <div className="calendar-weekdays">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        
        {/* Días del mes */}
        <div className="calendar-days-grid">
          {days}
        </div>
        
        {/* Leyenda del calendario */}
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color today-legend"></div>
            <span>Hoy</span>
          </div>
          <div className="legend-item">
            <div className="legend-color available-legend"></div>
            <span>Disponible</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unavailable-legend"></div>
            <span>No disponible</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="parent-view-container">
      <div className="header-banner">
        <div className="banner-content">
          <AlertCircle className="banner-icon" />
          <div>
            <h3>Reserva tu cita</h3>
            <p>Selecciona un docente y elige el horario disponible que mejor te convenga</p>
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
                    <h4>{teacher.name}</h4>
                    <p className="teacher-subject">
                      <BookOpen className="subject-icon" />
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

          <div className="selected-teacher-banner">
            <div className="selected-teacher-info">
              <div className="selected-teacher-avatar">
                {selectedTeacher.avatar}
              </div>
              <div>
                <h4>{selectedTeacher.name}</h4>
                <p>{selectedTeacher.subject}</p>
              </div>
            </div>
          </div>

          {/* Layout de 2 columnas: Calendario y Horarios */}
          <div className="appointment-scheduler">
            {/* Columna de Calendario */}
            <div className="calendar-section">
              <h3>Selecciona una Fecha</h3>
              {renderCalendar()}
            </div>

            {/* Columna de Horarios */}
            <div className="time-section">
              <h3>{selectedDate ? 'Selecciona un Horario' : 'Horarios Disponibles'}</h3>
              {!selectedDate ? (
                <div className="empty-time-section">
                  <Clock className="empty-icon" />
                  <p>Selecciona una fecha del calendario<br/>para ver los horarios disponibles</p>
                </div>
              ) : (
                <div>
                  <div className="selected-date-info">
                    <p>{formatDate(selectedDate)}</p>
                  </div>
                  <div className="time-slots-grid">
                    {teacherAvailability[selectedTeacher.id][selectedDate] && 
                     teacherAvailability[selectedTeacher.id][selectedDate].map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      >
                        <Clock className="time-icon" />
                        <span>{time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Confirmación */}
          {selectedTime && (
            <div className="confirmation-section">
              <h3>Confirma tu Cita</h3>
              
              <div className="appointment-details">
                <div className="detail-item">
                  <User className="detail-icon" />
                  <span>{selectedTeacher.name} - {selectedTeacher.subject}</span>
                </div>
                <div className="detail-item">
                  <Calendar className="detail-icon" />
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="detail-item">
                  <Clock className="detail-icon" />
                  <span>{selectedTime}</span>
                </div>
              </div>

              <div className="reason-input">
                <label>Motivo de la consulta</label>
                <textarea
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
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
          )}
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <div className="success-icon">
              <Check className="check-icon" />
            </div>
            <h3>¡Cita Confirmada!</h3>
            <p>Recibirás un recordatorio por email antes de tu cita</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentView;