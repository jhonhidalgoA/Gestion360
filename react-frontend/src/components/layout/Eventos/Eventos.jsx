import { eventsData } from "../../../data/EventsData";
import EventCard from "../../ui/EventosCard";
import "./Eventos.css";
import white_arrow from '../../icons/white-arrow.png'

const Eventos = () => {
  return (
    <div className="event-container">
      {eventsData.map((event) => (
        <EventCard
          key={event.id}
          day={event.day}
          month={event.month}
          year={event.year}
          time={event.time}
          name={event.name}
          location={event.location}
        />
      ))}
      <div className="button">
        <button className="btn dark-btn">
          Ver detalles <img src={white_arrow} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Eventos;
