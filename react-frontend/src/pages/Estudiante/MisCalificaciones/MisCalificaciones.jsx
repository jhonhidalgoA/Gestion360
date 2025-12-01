import "./MisCalificaciones.css";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Loader2,
} from "lucide-react";

const Calificaciones = () => {
  const navigate = useNavigate();
  
  // Estados
  const [expandedAreas, setExpandedAreas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosEstudiante, setDatosEstudiante] = useState(null);
  const [academicAreas, setAcademicAreas] = useState([]);
  
  // Estado corregido: variable no utilizada eliminada o comentada
  // const [periodoActual, setPeriodoActual] = useState(4);
  const periodoActual = 4; // Si no necesitas modificarlo, usa una constante

  // Obtener datos del estudiante logueado - CORREGIDO
  const cargarCalificaciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== BUSCANDO DATOS DEL USUARIO ===");
      
      let numeroDocumento = null;
      let nombreCompleto = null;
      
      // Opción 1: Verificar si existe directamente "username" en localStorage
      const usernameDirecto = localStorage.getItem("username");
      console.log("username directo:", usernameDirecto);
      
      if (usernameDirecto) {
        numeroDocumento = usernameDirecto;
        // Intentar obtener el nombre completo si existe
        const fullNameDirecto = localStorage.getItem("fullName");
        if (fullNameDirecto) nombreCompleto = fullNameDirecto;
      }
      
      // Opción 2: Buscar en objeto "user"
      if (!numeroDocumento) {
        const userDataString = localStorage.getItem("user");
        console.log("user object:", userDataString);
        
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            numeroDocumento = userData.username || userData.numero_documento;
            nombreCompleto = userData.fullName || userData.nombre;
          } catch (e) {
            console.error("Error parseando user:", e);
          }
        }
      }
      
      // Opción 3: Buscar en otras claves comunes
      if (!numeroDocumento) {
        const authUser = localStorage.getItem("authUser");
        const currentUser = localStorage.getItem("currentUser");
        
        if (authUser) {
          const userData = JSON.parse(authUser);
          numeroDocumento = userData.username || userData.numero_documento;
          nombreCompleto = userData.fullName || userData.nombre;
        } else if (currentUser) {
          const userData = JSON.parse(currentUser);
          numeroDocumento = userData.username || userData.numero_documento;
          nombreCompleto = userData.fullName || userData.nombre;
        }
      }
      
      console.log("Número de documento encontrado:", numeroDocumento);
      console.log("Nombre completo:", nombreCompleto);
      console.log("=================================");

      if (!numeroDocumento) {
        throw new Error("No se encontró el número de documento. Por favor, inicia sesión nuevamente.");
      }

      console.log("✅ Cargando calificaciones para:", numeroDocumento, "Período:", periodoActual);

      // Llamar al endpoint - CAMBIA ESTA URL SI TU BACKEND ESTÁ EN OTRO PUERTO
      const response = await fetch(
        `http://localhost:8000/api/estudiante/calificaciones-por-documento/${numeroDocumento}/${periodoActual}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar las calificaciones");
      }

      const data = await response.json();

      // Guardar datos del estudiante (usa el nombre del localStorage si existe)
      setDatosEstudiante({
        ...data.estudiante,
        nombre: data.estudiante.nombre || nombreCompleto || "Estudiante"
      });

      // Mapear las áreas a la estructura del componente
      const areasFormateadas = mapearAreas(data.areas);
      setAcademicAreas(areasFormateadas);

    } catch (err) {
      console.error("Error cargando calificaciones:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [periodoActual]); // Dependencia incluida

  useEffect(() => {
    cargarCalificaciones();
  }, [cargarCalificaciones]); // Dependencia incluida correctamente

  // Mapear áreas del backend a la estructura con colores
  const mapearAreas = (areas) => {
    const coloresPorArea = {
      "Ciencias Exactas": {
        id: "exactas",
        color: "area-orange",
        bgLight: "area-orange-light",
        borderColor: "area-orange-border",
      },
      "Lenguaje": {
        id: "lenguaje",
        color: "area-purple",
        bgLight: "area-purple-light",
        borderColor: "area-purple-border",
      },
      "Ciencias Sociales": {
        id: "sociales",
        color: "area-yellow",
        bgLight: "area-yellow-light",
        borderColor: "area-yellow-border",
      },
      "Ciencias Naturales": {
        id: "naturales",
        color: "area-blue",
        bgLight: "area-blue-light",
        borderColor: "area-blue-border",
      },
      "Tecnología": {
        id: "tecnologia",
        color: "area-cyan",
        bgLight: "area-cyan-light",
        borderColor: "area-cyan-border",
      },
      "Artes": {
        id: "artes",
        color: "area-pink",
        bgLight: "area-pink-light",
        borderColor: "area-pink-border",
      },
      "Deportes": {
        id: "deportes",
        color: "area-green",
        bgLight: "area-green-light",
        borderColor: "area-green-border",
      },
      "Formación": {
        id: "formacion",
        color: "area-indigo",
        bgLight: "area-indigo-light",
        borderColor: "area-indigo-border",
      },
    };

    return areas.map((area) => {
      const estilos = coloresPorArea[area.name] || {
        id: area.name.toLowerCase().replace(/\s+/g, "_"),
        color: "area-gray",
        bgLight: "area-gray-light",
        borderColor: "area-gray-border",
      };

      return {
        ...estilos,
        name: area.name,
        subjects: area.subjects,
      };
    });
  };

  const handleBack = () => {
    navigate("/estudiante");
  };

  const toggleArea = (areaId) => {
    setExpandedAreas((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));
  };

  const getStatusIcon = (nota) => {
    if (nota === null) return <Clock className="icon icon-gray" />;
    if (nota >= 4.5) return <Star className="icon icon-yellow" />;
    if (nota >= 3.0) return <CheckCircle className="icon icon-green" />;
    return <AlertCircle className="icon icon-red" />;
  };

  const getStatusBadge = (nota) => {
    if (nota === null) return { text: "Pendiente", color: "badge-gray" };
    if (nota >= 4.5) return { text: "Excelente", color: "badge-yellow" };
    if (nota >= 3.0) return { text: "Aprobado", color: "badge-green" };
    return { text: "Reprobado", color: "badge-red" };
  };

  const calcularPromedioArea = (subjects) => {
    const notasValidas = subjects.filter((s) => s.nota !== null);
    if (notasValidas.length === 0) return null;
    const suma = notasValidas.reduce((acc, s) => acc + s.nota, 0);
    return (suma / notasValidas.length).toFixed(1);
  };

  // Renderizado de loading
  if (loading) {
    return (
      <div className="schedules-containers">
        <NavbarModulo />
        <div className="page-container">
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "400px",
            flexDirection: "column",
            gap: "16px"
          }}>
            <Loader2 className="animate-spin" size={48} />
            <p>Cargando calificaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado de error
  if (error) {
    return (
      <div className="schedules-containers">
        <NavbarModulo />
        <div className="page-container">
          <button onClick={handleBack} className="back-button">
            <span className="back-icon">←</span>
            Volver al inicio
          </button>
          <div style={{
            background: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "20px",
            textAlign: "center"
          }}>
            <AlertCircle size={48} color="#c33" style={{ marginBottom: "12px" }} />
            <h3 style={{ color: "#c33", marginBottom: "8px" }}>Error al cargar calificaciones</h3>
            <p>{error}</p>
            <button 
              onClick={cargarCalificaciones}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedules-containers">
      <NavbarModulo />

      {/* Header Section */}
      <div className="page-container">
        <button onClick={handleBack} className="back-button">
          <span className="back-icon">←</span>
          Volver al inicio
        </button>
      </div>

      <div className="page-title">
        <h6>
          Informe de Calificaciones – Período: {periodoActual}, Año 2025
        </h6>
        {datosEstudiante && (
          <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
            Estudiante: {datosEstudiante.nombre} - Documento: {datosEstudiante.documento}
          </p>
        )}
      </div>

      {/* Legend Section */}
      <div className="legend-card">
        <div className="legend-items">
          <div className="legend-item-notes">
            <Star className="icon-legend" />
            <span className="legend-text">Excelente (4.5-5.0)</span>
          </div>
          <div className="legend-item-notes">
            <CheckCircle className="icon-legend" />
            <span className="legend-text">Aprobado (3.0-4.4)</span>
          </div>
          <div className="legend-item-notes">
            <AlertCircle className="icon-legend" />
            <span className="legend-text">Reprobado (1.0-2.9)</span>
          </div>
          <div className="legend-item-notes">
            <Clock className="icon-legend" />
            <span className="legend-text">Pendiente</span>
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="areas-grid">
        {academicAreas.map((area) => {
          const promedio = calcularPromedioArea(area.subjects);
          const isExpanded = expandedAreas[area.id] || false;
          const status = getStatusBadge(promedio);

          return (
            <div key={area.id} className={`area-card ${area.borderColor}`}>
              {/* Area Header */}
              <div
                className={`area-header ${area.color}`}
                onClick={() => toggleArea(area.id)}
              >
                <div className="area-header-top">
                  <h3 className="area-title">{area.name}</h3>
                  {isExpanded ? (
                    <ChevronUp className="chevron-icon" />
                  ) : (
                    <ChevronDown className="chevron-icon" />
                  )}
                </div>

                <div className="area-header-bottom">
                  <div>
                    <p className="area-average-label">Promedio del Área</p>
                    <p className="area-average-value">{promedio || "—"}</p>
                  </div>
                  {promedio && (
                    <div className={`status-badge ${status.color}`}>
                      {status.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Subjects List (Expandible) */}
              {isExpanded && (
                <div className={`area-content ${area.bgLight}`}>
                  <div className="subjects-list">
                    {area.subjects.map((subject, idx) => (
                      <div key={idx} className="subject-card">
                        <div className="subject-header">
                          <div className="subject-title">
                            {getStatusIcon(subject.nota)}
                            <span className="subject-name">{subject.name}</span>
                          </div>
                          <span className="subject-hours">{subject.ih}h</span>
                        </div>

                        <div className="subject-footer">
                          <span className="subject-grade">
                            {subject.nota !== null ? subject.nota.toFixed(1) : "—"}
                          </span>
                          <span
                            className={`subject-status ${
                              getStatusBadge(subject.nota).color
                            }`}
                          >
                            {getStatusBadge(subject.nota).text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Area Footer */}
              {!isExpanded && (
                <div className="area-footer">
                  <p className="area-summary">
                    {area.subjects.length}{" "}
                    {area.subjects.length === 1 ? "Asignatura" : "Asignaturas"} •
                    <span className="click-hint"> Click para ver detalles</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calificaciones;