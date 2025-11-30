import "./MisCalificaciones.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";

const Calificaciones = () => {
  const navigate = useNavigate();
  const [expandedAreas, setExpandedAreas] = useState({});
  
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

  
  const academicAreas = [
    {
      id: "exactas",
      name: "Matemáticas",
      color: "area-orange",
      bgLight: "area-orange-light",
      borderColor: "area-orange-border",
      subjects: [
        { name: "Matemáticas", ih: 4, nota: null },
        { name: "Geometría", ih: 1, nota: null },
        { name: "Estadística", ih: 1, nota: null },
      ],
    },
    {
      id: "lenguaje",
      name: "Humanidades",
      color: "area-purple",
      bgLight: "area-purple-light",
      borderColor: "area-purple-border",
      subjects: [
        { name: "Castellano", ih: 4, nota: null },
        { name: "Inglés", ih: 4, nota: null },
        { name: "C. Lectora", ih: 1, nota: null },
      ],
    },
    {
      id: "sociales",
      name: "Ciencias Sociales",
      color: "area-yellow",
      bgLight: "area-yellow-light",
      borderColor: "area-yellow-border",
      subjects: [
        { name: "Ciencias Sociales", ih: 3, nota: null },
        { name: "Historia y Geografía", ih: 3, nota: null },
      ],
    },
    {
      id: "naturales",
      name: "Ciencias Naturales",
      color: "area-blue",
      bgLight: "area-blue-light",
      borderColor: "area-blue-border",
      subjects: [
        { name: "Biología", ih: 2, nota: null },
        { name: "Física", ih: 1, nota: null },
        { name: "Química", ih: 1, nota: null },
      ],
    },
    {
      id: "tecnologia",
      name: "Tecnología e Informática",
      color: "area-cyan",
      bgLight: "area-cyan-light",
      borderColor: "area-cyan-border",
      subjects: [{ name: "Tecnología e Informática", ih: 2, nota: null }],
    },
    {
      id: "artes",
      name: "Eduacion Artística y Cultural",
      color: "area-pink",
      bgLight: "area-pink-light",
      borderColor: "area-pink-border",
      subjects: [{ name: "Artística", ih: 2, nota: null }],
    },
    {
      id: "deportes",
      name: "Educación Física y Deportes",
      color: "area-green",
      bgLight: "area-green-light",
      borderColor: "area-green-border",
      subjects: [{ name: "E. Física", ih: 2, nota: null }],
    },
    {
      id: "formacion",
      name: "Educación Religiosa",
      color: "area-indigo",
      bgLight: "area-indigo-light",
      borderColor: "area-indigo-border",
      subjects: [
        { name: "Ética", ih: 1, nota: null },
        { name: "Cátedra de Paz", ih: 1, nota: null },
        { name: "Religión", ih: 1, nota: null },
      ],
    },
  ];

 
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
        <h6>Informe de Calificaciones – Período: 4, Año 2025</h6>
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
          const isExpanded = expandedAreas[area.id];
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
                            {subject.nota || "—"}
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