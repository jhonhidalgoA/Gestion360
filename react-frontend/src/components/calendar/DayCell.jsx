// src/components/Calendar/DayCell.jsx
import React from "react";

const DayCell = ({ date, currentMonth, events, onDayClick, onEditEvent }) => {
  const isCurrentMonth = date.getMonth() === currentMonth;
  const day = date.getDate();
  const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

  // Formato "YYYY-MM-DD" para comparar con start_date/end_date
  const formatDate = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const dateString = formatDate(date);

  // Filtrar eventos que ocurran en este día
  const eventsOnDay = events.filter((event) => {
    return dateString >= event.start_date && dateString <= event.end_date;
  });

  const handleDayClick = () => {
    if (isCurrentMonth) {
      onDayClick(date);
    }
  };

  return (
    <div
      className={`day-cell ${isCurrentMonth ? "" : "other-month"} ${
        isToday(date) ? "today" : ""
      }`}
      onClick={handleDayClick}
    >
      <div className="day-number">{day}</div>
      <div className="events-container">
        {eventsOnDay.map((event) => {
          // Determinar clase de color
          const colorClass = event.color
            ? `color-${
                event.color.startsWith("#")
                  ? getColorName(event.color)
                  : event.color
              }`
            : "color-blue";

          // Si usas HEX, necesitas mapear a nombre
          function getColorName(hex) {
            const colorMap = {
              "#ef4444": "red",
              "#3b82f6": "blue",
              "#10b981": "green",
              "#a855f7": "purple",
              "#f97316": "orange",
              "#14b8a6": "teal",
              "#6366f1": "indigo",
              "#ec4899": "pink",
            };
            return colorMap[hex] || "blue";
          }

          return (
            <div
              key={event.id}
              className={`event-bar ${colorClass}`}
              onClick={(e) => {
                e.stopPropagation();
                onEditEvent(event.id);
              }}
              title={event.title}
            >
              {event.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayCell;
