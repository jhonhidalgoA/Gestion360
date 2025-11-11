// src/components/Calendar/CalendarHeader.jsx
import React from 'react';
import { months } from './utils/dateHelpers';

const CalendarHeader = ({ currentDate, onPreviousMonth, onNextMonth }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  return (
    <div className="header__calendar">
      <div className="calendar-nav">
        <button className="calendar-btn" onClick={onPreviousMonth}>
          ← Anterior
        </button>
        <div className="current-month">
          {months[month]} {year}
        </div>
        <button className="calendar-btn" onClick={onNextMonth}>
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;