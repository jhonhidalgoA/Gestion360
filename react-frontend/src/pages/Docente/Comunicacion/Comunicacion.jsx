import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import React, { useState } from "react";
import "./Comunicacion.css";
import { FaWhatsapp } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { FaBell } from "react-icons/fa6";

const CommunicationModule = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const groups = [
    { id: "1", name: "Preescolar A", students: 15 },
    { id: "2", name: "1° Primaria B", students: 20 },
    { id: "3", name: "2° Primaria A", students: 18 },
    { id: "4", name: "5° Bachillerato", students: 25 },
  ];

  const students = {
    1: [
      {
        id: "1",
        name: "Ana García",
        parent: "María García",
        phone: "+57 300 123 4567",
        email: "maria.garcia@email.com",
      },
      {
        id: "2",
        name: "Carlos Pérez",
        parent: "Juan Pérez",
        phone: "+57 301 234 5678",
        email: "juan.perez@email.com",
      },
      {
        id: "3",
        name: "Laura Martínez",
        parent: "Sofia Martínez",
        phone: "+57 302 345 6789",
        email: "sofia.martinez@email.com",
      },
    ],
    2: [
      {
        id: "4",
        name: "Diego López",
        parent: "Roberto López",
        phone: "+57 303 456 7890",
        email: "roberto.lopez@email.com",
      },
      {
        id: "5",
        name: "Elena Torres",
        parent: "Carmen Torres",
        phone: "+57 304 567 8901",
        email: "carmen.torres@email.com",
      },
    ],
  };

  const channels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <FaWhatsapp size={50} />,
      color: "#25D366",
      description: "Mensaje instantáneo",
    },
    {
      id: "email",
      name: "Email",
      icon: <FaEnvelope size={50}  />,
      color: "#4285F4",
      description: "Correo electrónico",
    },
    {
      id: "sms",
      name: "SMS",
      icon: <FaPhone size={40} />,
      color: "#9C27B0",
      description: "Mensaje de texto",
    },
    {
      id: "push",
      name: "Notificación",
      icon: <FaBell size={50} />,
      color: "#FF9800",
      description: "App móvil",
    },
  ];

  const templates = [
    {
      id: "reunion",
      name: "Reunión de padres",
      content:
        "Estimado padre de familia, le informamos que tendremos una reunión el día [FECHA] a las [HORA] para tratar asuntos importantes del grupo.",
    },
    {
      id: "tarea",
      name: "Recordatorio de tarea",
      content:
        "Buen día, este es un recordatorio sobre la tarea asignada para [FECHA]. Por favor asegúrese de que su hijo/a la complete a tiempo.",
    },
    {
      id: "evento",
      name: "Evento escolar",
      content:
        "Cordial saludo, queremos invitarle al evento [NOMBRE_EVENTO] que se realizará el [FECHA]. Su participación es muy importante.",
    },
    {
      id: "felicitacion",
      name: "Felicitación",
      content:
        "¡Felicitaciones! Su hijo/a [NOMBRE] ha tenido un desempeño destacado en [ACTIVIDAD]. Queremos reconocer su esfuerzo.",
    },
  ];

  const recentCommunications = [
    {
      date: "2024-10-09",
      type: "whatsapp",
      recipients: 15,
      subject: "Reunión trimestral",
    },
    {
      date: "2024-10-08",
      type: "email",
      recipients: 1,
      subject: "Recordatorio tarea matemáticas",
    },
    {
      date: "2024-10-07",
      type: "sms",
      recipients: 20,
      subject: "Suspensión de clases",
    },
  ];

  const handleChannelToggle = (channelId) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (!selectedGroup) return;
    const groupStudents = students[selectedGroup] || [];
    setSelectedStudents(groupStudents.map((s) => s.id));
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const filteredStudents = selectedGroup
    ? (students[selectedGroup] || []).filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.parent.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSend = () => {
    setShowPreview(false);
    alert(
      `Mensaje enviado a ${selectedStudents.length} destinatario(s) por ${selectedChannels.length} canal(es)`
    );
  };

  return (
    <div className="comunication">
      <NavbarDocente
        title="Comunicacion con Padres de Familia"
        color="#ec407a"
        icon={
          <span className="material-symbols-outlined navbars-icon">
            edit_note
          </span>
        }
      />
      <div className="max-container">
        <div className="main-grid">
          <div className="left-column">
            <div className="card-comunication">
              <h2 className="section-title">Seleccionar Destinatarios</h2>
              {/* Grupo */}
              <div className="form-group">
                <label className="form-label">Grado</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => {
                    setSelectedGroup(e.target.value);
                    setSelectedStudents([]);
                  }}
                  className="form-select"
                >
                  <option value="">Seleccionar grupo...</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.students} estudiantes)
                    </option>
                  ))}
                </select>
              </div>

              {/* Búsqueda de estudiantes */}
              {selectedGroup && (
                <>
                  <div className="form-group">
                    <div className="search-box">
                      <span className="search-icon">🔍</span>
                      <input
                        type="text"
                        placeholder="Buscar estudiante o padre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                  </div>

                  <div className="selection-info">
                    <span>
                      {selectedStudents.length} de {filteredStudents.length}{" "}
                      seleccionados
                    </span>
                    <button
                      onClick={handleSelectAll}
                      className="select-all-link"
                    >
                      Seleccionar todos
                    </button>
                  </div>

                  {/* Lista de estudiantes */}
                  <div className="student-list">
                    {filteredStudents.map((student) => (
                      <label key={student.id} className="student-item">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className="student-checkbox"
                        />
                        <div className="student-info">
                          <div className="student-name">{student.name}</div>
                          <div className="student-parent">
                            Padre: {student.parent}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Canales de comunicación */}
            <div className="card-comunication">
              <h2 className="section-title">Canales de Comunicación</h2>
              <div className="channels-grid">
                {channels.map((channel) => {
                  const isSelected = selectedChannels.includes(channel.id);
                  return (
                    <button
                      key={channel.id}
                      onClick={() => handleChannelToggle(channel.id)}
                      className={`channel-button ${
                        isSelected ? "selected" : ""
                      }`}
                      data-color={channel.id} 
                    >
                      <span
                        className="channel-icon"
                        style={{ color: isSelected ? "#ec0b0bff" : channel.color }}
                      >
                        {channel.icon}
                      </span>
                      <div className="channel-name">{channel.name}</div>
                      <div className="channel-desc">{channel.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>            
            <div className="card-comunication">
              <h2 className="section-title">Componer Mensaje</h2>
              
              <div className="form-group">
                <label className="form-label">Usar plantilla (opcional)</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="form-select"
                >
                  <option value="">Mensaje personalizado</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                className="message-textarea"
              />

              <div className="message-actions">
                <span className="char-count">{message.length} caracteres</span>
                <div className="action-buttons">
                  <button
                    onClick={() => setShowPreview(true)}
                    disabled={
                      !message ||
                      selectedStudents.length === 0 ||
                      selectedChannels.length === 0
                    }
                    className="preview-button"
                  >
                    Vista Previa
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={
                      !message ||
                      selectedStudents.length === 0 ||
                      selectedChannels.length === 0
                    }
                    className="send-button"
                  >
                    Enviar Mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>          
          <div className="right-column">
            <div className="card-comunication">
              <h2 className="section-title">Comunicaciones Recientes</h2>
              <div className="recent-list">
                {recentCommunications.map((comm, idx) => (
                  <div key={idx} className="recent-item">
                    <div className="recent-header">
                      <span className="recent-icon">
                        {comm.type === "whatsapp" && "💬"}
                        {comm.type === "email" && "✉️"}
                        {comm.type === "sms" && "📞"}
                      </span>
                      <span className="recent-subject">{comm.subject}</span>
                    </div>
                    <div className="recent-footer">
                      <span>{comm.recipients} destinatarios</span>
                      <span>{comm.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stats-card">
              <h3 className="stats-title">Estadísticas del Mes</h3>
              <div className="stats-content">
                <div className="stat-item">
                  <span>Mensajes enviados</span>
                  <span>248</span>
                </div>
                <div className="stat-item">
                  <span>Tasa de lectura</span>
                  <span>94%</span>
                </div>
                <div className="stat-item">
                  <span>Respuestas</span>
                  <span>156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vista Previa */}
      {showPreview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Vista Previa del Mensaje</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="close-button"
              >
                ✕
              </button>
            </div>

            <div className="preview-content">
              <div className="preview-section">
                <div className="preview-label">Destinatarios</div>
                <div className="preview-value">
                  {selectedStudents.length} padres de familia seleccionados
                </div>
              </div>

              <div className="preview-section">
                <div className="preview-label">Canales</div>
                <div className="preview-channels">
                  {selectedChannels.map((id) => {
                    const channel = channels.find((c) => c.id === id);
                    return (
                      <span key={id} className="channel-tag">
                        {channel?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="preview-section">
                <div className="preview-label">Mensaje</div>
                <div className="preview-message">{message}</div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowPreview(false)}
                className="cancel-button"
              >
                Cancelar
              </button>
              <button onClick={handleSend} className="confirm-button">
                Confirmar y Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationModule;
