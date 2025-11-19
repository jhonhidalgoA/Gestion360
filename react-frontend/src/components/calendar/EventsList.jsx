// src/components/Calendar/EventsList.jsx
import React from 'react';
import { getDateRangeString } from './utils/dateHelpers';

const EventsList = ({ events, onEdit, onDelete }) => {
  if (events.length === 0) {
    return (
      <div className="events-display">
        <h3>Eventos del Mes</h3>
        <div id="eventsList">
          <p style={{ textAlign: 'center', opacity: 0.7 }}>
            No hay eventos este mes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-display">
      <h3>Eventos del Mes</h3>
      <div id="eventsList">
        {events.map(event => {
          const dateRange = getDateRangeString(event.start_date, event.end_date);

          return (
            <div key={event.id} className="event-item">
              <div className="event-info">
                <div className="event-title">{event.title}</div>
                <div className="event-dates">{dateRange}</div>
              </div>
              <div className="event-actions">
                <button
                  className="edit-btn"
                  onClick={() => onEdit(event.id)}
                  title="Editar evento"
                >
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(event.id)}
                  title="Eliminar evento"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsList;