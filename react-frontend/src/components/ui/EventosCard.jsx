import "./EventosCard.css"

const EventCard = ({day, month, year, time, name, location}) => {
  return (
    <div className="event-card">
      <div className="event-date">
        <p className="event-day">{day}</p>
        <span className="event-month">{month}</span>
        <p className="event-year">{year}</p>
      </div>
      <div className="event-details">
        <span className="event-time">{time}</span>
        <h3 className="event-name">{name}</h3>
        <p className="event-location">Lugar: {location}</p>       
      </div>
    </div>
  )
}

export default EventCard
