import React from "react";
import { Calendar } from "lucide-react";
import "./TaskStudent.css";

const TaskCard = ({
  task,
  onViewDetails,
  variant = "default"
 
}) => {
  const { subject, title, description, dueDate, status, icon, color } = task;

  const getStatusClass = (status) => {
    switch (status) {
      case "Completado":
        return "completed";
      case "En proceso":
        return "in-progress";
      case "Pendiente":
        return "pending";
      default:
        return "pending";
    }
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(task);
    }
  };

  if (variant === "compact") {
    return (
      <div
        className="task-card compact"
        style={{
          background: color
        }}
      >
        <div className="task-header">
          <div className="task-meta">
            <span className="task-icon">{icon}</span>
            <div>
              <span className="subject-tag">{subject}</span>
            </div>
          </div>
          <span className={`status-tag ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
        <h3 className="task-title">{title}</h3>
        <div className="task-footer">
          <div className="due-date">
            <Calendar className="icon-small" />
            <span className="date-text">Entrega: {dueDate}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="schedule-card-student"
      style={{
        background: color
      }}
    >
      <div className="task-header">
        <div className="task-meta">
          <span className="task-icon">{icon}</span>
          <div>
            <span className="subject-tag">{subject}</span>
          </div>
        </div>
        <span className={`status-tag ${getStatusClass(status)}`}>{status}</span>
      </div>
      <h3 className="task-title">{title}</h3>
      <p className="task-description">{description}</p>
      <div className="task-footer">
        <div className="due-date">
          <Calendar className="icon-small" />
          <span className="date-text">Fecha de Entrega: {dueDate}</span>
        </div>
        <button onClick={handleViewDetails} className="details-btn">
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
