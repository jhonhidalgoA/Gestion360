// src/components/Calendar/Calendar.jsx
import { useCalendar } from './hooks/useCalendar';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventsList from './EventsList';
import EventModal from './EventModal';
import NavbarSection from "../layout/Navbar/NavbarSection";
import './Calendar.css';

const Calendar = () => {
  const {
    currentDate,
    events,
    isModalOpen,
    selectedDate,
    selectedColor,
    editingEventId,
    setSelectedColor,
    previousMonth,
    nextMonth,
    openModal,
    closeModal,
    addEvent,
    updateEvent,
    deleteEvent,
    editEvent,
    getEventById,
    getCurrentMonthEvents
  } = useCalendar();

  const handleSaveEvent = (eventData) => {
    if (editingEventId) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
  };

  const monthEvents = getCurrentMonthEvents();
  const editingEvent = editingEventId ? getEventById(editingEventId) : null;

  return (
    <div className="calendar-container">
     <NavbarSection title="Calendario Escolar Administrador" color="#0D47A1" />
      <div className="container-header">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
        />

        <div className="calendar-section">
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onDayClick={openModal}
            onEditEvent={editEvent}
          />
          <div className="calendar-event">
            <EventsList
            events={monthEvents}
            onEdit={editEvent}
            onDelete={deleteEvent}
          />
          </div>
          
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Calendar;