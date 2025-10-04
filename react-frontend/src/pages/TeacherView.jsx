import {useState} from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import './TeacherView.css';

const TeacherView = () => {
  const [appointments] = useState([
    { id: 1, teacherId: 1, date: '2025-10-06', time: '10:30', parent: 'Juan Sánchez', reason: 'Rendimiento académico', status: 'confirmed' },
    { id: 2, teacherId: 2, date: '2025-10-07', time: '10:30', parent: 'Laura Torres', reason: 'Comportamiento en clase', status: 'confirmed' }
  ]);

  const [teacherSchedule] = useState({
    monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '16:00' }],
    tuesday: [{ start: '10:00', end: '12:00' }, { start: '14:00', end: '16:00' }],
    wednesday: [{ start: '09:00', end: '11:00' }],
    thursday: [{ start: '10:00', end: '12:00' }, { start: '15:00', end: '17:00' }],
    friday: [{ start: '09:00', end: '12:00' }]
  });

  const myAppointments = appointments.filter(apt => apt.teacherId === 1);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="teacher-view">
      <div className="info-banner info-banner-green">
        <div className="info-banner-content">
          <AlertCircle className="info-banner-icon" />
          <div>
            <h3 className="info-banner-title">Panel del Docente</h3>
            <p className="info-banner-text">Gestiona tus horarios disponibles y revisa tus citas programadas</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <p className="stat-label">Citas Programadas</p>
          <p className="stat-value">{myAppointments.length}</p>
        </div>
        <div className="stat-card stat-green">
          <p className="stat-label">Horarios Disponibles</p>
          <p className="stat-value">15</p>
        </div>
        <div className="stat-card stat-purple">
          <p className="stat-label">Esta Semana</p>
          <p className="stat-value">3</p>
        </div>
      </div>

      <div>
        <h3 className="section-title">Próximas Citas</h3>
        <div className="appointments-list">
          {myAppointments.map(apt => (
            <div key={apt.id} className="appointment-card">
              <div className="appointment-content">
                <div className="appointment-header">
                  <div className="appointment-avatar">
                    {apt.parent.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="appointment-info">
                    <p className="appointment-parent">{apt.parent}</p>
                    <p className="appointment-reason">{apt.reason}</p>
                  </div>
                </div>
                <div className="appointment-details">
                  <span className="appointment-detail">
                    <Calendar className="detail-icon-small" />
                    <span className="capitalize">{formatDate(apt.date)}</span>
                  </span>
                  <span className="appointment-detail">
                    <Clock className="detail-icon-small" />
                    {apt.time}
                  </span>
                </div>
                <span className="status-badge">
                  Confirmada
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="section-title">Configurar Disponibilidad</h3>
        <div className="schedule-card">
          <p className="schedule-description">Define los horarios en los que estarás disponible para atender a padres</p>
          {Object.entries(teacherSchedule).map(([day, slots]) => (
            <div key={day} className="day-schedule">
              <p className="day-name capitalize">
                {day === 'monday' ? 'Lunes' : day === 'tuesday' ? 'Martes' : day === 'wednesday' ? 'Miércoles' : day === 'thursday' ? 'Jueves' : 'Viernes'}
              </p>
              <div className="time-slots">
                {slots.map((slot, idx) => (
                  <div key={idx} className="time-slot">
                    <Clock className="time-slot-icon" />
                    <span>{slot.start} - {slot.end}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherView;