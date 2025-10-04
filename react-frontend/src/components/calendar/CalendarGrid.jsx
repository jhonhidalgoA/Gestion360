// src/components/Calendar/CalendarGrid.jsx
import React from 'react';
import DayCell from './DayCell';
import { generateCalendarDays } from './utils/dateHelpers';

const CalendarGrid = ({ currentDate, events, onDayClick, onEditEvent }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = generateCalendarDays(year, month);

  const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="calendar-grid">
      {dayHeaders.map(day => (
        <div key={day} className="day-header">
          {day}
        </div>
      ))}
      {calendarDays.map((date, index) => (
        <DayCell
          key={index}
          date={date}
          currentMonth={month}
          events={events}
          onDayClick={onDayClick}
          onEditEvent={onEditEvent}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;