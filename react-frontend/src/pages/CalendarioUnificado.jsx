import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Calendar from '../components/calendar/Calendar';
import NavbarSection from '../components/layout/Navbar/NavbarSection';

const CalendarioUnificado = () => {
  const { user } = useAuth();
  const isDocente = user?.role === 'docente';
  const isAdmin = user?.role === 'administrador';

  useEffect(() => {
    console.log("Usuario actual:", user);
  }, [user]);

  if (!isAdmin && !isDocente) {
    return <div>No autorizado</div>;
  }

  return (
    <div>
      <NavbarSection
        title={isDocente ? "Calendario Escolar - Docente" : "Calendario Escolar Administrador"}
        color="#0D47A1"
      />
      <Calendar readOnly={isDocente} />
    </div>
  );
};

export default CalendarioUnificado;