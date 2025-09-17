import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import Select from "react-select";
import { eventsData } from "../data/EventosData";
import "./EventosDetalles.css";

const uniqueMonths = [...new Set(eventsData.map(e => e.month))];
const monthOptions = uniqueMonths.map(month => ({
  value: month,
  label: month 
}));

const uniqueCategories = [...new Set(eventsData.map(e => e.category))];
const categoryOptions = uniqueCategories.map(category => ({
  value: category,
  label:
    category === 'academico' ? 'Académico' :
    category === 'padres_familia' ? 'Padres de Familia' :
    category === 'cultural' ? 'Cultural' :
    category === 'deportivo' ? 'Deportivo' :
    category === 'vacaciones' ? 'Vacaciones' :
    category.charAt(0).toUpperCase() + category.slice(1)
}));

const EventosDetalles = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredEvents = eventsData.filter(event => {
    const matchesMonth = !selectedMonth || event.month === selectedMonth.value;
    const matchesCategory = !selectedCategory || event.category === selectedCategory.value;
    return matchesMonth && matchesCategory;
  });

  return (
    <div className="events-school">
      <Navbar />
      <div className="header">
        <h1>Eventos</h1>
        <p>Eventos y actividades de nuestra Comunidad Educativa</p>
      </div>

      <div className="select">
        <div className="group-select">
          <label htmlFor="month">Filtrar por Mes:</label>
          <Select
            id="month"
            className="select-input"
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            placeholder="Elige un mes..."
            isClearable
          />
        </div>

        <div className="group-select">
          <label htmlFor="category">Filtrar por Categoría:</label>
          <Select
            id="category"
            className="select-input"
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Elige una categoría..."
            isClearable
          />
        </div>
      </div>

      <div className="event-container">
        {filteredEvents.length === 0 ? (
          <h3 className="title-event">No hay eventos que coincidan con los filtros seleccionados.</h3>          
        ) : (
          filteredEvents.slice(0, 80).map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-date">
                <p className="event-day">{event.day}</p>
                <p className="event-month">{event.month}</p>
                <p className="event-year">{event.year}</p>
              </div>
              <div className="event-details">
                 <p className="event-time">{event.time}</p>
                <h3 className="event-name">{event.name}</h3>               
                {event.location && <p className="event-location">Lugar: {event.location}</p>}                
              </div>
            </div>
          ))
        )}
      </div>      
    </div>
  );
};

export default EventosDetalles;