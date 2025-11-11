import ParentView from './ParentView';
import TeacherView from './TeacherView';
import Navbar from "../components/layout/Navbar/Navbar";
import './AtencionPadres.css';

const AppointmentSystem = () => {  
  const userType = 'parent'; 

  return (
    <div className="appointment-container">
      <Navbar />  
      <div className="title-appointment">
        <h1>Reserva tu cita</h1>
        <p>Selecciona un docente y elige el horario disponible que mejor te convenga</p>
      </div>

      <div className="content-card">
        {userType === 'parent' ? <ParentView /> : <TeacherView />}
      </div>
    </div>
  );
};

export default AppointmentSystem;