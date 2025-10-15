import React, { useState } from "react";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import { useNavigate } from "react-router-dom";
import "./TareaVer.css";
import {
  FiAlertCircle,
  FiCalendar,
  FiClock,
  FiFileText,
  FiAward,
  FiMessageCircle,
  FiBell,
  FiDownload,
  FiX,
  FiCheck,
} from "react-icons/fi";

const TareaVer = () => {
  const currentDay = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
  });
  const currentTime = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);

  // Datos de ejemplo
  const tasks = [
    {
      id: 1,
      title: "Ejercicios páginas 45-47",
      subject: "Matemáticas",
      subjectColor: "subject-math",
      status: "Pendiente",
      statusColor: "status-pending",
      dueDate: "2024-10-12",
      dueTime: "11:59 PM",
      daysLeft: 2,
      description:
        "Resolver todos los ejercicios del capítulo 3 sobre ecuaciones cuadráticas. Se debe incluir el procedimiento completo y verificar las respuestas.",
      teacherName: "Prof. María González",
      resources: [
        { id: 1, name: "Guía_ejercicios.pdf", type: "pdf", size: "2.3 MB" },
        { id: 2, name: "Video tutorial", type: "video", url: "https://..." },
      ],
      criteria: [
        { name: "Procedimiento completo", points: 40 },
        { name: "Respuestas correctas", points: 60 },
      ],
      grade: null,
      feedback: null,
      submittedDate: null,
    },
    {
      id: 2,
      title: "Lectura y resumen del capítulo 3",
      subject: "Español",
      subjectColor: "subject-spanish",
      status: "Calificada",
      statusColor: "status-graded",
      dueDate: "2024-10-10",
      dueTime: "11:59 PM",
      daysLeft: -3,
      description:
        "Leer el capítulo 3 de 'Cien años de soledad' y elaborar un resumen de 2 páginas identificando personajes principales y temas centrales.",
      teacherName: "Prof. Carlos Ramírez",
      resources: [
        { id: 1, name: "Capítulo_3.pdf", type: "pdf", size: "1.8 MB" },
      ],
      criteria: [
        { name: "Comprensión lectora", points: 30 },
        { name: "Análisis de personajes", points: 35 },
        { name: "Redacción", points: 35 },
      ],
      grade: 92,
      feedback:
        "Excelente análisis de los personajes. La redacción es clara y coherente. Sugiero profundizar más en los símbolos literarios para la próxima entrega.",
      submittedDate: "2024-10-10 10:30 AM",
      studentComment: "Archivo entregado el 10 de octubre a las 10:30 AM",
    },
    {
      id: 3,
      title: "Investigación sobre el sistema solar",
      subject: "Ciencias",
      subjectColor: "subject-science",
      status: "En proceso",
      statusColor: "status-in-progress",
      dueDate: "2024-10-14",
      dueTime: "11:59 PM",
      daysLeft: 1,
      description:
        "Realizar una investigación sobre los planetas del sistema solar, incluyendo características principales, composición y curiosidades.",
      teacherName: "Prof. Ana Martínez",
      resources: [
        {
          id: 1,
          name: "Plantilla_investigación.docx",
          type: "doc",
          size: "245 KB",
        },
        { id: 2, name: "Referencias_NASA.pdf", type: "pdf", size: "5.2 MB" },
      ],
      criteria: [
        { name: "Investigación completa", points: 40 },
        { name: "Presentación visual", points: 30 },
        { name: "Referencias bibliográficas", points: 30 },
      ],
      grade: null,
      feedback: null,
      submittedDate: "Borrador guardado",
      studentComment: "Borrador guardado el 12 de octubre",
    },
  ];

  const getUrgencyClass = (daysLeft) => {
    if (daysLeft < 0) return "urgency-overdue";
    if (daysLeft === 0) return "urgency-today";
    if (daysLeft <= 1) return "urgency-tomorrow";
    if (daysLeft <= 3) return "urgency-soon";
    return "urgency-normal";
  };

  const getUrgencyBg = (daysLeft) => {
    if (daysLeft < 0) return "urgency-bg-overdue";
    if (daysLeft === 0) return "urgency-bg-today";
    if (daysLeft <= 1) return "urgency-bg-tomorrow";
    if (daysLeft <= 3) return "urgency-bg-soon";
    return "urgency-bg-normal";
  };

  const getTimeLeftText = (daysLeft) => {
    if (daysLeft < 0) return `Entregada hace ${Math.abs(daysLeft)} días`;
    if (daysLeft === 0) return "¡Vence hoy!";
    if (daysLeft === 1) return "Vence mañana";
    return `Faltan ${daysLeft} días`;
  };

  const handleBack = () => {
    navigate("/padrefamilia");
  };

  return (
    <div className="task-view">
      <NavbarModulo />
      <div className="page-container">
        <div className="header-section">
          <button onClick={handleBack} className="back-button">
            <span className="back-icon">←</span>
            Volver al inicio
          </button>
          <div className="current-info">
            <div className="current-day">
              <span className="label">Hoy es:</span>
              <span className="value">{currentDay}</span>
            </div>
            <div className="current-time">
              <span className="time-value">{currentTime}</span>
            </div>
          </div>
        </div>
        <div className="page-title">
          <h4>Tareas y Trabajos</h4>
        </div>
        <div className="alert-container">
          <div className="alert-box">
            <div className="alert-icon">
              <FiAlertCircle />
            </div>
            <div className="alert-content">
              <p className="alert-title">Información para Padres</p>
              <p className="alert-description">
                Esta vista es de carácter informativo y de solo lectura. Para
                realizar consultas relacionadas con la tarea o su calificación,
                por favor comuníquese directamente con el docente a través del
                módulo de comunicación institucional.
              </p>
            </div>
          </div>
        </div>

       
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="task-card"
              onClick={() => setSelectedTask(task)}
            >
              <div className="card-content ">
                <div className="card-header">
                  <span className={`subject-badge ${task.subjectColor}`}>
                    {task.subject}
                  </span>
                  <span className={`status-badge ${task.statusColor}`}>
                    {task.status}
                  </span>
                </div>

                <h3 className="task-title">{task.title}</h3>

                {/* Fecha de entrega */}
                <div
                  className={`due-date-container ${getUrgencyBg(
                    task.daysLeft
                  )}`}
                >
                  <div className="due-date-item">
                    <FiCalendar className={getUrgencyClass(task.daysLeft)} />
                    <span
                      className={`due-date-text ${getUrgencyClass(
                        task.daysLeft
                      )}`}
                    >
                      {task.dueDate}
                    </span>
                  </div>
                  <div className="due-date-item">
                    <FiClock className={getUrgencyClass(task.daysLeft)} />
                    <span
                      className={`time-left ${getUrgencyClass(task.daysLeft)}`}
                    >
                      {getTimeLeftText(task.daysLeft)}
                    </span>
                  </div>
                </div>

                {/* Grade Display */}
                {task.grade !== null && (
                  <div className="grade-display">
                    <div className="grade-content">
                      <span className="grade-label">Calificación:</span>
                      <div className="grade-value">
                        <FiAward className="grade-icon" />
                        <span className="grade-number">{task.grade}</span>
                        <span className="grade-max">/100</span>
                      </div>
                    </div>
                  </div>
                )}
                <button className="details-button">
                  <span> <FiFileText  /></span>  
                  <p>Ver Detalles... </p>               
                  
                </button> 
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Detalles */}
        {selectedTask && (
          <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-badges">
                  <span
                    className={`subject-badge ${selectedTask.subjectColor}`}
                  >
                    {selectedTask.subject}
                  </span>
                  <span className={`status-badge ${selectedTask.statusColor}`}>
                    {selectedTask.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="modal-close"
                >
                  <FiX />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {/* Título */}
                <div className="modal-title-section">
                  <h2>{selectedTask.title}</h2>
                  <p className="teacher-name">
                    Docente: {selectedTask.teacherName}
                  </p>
                </div>

                {/* Fecha de entrega */}
                <div
                  className={`due-date-modal ${getUrgencyBg(
                    selectedTask.daysLeft
                  )}`}
                >
                  <h3 className="due-date-title">
                    <FiCalendar />
                    Fecha de Entrega
                  </h3>
                  <div className="due-date-grid">
                    <div className="due-date-info">
                      <p className="due-date-label">Fecha límite</p>
                      <p
                        className={`due-date-value ${getUrgencyClass(
                          selectedTask.daysLeft
                        )}`}
                      >
                        {selectedTask.dueDate}
                      </p>
                    </div>
                    <div className="due-date-info">
                      <p className="due-date-label">Hora límite</p>
                      <p
                        className={`due-date-value ${getUrgencyClass(
                          selectedTask.daysLeft
                        )}`}
                      >
                        {selectedTask.dueTime}
                      </p>
                    </div>
                  </div>
                  <div className="time-left-section">
                    <p
                      className={`time-left-modal ${getUrgencyClass(
                        selectedTask.daysLeft
                      )}`}
                    >
                      {getTimeLeftText(selectedTask.daysLeft)}
                    </p>
                  </div>
                </div>

                {/* Estado de entrega del estudiante */}
                {selectedTask.submittedDate && (
                  <div className="submission-status">
                    <div className="submission-content">
                      <FiCheck className="submission-icon" />
                      <div>
                        <p className="submission-title">Estado de la entrega</p>
                        <p className="submission-detail">
                          {selectedTask.studentComment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calificación y Retroalimentación */}
                {selectedTask.grade !== null && (
                  <div className="grade-feedback">
                    <div className="grade-header">
                      <FiAward className="grade-header-icon" />
                      <h3>Calificación Final</h3>
                    </div>

                    <div className="grade-display-modal">
                      <div className="grade-score">
                        <span className="grade-number-modal">
                          {selectedTask.grade}
                        </span>
                        <span className="grade-max-modal">/100</span>
                      </div>
                      <div className="grade-progress">
                        <div
                          className="grade-progress-bar"
                          style={{ width: `${selectedTask.grade}%` }}
                        />
                      </div>
                    </div>

                    {selectedTask.feedback && (
                      <div className="feedback-section">
                        <div className="feedback-content">
                          <FiMessageCircle className="feedback-icon" />
                          <div>
                            <p className="feedback-title">
                              Retroalimentación del Docente:
                            </p>
                            <p className="feedback-text">
                              {selectedTask.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Descripción */}
                <div className="description-section">
                  <h3 className="section-title">
                    <FiFileText />
                    Descripción de la Tarea
                  </h3>
                  <p className="description-text">{selectedTask.description}</p>
                </div>

                {/* Recursos */}
                <div className="resources-section">
                  <h3 className="section-title">
                    <FiDownload />
                    Recursos y Materiales
                  </h3>
                  <div className="resources-list">
                    {selectedTask.resources.map((resource) => (
                      <div key={resource.id} className="resource-item">
                        <div className="resource-info">
                          <FiFileText className="resource-icon" />
                          <div>
                            <p className="resource-name">{resource.name}</p>
                            {resource.size && (
                              <p className="resource-size">{resource.size}</p>
                            )}
                          </div>
                        </div>
                        <FiDownload className="resource-download" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Criterios de Evaluación */}
                <div className="criteria-section">
                  <h3 className="section-title">
                    <FiAward />
                    Criterios de Evaluación
                  </h3>
                  <div className="criteria-list">
                    {selectedTask.criteria.map((criterion, index) => (
                      <div key={index} className="criterion-item">
                        <span className="criterion-name">{criterion.name}</span>
                        <span className="criterion-points">
                          {criterion.points} pts
                        </span>
                      </div>
                    ))}
                    <div className="criteria-total">
                      <span className="total-label">Total</span>
                      <span className="total-points">
                        {selectedTask.criteria.reduce(
                          (sum, c) => sum + c.points,
                          0
                        )}{" "}
                        pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nota informativa para padres */}
                <div className="parent-note">
                  <div className="parent-note-content">
                    <FiAlertCircle className="parent-note-icon" />
                    <div>
                      <p className="parent-note-title">
                        Información para Padres
                      </p>
                      <p className="parent-note-text">
                        Esta vista es de solo lectura. Para consultas sobre la
                        tarea o calificación, puede comunicarse directamente con
                        el docente {selectedTask.teacherName} a través del
                        módulo de comunicación.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TareaVer;
