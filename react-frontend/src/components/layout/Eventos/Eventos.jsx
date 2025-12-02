// Eventos.jsx (NO TOCAR)
import { Link } from "react-router-dom";
import { eventsData } from "../../../data/EventosData"; 
import EventCard from "../../ui/EventosCard";
import "./Eventos.css";
import white_arrow from '../../icons/white-arrow.png';

const Eventos = ({ cardsToShow = 2, showDetailsButton = false, showMoreButton = true }) => {
  const displayedEvents = eventsData.slice(0, cardsToShow); 

  return (
    <div>
      {displayedEvents.map((event) => (
        <EventCard
          key={event.id}
          day={event.day}
          month={event.month}
          year={event.year}
          time={event.time}
          name={event.name}
          location={event.location}
          showDetailsButton={showDetailsButton}
        />
      ))}
      {showMoreButton && (
        <div className="button">
          <Link to="/evento-detalle" className="btns dark-btn">
            Ver detalles <img src={white_arrow} alt="" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Eventos;