// src/components/Calendar/DayCell.jsx
import React from 'react';
import EventBar from './EventBar';
import { isToday, isDateInRange } from './utils/dateHelpers';

const DayCell = ({ date, currentMonth, events, onDayClick, onEditEvent }) => {
  const isOtherMonth = date.getMonth() !== currentMonth;
  const isTodayDate = isToday(date);

  // Filtrar eventos que corresponden a este día
  const dayEvents = events.filter(event =>
    isDateInRange(date, event.startDate, event.endDate)
  );

  const handleClick = () => {
    onDayClick(date);
  };

  const cellClasses = [
    'day-cell',
    isOtherMonth && 'other-month',
    isTodayDate && 'today'
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClasses} onClick={handleClick}>
      <div className="day-number">{date.getDate()}</div>
      {dayEvents.map(event => (
        <EventBar
          key={event.id}
          event={event}
          cellDate={date}
          onEdit={onEditEvent}
        />
      ))}
    </div>
  );
};

export default DayCell;