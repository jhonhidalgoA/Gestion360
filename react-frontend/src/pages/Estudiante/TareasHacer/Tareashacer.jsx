import "./TareasHacer.css";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import { useNavigate } from "react-router-dom";
import TaskStudent from "../../../components/ui/TaskStudent";
import { useState, useEffect } from "react";
import MathIcon from "../../../assets/student-img/herramientas.png"
import ScienceIcon from "../../../assets/student-img/ciencias.png"
import BookIcon from "../../../assets/student-img/libro.png"
import EnglishIcon from "../../../assets/student-img/globo.png"
import EarthIcon from "../../../assets/student-img/mundo.png"
import ArtIcon from "../../../assets/student-img/paletas.png"
import BallIcon from "../../../assets/student-img/balon.png"
import PcIcon from "../../../assets/student-img/pc.png"
import EticIcon from "../../../assets/student-img/etica.png"

import {
  X,
  Calendar,
  FileText,
  Download,
  UploadCloud,
  MessageSquare,
} from "lucide-react";

const Tareashacer = () => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [comment, setComment] = useState("");

  const [currentTime, setCurrentTime] = useState("");
  const [currentDateDisplay, setCurrentDateDisplay] = useState("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();

      // Día de la semana

      // Hora actual
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      // Fecha legible con fallback
      let formattedDate = "";
      const formatter = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      formattedDate = formatter.format(now);

      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      setCurrentDateDisplay(formattedDate);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    navigate("/estudiante");
  };

  const homework = [
    {
      id: 1,
      subject: "Matemáticas",
      title: "Ejercicios de álgebra",
      description: "Resolver ejercicios de las páginas 45-47",
      dueDate: "2024-10-15",
      status: "Pendiente",
      priority: "Alta",
      icon: MathIcon,
      color: "#FF6347",
      instructions:
        "Resuelve todos los ejercicios mostrando el procedimiento completo. Recuerda verificar tus respuestas y escribir de forma legible.",
      materials: [
        { name: "guia_algebra.pdf", type: "Archivo del profesor" },
        { name: "ejemplos_resueltos.pdf", type: "Archivo del profesor" },
      ],
    },
    {
      id: 2,
      subject: "Español y Literatura",
      title: "Lectura y resumen",
      description: "Leer capítulo 3 y hacer resumen de 1 página",
      dueDate: "2024-10-16",
      status: "En proceso",
      priority: "Media",
      icon: BookIcon,
      color: "#8A2BE2",
      instructions:
        "El resumen debe incluir ideas principales y conclusiones personales.",
      materials: [{ name: "capitulo_3.pdf", type: "Archivo del profesor" }],
    },
    {
      id: 3,
      subject: "Ciencias Naturales",
      title: "Consulta del Sistema Solar",
      description: "Presentación con imágenes y datos",
      dueDate: "2024-10-18",
      status: "Pendiente",
      priority: "Media",
      icon:ScienceIcon,
      color: "#1E90FF",
      instructions:
        "Incluir mínimo 5 planetas, sus características y una imagen por planeta.",
      materials: [
        { name: "sistema_solar_guia.pdf", type: "Archivo del profesor" },
      ],
    },
    {
      id: 4,
      subject: "Inglés",
      title: "Vocabulary Unit 5",
      description: "Complete exercises 1-10",
      dueDate: "2024-10-14",
      status: "Completado",
      priority: "Baja",
      icon: EnglishIcon,
      color: "#32CD32",
      instructions: "Escribe las palabras en contexto y define cada una.",
      materials: [],
    },
  ];

  const handleViewTaskDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setUploadedFiles([]);
    setComment("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = () => {
    alert("Tarea enviada con éxito!");
    closeModal();
  };

  return (
    <div className="taskDo-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <NavbarModulo />
      <div className="page-container">
        <div className="header-section">
          <button onClick={handleBack} className="back-button">
            <span className="back-icon">←</span>
            Volver al inicio
          </button>
          <div className="current-info">
            <div className="current-day">
              <span className="label">Hoy es:</span>{" "}
              <span className="date-value">{currentDateDisplay}</span>
            </div>
            <div className="current-time">
              <span className="time-value">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="page-title">
        <h4>Mis Tareas</h4>
        <p className="taskDo-subtitle">
          Gestiona y completa tus actividades académicas
        </p>
      </div>

      <div className="tasks-grid">
        {homework.map((task) => (
          <TaskStudent
            key={task.id}
            task={task}
            icon={task.icon}
            onViewDetails={handleViewTaskDetails}
            variant="default"
            gradientStart={`${task.color} -30)}`}
          />
        ))}
      </div>

      {/* Modal Estudiante */}
      {isModalOpen && selectedTask && (
        <div className="modal-overlay-student" onClick={closeModal}>
          <div
            className="modal-content-student"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn-student" onClick={closeModal}>
              <X size={20} />
            </button>

            <div className="modal-title-stem">
              <span className="title-colegio">Colegio</span>
              <span className="title-stem">STEM 360</span>
            </div>

            <div className="modal-header-student">
              <span className="modal-icon-student">{selectedTask.icon}</span>
              <div className="modal-header-student-title">
                <span className="subject-tag">{selectedTask.subject}</span>
                <h2>{selectedTask.title}</h2>
              </div>
            </div>

            <div className="modal-body-student">
              <div className="due-date-section">
                <Calendar size={16} color="#2563eb" />
                <span>
                  Fecha de entrega:{" "}
                  {new Date(selectedTask.dueDate).toLocaleDateString("es-ES")}
                </span>
              </div>

              <div className="section-box description-box">
                <div className="section-header">
                  <FileText size={16} color="#2563eb" />
                  <strong>Descripción</strong>
                </div>
                <p>{selectedTask.description}</p>
              </div>

              <div className="section-box instructions-box">
                <div className="section-header">
                  <FileText size={16} color="#2563eb" />
                  <strong>Instrucciones</strong>
                </div>
                <p>{selectedTask.instructions}</p>
              </div>

              <div className="section-box materials-box">
                <div className="section-header">
                  <FileText size={16} color="#2563eb" />
                  <strong>Material del Profesor</strong>
                </div>
                {Array.isArray(selectedTask.materials) &&
                selectedTask.materials.length > 0 ? (
                  selectedTask.materials.map((material, index) => (
                    <div key={index} className="material-item">
                      <div className="material-info">
                        <div className="material-icon">
                          <FileText size={20} color="#16a34a" />
                        </div>
                        <div>
                          <div className="material-name">{material.name}</div>
                          <div className="material-type">{material.type}</div>
                        </div>
                      </div>
                      <button className="download-btn">
                        <Download size={16} /> Descargar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-materials">
                    No hay material disponible para esta tarea.
                  </p>
                )}
              </div>

              <div className="section-box upload-box">
                <div className="section-header">
                  <UploadCloud size={16} color="#2563eb" />
                  <strong>Sube tu Trabajo</strong>
                </div>
                <div
                  className="upload-area"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <UploadCloud size={40} color="#2563eb" />
                  <p>Arrastra archivos aquí o haz clic para seleccionar</p>
                  <p className="upload-hint">
                    PDF, Word, PowerPoint, Imágenes (Máx. 10MB)
                  </p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {Array.isArray(uploadedFiles) && uploadedFiles.length > 0 && (
                  <div className="uploaded-files-list">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="uploaded-file">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="section-box comments-box">
                <div className="section-header">
                  <MessageSquare size={16} color="#2563eb" />
                  <strong>Comentarios adicionales</strong>
                </div>
                <textarea
                  className="comment-input"
                  placeholder="Escribe aquí cualquier comentario o pregunta para tu profesor..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-footer-student">
              <button className="btn-secondary-student" onClick={closeModal}>
                Cerrar
              </button>
              <button className="btn-primary-student" onClick={handleSubmit}>
                Enviar Tarea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tareashacer;
