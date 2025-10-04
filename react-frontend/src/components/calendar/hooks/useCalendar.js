// src/hooks/useCalendar.js
import { useState } from 'react';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedColor, setSelectedColor] = useState('red');
  const [editingEventId, setEditingEventId] = useState(null);

  // Navegación del calendario
  const previousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Modal
  const openModal = (date) => {
    setEditingEventId(null);
    setSelectedDate(date);
    setSelectedColor('red');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEventId(null);
    setSelectedDate(null);
    setSelectedColor('red');
  };

  // Gestión de eventos
  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData
    };
    setEvents(prev => [...prev, newEvent]);
    closeModal();
  };

  const updateEvent = (eventData) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === editingEventId ? { ...event, ...eventData } : event
      )
    );
    closeModal();
  };

  const deleteEvent = (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const editEvent = (id) => {
    const event = events.find(e => e.id === id);
    if (!event) return;

    setEditingEventId(id);
    setSelectedDate(new Date(event.startDate));
    setSelectedColor(event.color);
    setIsModalOpen(true);
  };

  // Obtener evento por ID
  const getEventById = (id) => {
    return events.find(e => e.id === id);
  };

  // Obtener eventos del mes actual
  const getCurrentMonthEvents = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    return events.filter(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      return startDate <= monthEnd && endDate >= monthStart;
    });
  };

  return {
    // Estado
    currentDate,
    events,
    isModalOpen,
    selectedDate,
    selectedColor,
    editingEventId,
    
    // Setters
    setSelectedColor,
    
    // Funciones
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
  };
};