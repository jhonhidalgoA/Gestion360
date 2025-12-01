import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import TaskStudent from "../../../components/ui/TaskStudent";
import {
  X,
  Calendar,
  FileText,
  Download,
  UploadCloud,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import "./TareasHacer.css";

// Iconos
import MathIcon from "../../../assets/student-img/herramientas.png";
import ScienceIcon from "../../../assets/student-img/ciencias.png";
import BookIcon from "../../../assets/student-img/libro.png";
import EnglishIcon from "../../../assets/student-img/globo.png";

const Tareashacer = () => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [comment, setComment] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDateDisplay, setCurrentDateDisplay] = useState("");
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:8000";  // <-- Tu backend

  // Mapeo de asignaturas a íconos
  const iconMap = {
    matemáticas: MathIcon,
    "ciencias naturales": ScienceIcon,
    español: BookIcon,
    inglés: EnglishIcon,
    artística: MathIcon,
    biología: ScienceIcon,
    "c._sociales": BookIcon,
    castellano: BookIcon,
  };

  // Mapeo de asignaturas a colores
  const colorMap = {
    matemáticas: "#FF6347",
    "ciencias naturales": "#1E90FF",
    español: "#8A2BE2",
    inglés: "#32CD32",
    artística: "#FF8C00",
    biología: "#20B2AA",
    "c._sociales": "#9370DB",
    castellano: "#4682B4",
  };

  // Efecto para tiempo y fecha
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      const formatter = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      let formattedDate = formatter.format(now);
      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      setCurrentDateDisplay(formattedDate);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Efecto principal para cargar tareas
  useEffect(() => {
    cargarTareas();
  }, []);

  // Función para cargar tareas desde el backend
  const cargarTareas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener usuario del localStorage
      const userString = sessionStorage.getItem("user_session") || localStorage.getItem("user");
      if (!userString) {
        throw new Error("No estás logueado. Por favor, inicia sesión.");
      }
      
      const userData = JSON.parse(userString);
      
      // Si NO tiene estudiante_id, obtenerlo del backend
      if (!userData.estudiante_id && userData.accessToken) {
        try {
          // Primero intentar obtener información del usuario
          const infoResponse = await fetch(`${API_URL}/api/mi-informacion`, {
            headers: {
              Authorization: `Bearer ${userData.accessToken}`,
            },
          });
          
          if (infoResponse.ok) {
            const userInfo = await infoResponse.json();
            
            if (userInfo.estudiante_id) {
              userData.estudiante_id = userInfo.estudiante_id;
              localStorage.setItem("user", JSON.stringify(userData));
            }
          }
        } catch (err) {
          console.log("No se pudo obtener estudiante_id automáticamente:", err);
        }
      }
      
      // Verificar que tenga estudiante_id
      if (!userData.estudiante_id) {
        throw new Error("No se encontró información del estudiante.");
      }

      // Llamar al backend para obtener las tareas
      const response = await fetch(
        `${API_URL}/api/tareas-estudiante/${userData.estudiante_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar las tareas");
      }

      const data = await response.json();
      
      // Agregar íconos y colores a cada tarea
      const tareasConIconos = data.map(tarea => ({
        ...tarea,
        icon: iconMap[tarea.subject?.toLowerCase()] || BookIcon,
        color: colorMap[tarea.subject?.toLowerCase()] || "#2563eb",
      }));
      
      setTareas(tareasConIconos);
      
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/estudiante");
  };

  const handleViewTaskDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setComment(task.entrega?.comentario || "");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setUploadedFiles([]);
    setComment("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadedFiles([files[0]]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles([files[0]]);
    }
  };

  const handleSubmit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      
      const formData = new FormData();
      formData.append("comentario", comment);
      
      if (uploadedFiles.length > 0) {
        formData.append("archivo", uploadedFiles[0]);
      }

      const response = await fetch(
        `${API_URL}/api/entregar-tarea/${selectedTask.id}/${userData.estudiante_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar la tarea");
      }

      alert("¡Tarea enviada con éxito!");
      closeModal();
      cargarTareas(); // Recargar tareas
    } catch (err) {
      console.error("Error:", err);
      alert("Error al enviar la tarea: " + err.message);
    }
  };

  const handleDescargarArchivo = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `${API_URL}/api/descargar-archivo-tarea/${selectedTask.id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedTask.archivo?.split("/").pop() || "archivo_descargado";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al descargar el archivo: " + err.message);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="taskDo-container">
        <NavbarModulo />
        <div className="page-container">
          <div className="loading-message">Cargando tareas...</div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="taskDo-container">
        <NavbarModulo />
        <div className="page-container">
          <div className="error-message">
            <AlertCircle size={24} />
            <p>Error: {error}</p>
            <button onClick={cargarTareas}>Reintentar</button>
            <button onClick={handleBack}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="taskDo-container">
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

      {tareas.length === 0 ? (
        <div className="no-tasks-message">
          <FileText size={48} color="#9ca3af" />
          <p>No tienes tareas asignadas en este momento</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tareas.map((task) => (
            <TaskStudent
              key={task.id}
              task={task}
              icon={task.icon}
              onViewDetails={handleViewTaskDetails}
              variant="default"
              gradientStart={task.color}
            />
          ))}
        </div>
      )}

      {/* Modal */}
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
              <img 
                src={selectedTask.icon} 
                alt={selectedTask.subject}
                className="modal-icon-student"
                style={{ width: "48px", height: "48px" }}
              />
              <div className="modal-header-student-title">
                <span className="subject-tag">{selectedTask.subject}</span>
                <h2>{selectedTask.title}</h2>
                <span className="status-badge">{selectedTask.status}</span>
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

              {/* Si ya fue entregada */}
              {selectedTask.entrega?.fecha_entrega && (
                <div className="entrega-status">
                  <span>✅ Entregado el {new Date(selectedTask.entrega.fecha_entrega).toLocaleDateString("es-ES")}</span>
                </div>
              )}

              <div className="section-box description-box">
                <div className="section-header">
                  <FileText size={16} color="#2563eb" />
                  <strong>Descripción</strong>
                </div>
                <p>{selectedTask.description}</p>
              </div>

              {/* Archivo del profesor */}
              {selectedTask.archivo && (
                <div className="section-box materials-box">
                  <div className="section-header">
                    <FileText size={16} color="#2563eb" />
                    <strong>Material del Profesor</strong>
                  </div>
                  <div className="material-item">
                    <div className="material-info">
                      <div className="material-icon">
                        <FileText size={20} color="#16a34a" />
                      </div>
                      <div>
                        <div className="material-name">
                          {selectedTask.archivo.split("/").pop()}
                        </div>
                        <div className="material-type">Archivo adjunto</div>
                      </div>
                    </div>
                    <button 
                      className="download-btn"
                      onClick={handleDescargarArchivo}
                    >
                      <Download size={16} /> Descargar
                    </button>
                  </div>
                </div>
              )}

              {/* Solo mostrar sección de entrega si no ha sido entregada */}
              {!selectedTask.entrega?.fecha_entrega && (
                <>
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
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                    />
                    {uploadedFiles.length > 0 && (
                      <div className="uploaded-files-list">
                        <div className="uploaded-file">
                          {uploadedFiles[0].name}
                        </div>
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
                </>
              )}
            </div>

            <div className="modal-footer-student">
              <button className="btn-secondary-student" onClick={closeModal}>
                Cerrar
              </button>
              {!selectedTask.entrega?.fecha_entrega && (
                <button 
                  className="btn-primary-student" 
                  onClick={handleSubmit}
                  disabled={uploadedFiles.length === 0}
                >
                  Enviar Tarea
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tareashacer;