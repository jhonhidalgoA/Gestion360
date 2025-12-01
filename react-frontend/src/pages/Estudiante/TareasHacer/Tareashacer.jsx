import { useState, useEffect, useCallback } from "react";
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

const iconMap = {
  matemáticas: MathIcon,
  ciencias_naturales: ScienceIcon,
  español: BookIcon,
  inglés: EnglishIcon,
  artística: MathIcon,
  biología: ScienceIcon,
  ciencias_sociales: BookIcon,
  castellano: BookIcon,
};

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

  const API_URL = "http://localhost:8000";

  // Calcular estadísticas
  const totalTareas = tareas.length;
  const pendientes = tareas.filter((t) => !t.entrega?.fecha_entrega).length;
  const completadas = tareas.filter((t) => t.entrega?.fecha_entrega).length;
  const porcentajeCompletadas =
    totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;

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

  // Función para cargar tareas - con useCallback para estabilidad
  const cargarTareasDesdeAPI = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener usuario SOLO de sessionStorage (donde AuthContext guarda)
      const userSession = sessionStorage.getItem("user_session");
      console.log("🔍 sessionStorage user_session:", userSession);

      if (!userSession) {
        // Si no hay sesión, redirigir al login
        navigate("/login");
        return;
      }

      const userData = JSON.parse(userSession);
      console.log(
        "👤 Usuario:",
        userData.username,
        "estudiante_id:",
        userData.estudiante_id
      );

      // Verificar que tenga estudiante_id (debería venir del login)
      if (!userData.estudiante_id) {
        throw new Error(
          "Error: No se encontró información del estudiante. Por favor, contacte al administrador."
        );
      }

      // Verificar que tenga token
      if (!userData.accessToken) {
        throw new Error(
          "Error: Sesión expirada. Por favor, inicie sesión nuevamente."
        );
      }

      // Llamar al backend para obtener las tareas
      console.log("📞 Llamando API con estudiante_id:", userData.estudiante_id);
      const response = await fetch(
        `${API_URL}/api/tareas-estudiante/${userData.estudiante_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        }
      );

      console.log("📊 Status respuesta:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Sesión expirada. Por favor, inicie sesión nuevamente."
          );
        }
        throw new Error(`Error ${response.status} al cargar las tareas`);
      }

      const data = await response.json();
      console.log("✅ Tareas recibidas:", data.length);

      // Agregar íconos y colores a cada tarea
      const tareasConIconos = data.map((tarea) => ({
        ...tarea,
        icon: iconMap[tarea.subject?.toLowerCase()] || BookIcon,
        color: colorMap[tarea.subject?.toLowerCase()] || "#2563eb",
      }));

      setTareas(tareasConIconos);
    } catch (err) {
      console.error("❌ Error cargando tareas:", err);
      setError(err.message);

      // Si es error de autenticación, limpiar y redirigir
      if (err.message.includes("401") || err.message.includes("Sesión")) {
        sessionStorage.removeItem("user_session");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]); // navigate es la única dependencia externa

  // Efecto principal para cargar tareas al inicio
  useEffect(() => {
    cargarTareasDesdeAPI();
  }, [cargarTareasDesdeAPI]); // ✅ Ahora está incluida como dependencia

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
      // Obtener usuario de sessionStorage
      const userSession = sessionStorage.getItem("user_session");
      const userData = JSON.parse(userSession || "{}");

      console.log("📤 Enviando tarea - estudiante_id:", userData.estudiante_id);

      if (!userData.estudiante_id) {
        alert(
          "Error: No se encontró el ID del estudiante. Recargue la página."
        );
        return;
      }

      const formData = new FormData();
      formData.append("comentario", comment);

      if (uploadedFiles.length > 0 && uploadedFiles[0].size) {
        // Verificar tamaño máximo (10MB)
        if (uploadedFiles[0].size > 10 * 1024 * 1024) {
          alert("El archivo es demasiado grande. Máximo 10MB.");
          return;
        }
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Error al enviar la tarea");
      }

      alert("¡Tarea enviada con éxito!");
      closeModal();
      cargarTareasDesdeAPI(); // Recargar tareas
    } catch (err) {
      console.error("Error:", err);
      alert("Error al enviar la tarea: " + err.message);
    }
  };

  const handleDescargarArchivo = async () => {
    try {
      if (!selectedTask.archivo) {
        alert("No hay archivo para descargar");
        return;
      }

      // Obtener token de usuario
      const userSession = sessionStorage.getItem("user_session");
      const userData = JSON.parse(userSession || "{}");

      // Usar el endpoint de descarga del backend
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

      // Obtener el blob del archivo
      const blob = await response.blob();

      // Obtener el nombre del archivo desde la ruta
      const fileName = selectedTask.archivo.split(/[/\\]/).pop();

      // Crear un enlace temporal para descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ Archivo descargado:", fileName);
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
            <div className="error-actions">
              <button onClick={cargarTareasDesdeAPI}>Reintentar</button>
              <button onClick={handleBack}>Volver al inicio</button>
            </div>
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

        {/* Tarjetas de estadísticas */}
        {tareas.length > 0 && (
          <div className="stats-section">
            <div className="stats-cards-container">
              {/* Tarjeta 1: Total */}
              <div className="stats-card">
                <div className="stats-number">{totalTareas}</div>
                <div className="stats-label">TOTAL</div>
              </div>

              <div className="stats-divider"></div>

              {/* Tarjeta 2: Pendientes */}
              <div className="stats-card">
                <div className="stats-number">{pendientes}</div>
                <div className="stats-label">PENDIENTES</div>
              </div>

              <div className="stats-divider"></div>

              {/* Tarjeta 3: Completadas */}
              <div className="stats-card">
                <div className="stats-number">{completadas}</div>
                <div className="stats-label">COMPLETADAS</div>
              </div>

              <div className="stats-divider"></div>

              {/* Tarjeta 4: Porcentaje */}
              <div className="stats-card">
                <div className="stats-number">{porcentajeCompletadas}%</div>
                <div className="stats-label">PROGRESO</div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="progress-bar-container">
              <div className="progress-info">
                <span className="progress-label">PROGRESO GENERAL</span>
                <span className="progress-percentage">
                  {porcentajeCompletadas}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${porcentajeCompletadas}%` }}
                ></div>
              </div>
              <div className="progress-stats">
                <span className="progress-completed">
                  {completadas} completadas
                </span>
                <span className="progress-total">de {totalTareas} tareas</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {tareas.length === 0 ? (
        <div className="no-tasks-message">
          <FileText size={48} color="#9ca3af" />
          <p>No tienes tareas asignadas en este momento</p>
          <button onClick={cargarTareasDesdeAPI} className="refresh-btn">
            Actualizar
          </button>
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
              entregada={!!task.entrega?.fecha_entrega}
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
                <span
                  className={`status-badge ${selectedTask.status?.toLowerCase()}`}
                >
                  {selectedTask.status}
                </span>
              </div>
            </div>

            <div className="modal-body-student">
              <div className="due-date-section">
                <Calendar size={16} color="#2563eb" />
                <span>
                  Fecha de entrega:{" "}
                  {new Date(selectedTask.dueDate).toLocaleDateString("es-ES")}
                </span>
                {selectedTask.priority && (
                  <span
                    className={`priority-badge ${selectedTask.priority.toLowerCase()}`}
                  >
                    {selectedTask.priority}
                  </span>
                )}
              </div>

              {/* Si ya fue entregada */}
              {selectedTask.entrega?.fecha_entrega && (
                <div className="entrega-status delivered">
                  <span>
                    Entregado el{" "}
                    {new Date(
                      selectedTask.entrega.fecha_entrega
                    ).toLocaleDateString("es-ES")}
                  </span>
                  {selectedTask.entrega.calificacion && (
                    <span className="calificacion">
                      Calificación:{" "}
                      <strong>{selectedTask.entrega.calificacion}</strong>
                    </span>
                  )}
                </div>
              )}

              <div className="section-box description-box">
                <div className="section-header">
                  <FileText size={16} color="#2563eb" />
                  <strong>Descripción</strong>
                </div>
                <p>{selectedTask.description}</p>
              </div>

              {/* Archivo entregado por el estudiante */}
              {selectedTask.entrega?.archivo_estudiante && (
                <div className="section-box materials-box">
                  <div className="section-header">
                    <FileText size={16} color="#16a34a" />
                    <strong>Archivo entregado</strong>
                  </div>
                  <div className="material-item">
                    <div className="material-info">
                      <div className="material-icon">
                        <FileText size={20} color="#16a34a" />
                      </div>
                      <div>
                        <div className="material-name">
                          {selectedTask.entrega.archivo_estudiante
                            .split("/")
                            .pop()}
                        </div>
                        <div className="material-type">Tu entrega</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

              {selectedTask.url && (
                <div className="section-box">
                  <div className="section-header">
                    <FileText size={16} color="#2563eb" />
                    <strong>Enlace</strong>
                  </div>
                  <a
                    href={selectedTask.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-link"
                  >
                    {selectedTask.url}
                  </a>
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
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
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
                          <FileText size={16} />
                          {uploadedFiles[0].name} (
                          {(uploadedFiles[0].size / 1024 / 1024).toFixed(2)} MB)
                          <button
                            className="remove-file"
                            onClick={() => setUploadedFiles([])}
                          >
                            <X size={14} />
                          </button>
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

              {/* Retroalimentación del profesor */}
              {selectedTask.entrega?.retroalimentacion && (
                <div className="section-box feedback-box">
                  <div className="section-header">
                    <MessageSquare size={16} color="#16a34a" />
                    <strong>Retroalimentación del Profesor</strong>
                  </div>
                  <p>{selectedTask.entrega.retroalimentacion}</p>
                </div>
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
                  <UploadCloud size={16} /> Enviar Tarea
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
