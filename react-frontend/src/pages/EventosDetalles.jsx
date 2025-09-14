import { useEffect } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import Eventos from "../components/layout/Eventos/Eventos";
import Select from "react-select";
import {eventsData} from "../data/EventosData"
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
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="events-school">
      <Navbar />
      <div className="header">
        <h1>Eventos</h1>
        <p>Eventos y actividades de nuestra Comunidad Educativa</p>
      </div>
      <div className="select">
        <div className="group-select">
          <label htmlFor="date">Filtrar por Mes:</label>
           <Select
           id="month"
           className="select-input"
           options={monthOptions}
           placeholder="Elige un mes..."
           isClearable
           />
        </div>
        <div className="group-select">
          <label htmlFor="date">Filtrar por Categoría:</label>
           <Select
            id = "category"
            className ="select-input"
            options={categoryOptions}
            placeholder="Elige una categoría..."
            isClearable
            />
        </div>
      </div>         
      <Eventos cardsToShow={40} showMoreButton={false} />
    </div>
  );
};

export default EventosDetalles;
