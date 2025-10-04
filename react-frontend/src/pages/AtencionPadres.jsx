import React from 'react';
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
        <h1>Sistema de Citas Escolares</h1>
        <p>Gestión de Atención a Padres de Familia</p>
      </div>

      <div className="content-card">
        {userType === 'parent' ? <ParentView /> : <TeacherView />}
      </div>
    </div>
  );
};

export default AppointmentSystem;