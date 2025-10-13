import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Comunicacion.css";
import { FaWhatsapp } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { FaBell } from "react-icons/fa6";

const grupoOptions = [
  { value: "", label: "Seleccionar" },
  { value: "6", label: "Grado Sexto" },
  { value: "7", label: "Grado Séptimo" },
  { value: "8", label: "Grado Octavo" },
  { value: "9", label: "Grado Noveno" },
  { value: "10", label: "Grado Décimo" },
  { value: "11", label: "Grado Undécimo" },
];

const estudianteOptions = [
  { value: "", label: "Seleccionar" },
  { value: "maria_garcia", label: "María García López" },
  { value: "carlos_rodriguez", label: "Carlos Rodríguez Pérez" },
  { value: "ana_martinez", label: "Ana Martínez Sánchez" },
  { value: "javier_hernandez", label: "Javier Hernández Díaz" },
];

const CommunicationModule = () => {
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { grupo: "", estudiante: "" },
    mode: "onBlur",
  });

  const channels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <FaWhatsapp size={30} />,
      color: "#25D366",
      description: "Mensaje instantáneo",
    },
    {
      id: "email",
      name: "Email",
      icon: <FaEnvelope size={30} />,
      color: "#4285F4",
      description: "Correo electrónico",
    },
    {
      id: "sms",
      name: "SMS",
      icon: <FaPhone size={30} />,
      color: "#9C27B0",
      description: "Mensaje de texto",
    },
    {
      id: "push",
      name: "Notificación",
      icon: <FaBell size={30} />,
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

  const handleChannelToggle = (channelId) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setSelectedTemplate(templateId);
    }
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
      <div className="main-content">
        <div className="main-grid">
          <div className="left-column">
            <div className="form-row">
              <SelectField
                label="Grupo:"
                id="grupo"
                register={register}
                errors={errors}
                required
                options={grupoOptions}
              />
              <SelectField
                label="Estudiante:"
                id="estudiante"
                register={register}
                errors={errors}
                required
                options={estudianteOptions}
              />
            </div>
            <div className="card-comunication">
              <h2 className="section-title">Escribir Mensaje</h2>

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
            </div>
            <div className="action-buttons">
              <button
                onClick={() => setShowPreview(true)}
                className="preview-button"
              >
                Vista Previa
              </button>
              <button className="send-button">Enviar Mensaje</button>
            </div>
          </div>
          <div className="right-column">
            <div className="card-comunication-right">
              <h2>Canales de Comunicación</h2>
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
                        style={{
                          color: isSelected ? "#ec0b0bff" : channel.color,
                        }}
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
                <div className="preview-value"></div>
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
              <button className="confirm-button">Confirmar y Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationModule;