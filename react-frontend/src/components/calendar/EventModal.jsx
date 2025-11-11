// src/components/Calendar/EventModal.jsx
import React, { useState, useEffect } from 'react';
import { formatDateForInput } from './utils/dateHelpers';

const COLORS = ['red', 'blue', 'green', 'purple', 'orange', 'teal', 'indigo', 'pink'];

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  selectedColor,
  setSelectedColor,
  editingEvent
}) => {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setFormData({
          title: editingEvent.title,
          startDate: editingEvent.startDate,
          endDate: editingEvent.endDate
        });
        setSelectedColor(editingEvent.color);
      } else if (selectedDate) {
        const dateStr = formatDateForInput(selectedDate);
        setFormData({
          title: '',
          startDate: dateStr,
          endDate: dateStr
        });
        setSelectedColor('red');
      }
    }
  }, [isOpen, selectedDate, editingEvent, setSelectedColor]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, startDate, endDate } = formData;

    if (!title.trim() || !startDate || !endDate || !selectedColor) {
      alert('⚠️ Todos los campos son obligatorios');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('❌ La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }

    onSave({
      title: title.trim(),
      startDate,
      endDate,
      color: selectedColor
    });

    setFormData({ title: '', startDate: '', endDate: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modals" onClick={handleModalClick}>
      <div className="modals-content">
        <div className="modals-header">
          <h3 id="modalTitle">
            {editingEvent ? '✏️ Editar Evento' : 'Agregar Evento'}
          </h3>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modals-body">
          <form id="eventForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Título del Evento:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Nombre del evento"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Fecha de Inicio:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">Fecha de Fin:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Color del Evento:</label>
              <div className="color-selector">
                {COLORS.map(color => (
                  <div
                    key={color}
                    className={`color-option color-${color} ${
                      selectedColor === color ? 'selected' : ''
                    }`}
                    data-color={color}
                    onClick={() => handleColorClick(color)}
                  />
                ))}
              </div>
            </div>
          </form>
        </div>
        <div className="modals-footer">
          <button
            type="button"
            className="btn-calendar btn-calendar-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="eventForm"            
            className="btn-calendar btn-calendar-primary"
          >
            {editingEvent ? 'Actualizar Evento' : 'Agregar Evento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;