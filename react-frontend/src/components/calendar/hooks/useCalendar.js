import { useState, useEffect } from "react";

const useCalendar = (readOnly = false) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#3498db");
  const [editingEventId, setEditingEventId] = useState(null);

  // Cargar eventos al iniciar
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch("http://localhost:8000/events/");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Error al cargar eventos:", err);
    }
  };

  const previousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const openModal = (date) => {
    if (readOnly) return;
    setSelectedDate(date);
    setIsModalOpen(true);
    setEditingEventId(null);
    setSelectedColor("#3498db");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingEventId(null);
  };

  const addEvent = async (eventData) => {
    if (readOnly) return;
    try {
      const res = await fetch("http://localhost:8000/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents((prev) => [...prev, newEvent]);
        closeModal();
      }
    } catch (err) {
      console.error("Error al crear evento:", err);
    }
  };

  const updateEvent = async (eventData) => {
    if (readOnly) return;
    try {
      const res = await fetch(
        `http://localhost:8000/events/${editingEventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );
      if (res.ok) {
        const updatedEvent = await res.json();
        setEvents((prev) =>
          prev.map((e) => (e.id === editingEventId ? updatedEvent : e))
        );
        closeModal();
      }
    } catch (err) {
      console.error("Error al actualizar evento:", err);
    }
  };

  const deleteEvent = async (eventId) => {
    if (readOnly) return;
    try {
      await fetch(`http://localhost:8000/events/${eventId}`, {
        method: "DELETE",
      });
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error("Error al eliminar evento:", err);
    }
  };

  const editEvent = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedDate(new Date(event.start_date));
      setSelectedColor(event.color);
      setEditingEventId(eventId);
      setIsModalOpen(true);
    }
  };

  const getEventById = (id) => {
    return events.find((e) => e.id === id) || null;
  };

  const getCurrentMonthEvents = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return events.filter((event) => {
      // Convertir strings a Date solo si son strings
      const start =
        typeof event.start_date === "string"
          ? new Date(event.start_date)
          : event.start_date;
      const end =
        typeof event.end_date === "string"
          ? new Date(event.end_date)
          : event.end_date;

      return (
        (start.getFullYear() === year && start.getMonth() + 1 === month) ||
        (end.getFullYear() === year && end.getMonth() + 1 === month)
      );
    });
  };

  return {
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
    getCurrentMonthEvents,
  };
};

export { useCalendar };
