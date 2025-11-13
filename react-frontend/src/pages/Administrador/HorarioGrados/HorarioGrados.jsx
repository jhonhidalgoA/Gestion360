import React, { useState, useEffect } from "react";
import { Save, Plus, Edit, Trash2, Eye, X, Check } from "lucide-react";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import "./HorarioGrados.css";

const MATERIAS = [
  { nombre: "Matemáticas", color: "#667eea" },
  { nombre: "Geometría", color: "#764ba2" },
  { nombre: "Estadística", color: "#f093fb" },
  { nombre: "Tecnología", color: "#4ecdc4" },
  { nombre: "Castellano", color: "#45b7d1" },
  { nombre: "C. Lectora", color: "#96ceb4" },
  { nombre: "Inglés", color: "#ffeaa7" },
  { nombre: "Biología", color: "#55a3ff" },
  { nombre: "Física", color: "#fd79a8" },
  { nombre: "Química", color: "#fdcb6e" },
  { nombre: "Artística", color: "#e17055" },
  { nombre: "Ética", color: "#a29bfe" },
  { nombre: "Religión", color: "#fd7f6e" },
  { nombre: "Cátedra de Paz", color: "#74b9ff" },
  { nombre: "E. Física", color: "#00b894" },
  { nombre: "C. Sociales", color: "#fdaf6e" },
  { nombre: "Historia y Geografía", color: "#e84393" },
  { nombre: "Descanso", color: "#b2bec3" },
  { nombre: "Almuerzo", color: "#ddd6d6" },
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const MATERIAS_CONFIG = [
  { nombre: "Castellano", max: 5 },
  { nombre: "Inglés", max: 4 },
  { nombre: "Matemáticas", max: 4 },
  { nombre: "C. Sociales", max: 3 },
  { nombre: "Historia y Geografía", max: 3 },
  { nombre: "Artística", max: 2 },
  { nombre: "Biología", max: 2 },
  { nombre: "E. Física", max: 2 },
  { nombre: "Tecnología", max: 2 },
  { nombre: "C. Lectora", max: 1 },
  { nombre: "Cátedra de Paz", max: 1 },
  { nombre: "Ética", max: 1 },
  { nombre: "Estadística", max: 1 },
  { nombre: "Física", max: 1 },
  { nombre: "Geometría", max: 1 },
  { nombre: "Química", max: 1 },
  { nombre: "Religión", max: 1 },
  { nombre: "Descanso", max: 5, isBreak: true },
  { nombre: "Almuerzo", max: 5, isBreak: true },
];

const HorarioGrados = () => {
  const [filas, setFilas] = useState([]);
  const [grado, setGrado] = useState("");
  const [director, setDirector] = useState("");
  const [contadores, setContadores] = useState({});
  const [totalHoras, setTotalHoras] = useState(0);
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    action: null,
  });
  const [gradeModal, setGradeModal] = useState(false);

  useEffect(() => {
    const inicial = {};
    MATERIAS_CONFIG.forEach((m) => {
      inicial[m.nombre] = { count: 0, max: m.max };
    });
    setContadores(inicial);
  }, []);

  const agregarFila = () => {
    let inicio = "07:00";
    let fin = "08:00";

    if (filas.length > 0) {
      const ultimaFila = filas[filas.length - 1];
      const [h, m] = ultimaFila.fin.split(":").map(Number);
      const fecha = new Date();
      fecha.setHours(h, m + 60, 0, 0);
      inicio = ultimaFila.fin;
      fin = `${String(fecha.getHours()).padStart(2, "0")}:${String(
        fecha.getMinutes()
      ).padStart(2, "0")}`;
    }

    const nuevaFila = {
      id: Date.now(),
      inicio,
      fin,
      materias: {
        Lunes: "",
        Martes: "",
        Miércoles: "",
        Jueves: "",
        Viernes: "",
      },
    };

    setFilas([...filas, nuevaFila]);
  };

  const cambiarHora = (id, tipo, valor) => {
    setFilas(
      filas.map((f) => {
        if (f.id === id) {
          const [hI, mI] = (tipo === "inicio" ? valor : f.inicio)
            .split(":")
            .map(Number);
          const [hF, mF] = (tipo === "fin" ? valor : f.fin)
            .split(":")
            .map(Number);

          if (hI * 60 + mI >= hF * 60 + mF) {
            showModal(
              "Error",
              "La hora de inicio debe ser anterior a la hora de fin",
              null,
              true
            );
            return f;
          }

          return { ...f, [tipo]: valor };
        }
        return f;
      })
    );
  };

  const cambiarMateria = (filaId, dia, nuevaMateria) => {
    const fila = filas.find((f) => f.id === filaId);
    const materiaAnterior = fila.materias[dia];

    let nuevosContadores = { ...contadores };

    if (materiaAnterior) {
      nuevosContadores[materiaAnterior] = {
        ...nuevosContadores[materiaAnterior],
        count: nuevosContadores[materiaAnterior].count - 1,
      };
    }

    if (nuevaMateria) {
      if (
        nuevosContadores[nuevaMateria].count >=
        nuevosContadores[nuevaMateria].max
      ) {
        showModal(
          "Límite Alcanzado",
          `Has alcanzado el límite de horas para ${nuevaMateria}`,
          null,
          true
        );
        return;
      }

      nuevosContadores[nuevaMateria] = {
        ...nuevosContadores[nuevaMateria],
        count: nuevosContadores[nuevaMateria].count + 1,
      };
    }

    setContadores(nuevosContadores);
    setFilas(
      filas.map((f) => {
        if (f.id === filaId) {
          return {
            ...f,
            materias: { ...f.materias, [dia]: nuevaMateria },
          };
        }
        return f;
      })
    );

    const delta = (nuevaMateria ? 1 : 0) - (materiaAnterior ? 1 : 0);
    setTotalHoras(totalHoras + delta);
  };

  const borrarHorario = () => {
    setFilas([]);
    const inicial = {};
    MATERIAS_CONFIG.forEach((m) => {
      inicial[m.nombre] = { count: 0, max: m.max };
    });
    setContadores(inicial);
    setTotalHoras(0);
    setModal({ show: false, title: "", message: "", action: null });
  };

  const guardarHorario = async () => {
    if (!grado || !director) {
      showModal(
        "Campos Requeridos",
        "Por favor complete Grado y Director de Grupo",
        null,
        true
      );
      return;
    }
    if (totalHoras === 0) {
      showModal("Sin Datos", "No hay horas asignadas para guardar", null, true);
      return;
    }

    const gradoNombreMap = {
      6: "Sexto",
      7: "Séptimo",
      8: "Octavo",
      9: "Noveno",
      10: "Décimo",
      11: "Undécimo",
    };
    const gradoNombre = gradoNombreMap[grado];
    if (!gradoNombre) {
      showModal("Error", "Grado no válido", null, true);
      return;
    }

    const payload = {
      grado_nombre: gradoNombre,
      docente_id: parseInt(director),
      filas: filas.map((fila) => ({
        inicio: fila.inicio,
        fin: fila.fin,
        dias: DIAS.map((dia) => ({
          dia,
          materia: fila.materias[dia] || null,
        })),
      })),
    };

    try {
      const response = await fetch("http://localhost:8000/api/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        showModal("Éxito", "Horario guardado en la base de datos", null, true);
      } else {
        showModal("Error", data.detail || "Error al guardar", null, true);
      }
    } catch (error) {
      console.error("Error:", error);
      showModal("Error", "No se pudo conectar con el servidor", null, true);
    }
  };

  const showModal = (title, message, action, single = false) => {
    setModal({ show: true, title, message, action, single });
  };

  const horasRestantes = 45 - totalHoras;
  const porcentaje = Math.round((totalHoras / 45) * 100);

  return (
    <div className="grid-layout">
      <NavbarSection title="Horario Grados" color="#A9A9A9" />
      <div className="grades-grid-layout">
        <main className="main-content">
          <div className="horario-grados-controls">
            <div className="horario-grados-controls-grid">
              <div className="horario-grados-form-group">
                <label className="horario-grados-label">Grado:</label>
                <select
                  className="horario-grados-select"
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="6">Grado Sexto</option>
                  <option value="7">Grado Séptimo</option>
                  <option value="8">Grado Octavo</option>
                  <option value="9">Grado Noveno</option>
                  <option value="10">Grado Décimo</option>
                  <option value="11">Grado Undécimo</option>
                </select>
              </div>
              <div className="horario-grados-form-group">
                <label className="horario-grados-label">Director:</label>
                <select
                  className="horario-grados-select"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Director 1</option>
                  <option value="2">Director 2</option>
                </select>
              </div>
            </div>

            <div className="horario-grados-stats-container">
              <div className="horario-grados-stat-item">
                <div className="horario-grados-stat-value">{totalHoras}</div>
                <div className="horario-grados-stat-label">Horas Asignadas</div>
              </div>
              <div className="horario-grados-stat-item">
                <div className="horario-grados-stat-value">
                  {horasRestantes}
                </div>
                <div className="horario-grados-stat-label">Horas Restantes</div>
              </div>
              <div className="horario-grados-stat-item">
                <div className="horario-grados-stat-value">{porcentaje}%</div>
                <div className="horario-grados-stat-label">Completado</div>
              </div>
            </div>
          </div>

          <div className="schedule-container">
            <table className="horario-grados-table">
              <thead>
                <tr>
                  <th className="horario-grados-th">Horario</th>
                  {DIAS.map((dia) => (
                    <th key={dia} className="horario-grados-th">
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.id}>
                    <td className="horario-grados-time-cell">
                      <input
                        type="time"
                        value={fila.inicio}
                        onChange={(e) =>
                          cambiarHora(fila.id, "inicio", e.target.value)
                        }
                        className="horario-grados-time-input"
                      />
                      <input
                        type="time"
                        value={fila.fin}
                        onChange={(e) =>
                          cambiarHora(fila.id, "fin", e.target.value)
                        }
                        className="horario-grados-time-input"
                      />
                    </td>
                    {DIAS.map((dia) => (
                      <td key={dia} className="horario-grados-td">
                        <select
                          value={fila.materias[dia]}
                          onChange={(e) =>
                            cambiarMateria(fila.id, dia, e.target.value)
                          }
                          className="horario-grados-subject-select"
                          style={{
                            backgroundColor: fila.materias[dia]
                              ? MATERIAS.find(
                                  (m) => m.nombre === fila.materias[dia]
                                )?.color
                              : "white",
                            color: fila.materias[dia] ? "white" : "#333",
                          }}
                        >
                          <option value="">Seleccionar</option>
                          {MATERIAS.map((m) => (
                            <option
                              key={m.nombre}
                              value={m.nombre}
                              disabled={
                                contadores[m.nombre]?.count >=
                                contadores[m.nombre]?.max
                              }
                            >
                              {m.nombre}
                              {contadores[m.nombre]?.count >=
                              contadores[m.nombre]?.max
                                ? " (Límite)"
                                : ""}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grades-actions">
            <button
              className="grades-btn horario-grados-btn-add"
              onClick={agregarFila}
            >
              <Plus size={20} /> Agregar
            </button>
            <button
              className="grades-btn horario-grados-btn-save"
              onClick={guardarHorario}
            >
              <Save size={20} /> Guardar
            </button>
            <button
              className="grades-btn horario-grados-btn-edit"
              onClick={() => setGradeModal(true)}
            >
              <Edit size={20} /> Editar
            </button>
            <button
              className="grades-btn horario-grados-btn-delete"
              onClick={() =>
                showModal(
                  "Confirmar",
                  "¿Estás seguro de borrar todo el horario?",
                  borrarHorario
                )
              }
            >
              <Trash2 size={20} /> Borrar
            </button>
            <button className="grades-btn horario-grados-btn-view">
              <Eye size={20} /> Ver
            </button>
          </div>
        </main>

        <aside className="horario-grados-sidebar">
          <div className="horario-grados-sidebar-title">
            <h3>Asignación de Materias</h3>
          </div>
          <table className="subjects-table">
            <thead>
              <tr>
                <th className="horario-grados-subject-th">Materia</th>
                <th className="horario-grados-subject-th">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAS_CONFIG.map((materia) => (
                <tr
                  key={materia.nombre}
                  className={materia.isBreak ? "horario-grados-break-row" : ""}
                >
                  <td className="horario-grados-subject-name">
                    {materia.nombre}
                  </td>
                  <td className="horario-grados-subject-hours">
                    <span className="horario-grados-hours-badge">
                      {contadores[materia.nombre]?.count || 0}/{materia.max}
                    </span>
                    <div className="horario-grados-progress-bar">
                      <div
                        className="horario-grados-progress-fill"
                        style={{
                          width: `${
                            ((contadores[materia.nombre]?.count || 0) /
                              materia.max) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>

      {modal.show && (
        <div
          className="horario-grados-modal-overlay"
          onClick={() => setModal({ ...modal, show: false })}
        >
          <div
            className="horario-grados-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="horario-grados-modal-header">
              <h2>{modal.title}</h2>
              <button
                className="horario-grados-close-btn"
                onClick={() => setModal({ ...modal, show: false })}
              >
                <X size={24} />
              </button>
            </div>
            <div className="horario-grados-modal-body">
              <p dangerouslySetInnerHTML={{ __html: modal.message }} />
            </div>
            <div className="horario-grados-modal-footer">
              {!modal.single && (
                <button
                  className="horario-grados-btn horario-grados-btn-cancel"
                  onClick={() => setModal({ ...modal, show: false })}
                >
                  <X size={20} /> Cancelar
                </button>
              )}
              <button
                className="horario-grados-btn horario-grados-btn-confirm"
                onClick={() => {
                  if (modal.action) modal.action();
                  setModal({ ...modal, show: false });
                }}
              >
                <Check size={20} /> Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {gradeModal && (
        <div
          className="horario-grados-modal-overlay"
          onClick={() => setGradeModal(false)}
        >
          <div
            className="horario-grados-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="horario-grados-modal-header">
              <h2>Lista de Grados</h2>
              <button
                className="horario-grados-close-btn"
                onClick={() => setGradeModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="horario-grados-modal-body">
              <table className="horario-grados-grades-table">
                <thead>
                  <tr>
                    <th className="horario-grados-grade-th">#</th>
                    <th className="horario-grados-grade-th">Grado</th>
                    <th className="horario-grados-grade-th">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Sexto",
                    "Séptimo",
                    "Octavo",
                    "Noveno",
                    "Décimo",
                    "Undécimo",
                  ].map((g, i) => (
                    <tr key={i}>
                      <td className="horario-grados-grade-td">{i + 1}</td>
                      <td className="horario-grados-grade-td">{g}</td>
                      <td className="horario-grados-grade-td">
                        <button className="horario-grados-btn horario-grados-btn-edit-small">
                          Editar
                        </button>
                        <button className="horario-grados-btn horario-grados-btn-delete-small">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorarioGrados;
