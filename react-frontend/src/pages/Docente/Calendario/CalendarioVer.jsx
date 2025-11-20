import Calendar from '../../../components/calendar/Calendar'
import NavbarSection from '../../../components/layout/Navbar/NavbarSection';

const CalendarioVer = () => {
  return (
    <div>
      <NavbarSection title="Calendario Escolar - Docente" color="#0D47A1" />
      <Calendar readOnly={true} />
    </div>
  )
}

export default CalendarioVer
