import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
import "./Planeacion.css";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

// === OPCIONES ESTÁTICAS ===
const tipoOptions = [
  { value: "", label: "Seleccionar" },
  { value: "clase", label: "Clase" },
  { value: "taller", label: "Taller" },
  { value: "proyecto", label: "Proyecto" },
  { value: "refuerzo", label: "Refuerzo" },
  { value: "nivelacion", label: "Nivelación" },
];

const estandarOptions = [
  { value: "", label: "Seleccionar" },
  { value: "est1", label: "Estándar 1" },
  { value: "est2", label: "Estándar 2" },
];

const dbaOptions = [
  { value: "", label: "Seleccionar" },
  { value: "dba1", label: "DBA 1" },
  { value: "dba2", label: "DBA 2" },
];

const evidenciaOptions = [
  { value: "", label: "Seleccionar" },
  { value: "evid1", label: "Evidencia 1" },
  { value: "evid2", label: "Evidencia 2" },
];

const proyectoOptions = [
  { value: "", label: "Seleccionar" },
  { value: "proy1", label: "Proyecto 1" },
  { value: "proy2", label: "Proyecto 2" },
];

const STEPS = [
  { id: 1, title: "Información Básica", fields: ["fecha_inicio", "fecha_fin", "periodo", "grupo", "asignatura", "tipo", "tema"], icon: "calendar_month" },
  { id: 2, title: "Estándares y DBA", fields: ["estandar", "dba", "evidencia", "competencias", "proyecto"], icon: "ads_click" },
  { id: 3, title: "Actividades y Desarrollo de la Clase", fields: ["saberes_previos", "contenidos", "evaluacion"], icon: "psychology" },
  { id: 4, title: "Recursos y Observaciones", fields: ["observaciones", "bibliografia"], icon: "add_link" },
];

const Planeacion = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      fecha_inicio: "",
      fecha_fin: "",
      periodo: "",
      grupo: "",
      asignatura: "",
      tipo: "",
      tema: "",
      estandar: "",
      dba: "",
      evidencia: "",
      competencias: "",
      proyecto: "",
      saberes_previos: "",
      contenidos: "",
      evaluacion: "",
      observaciones: "",
      bibliografia: "",
    },
    mode: "onBlur",
  });

  const [grupos, setGrupos] = useState([{ value: "", label: "Cargando..." }]);
  const [asignaturas, setAsignaturas] = useState([{ value: "", label: "Cargando..." }]);
  const [periodos, setPeriodos] = useState([{ value: "", label: "Cargando..." }]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resGrados = await fetch("http://localhost:8000/api/grados");
        if (!resGrados.ok) throw new Error("Error al cargar los grados");
        const dataGrados = await resGrados.json();
        const opcionesGrados = dataGrados.map((grado) => ({
          value: String(grado.id),
          label: grado.nombre,
        }));
        setGrupos([{ value: "", label: "Seleccionar" }, ...opcionesGrados]);

        const resAsignaturas = await fetch("http://localhost:8000/api/asignaturas");
        if (!resAsignaturas.ok) throw new Error("Error al cargar las asignaturas");
        const dataAsignaturas = await resAsignaturas.json();
        const opcionesAsignaturas = dataAsignaturas.map((asig) => ({
          value: asig.nombre.toLowerCase().replace(/\s+/g, "_"),
          label: asig.nombre,
        }));
        setAsignaturas([{ value: "", label: "Seleccionar" }, ...opcionesAsignaturas]);

        const resPeriodos = await fetch("http://localhost:8000/api/periodos");
        if (!resPeriodos.ok) throw new Error("Error al cargar los períodos");
        const dataPeriodos = await resPeriodos.json();
        const opcionesPeriodos = dataPeriodos.map((periodo) => ({
          value: String(periodo.id),
          label: periodo.nombre,
        }));
        setPeriodos([{ value: "", label: "Seleccionar" }, ...opcionesPeriodos]);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setGrupos([{ value: "", label: "Error al cargar grados" }]);
        setAsignaturas([{ value: "", label: "Error al cargar asignaturas" }]);
        setPeriodos([{ value: "", label: "Error al cargar períodos" }]);
      }
    };

    cargarDatos();
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const canProceed = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    return step.fields.every((field) => !errors[field]);
  };

  const handleGuardar = handleSubmit(async (data) => {
    setMensaje({ tipo: "", texto: "" });
    try {
      // Simulación de guardado
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Plan guardado:", data);
      setMensaje({ tipo: "exito", texto: "Planificación guardada exitosamente." });
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      setMensaje({ tipo: "error", texto: "Error al guardar el plan. Inténtalo más tarde." });
    }
  });

  const handleVerPlan = () => {
    setMensaje({ tipo: "info", texto: "Mostrando plan guardado..." });
    // Opcional: navegar a /planeacion/:id
  };

  const handleGenerarPDF = async () => {
    setMensaje({ tipo: "info", texto: "Generando PDF..." });
    try {
      // Aquí integrarías tu endpoint real
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMensaje({ tipo: "exito", texto: "PDF descargado correctamente." });
      // En producción: fetch + blob + descarga
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setMensaje({ tipo: "error", texto: "No se pudo generar el PDF." });
    }
  };

  const handleNuevoPlan = () => {
    reset();
    setCurrentStep(1);
    setPreviewMode(false);
    setMensaje({ tipo: "", texto: "" });
  };

  const AccordionSection = ({ children, title, icon }) => (
    <div className="accordion-section open">
      <div className="accordion-header">
        <span className="material-symbols-outlined" style={{ fontSize: "40px", marginRight: "8px" }}>
          {icon}
        </span>
        <span className="accordion-title">{title}</span>
      </div>
      <div className="accordion-content">{children}</div>
    </div>
  );

  // Solo mostrar el formulario si NO hay éxito
  if (mensaje.tipo === "exito") {
    return (
      <div className="planning">
        <NavbarDocente
          title="Planes de Clase"
          color="#9c27b0"
          icon={<span className="material-symbols-outlined navbars-icon">checklist_rtl</span>}
        />
        <main className="post-save-container">
          <div className="post-save-actions">
            <h3>✅ Planificación guardada exitosamente</h3>
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={handleVerPlan}>
                👁️ Ver Plan
              </button>
              <button className="btn btn-primary" onClick={handleGenerarPDF}>
                📄 Generar PDF
              </button>
              <button className="btn btn-outline" onClick={handleNuevoPlan}>
                ➕ Nuevo Plan
              </button>
            </div>
            {mensaje.texto && (
              <div className={`feedback-message feedback-${mensaje.tipo === "exito" ? "success" : "error"}`}>
                {mensaje.texto}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="planning">
      <NavbarDocente
        title="Planes de Clase"
        color="#9c27b0"
        icon={<span className="material-symbols-outlined navbars-icon">checklist_rtl</span>}
      />

      {/* Indicador de progreso*/}
      {!previewMode && (
        <div className="progress-stepper">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`step ${currentStep >= step.id ? "active" : ""} ${
                currentStep > step.id ? "completed" : ""
              }`}
            >
              <div className="step-number">{currentStep > step.id ? "✓" : step.id}</div>
              <div className="step-label">{step.title}</div>
            </div>
          ))}
        </div>
      )}

      <main>
        <form className="form-wrappers" onSubmit={(e) => e.preventDefault()}>
          {/* Vista previa */}
          {previewMode ? (
            <div className="preview-container">
              <h2>Vista Previa del Plan de Clase</h2>
              <div className="preview-section">
                <h3>Información Básica</h3>
                <p><strong>Fecha Inicio:</strong> {getValues("fecha_inicio") || "–"}</p>
                <p><strong>Fecha Fin:</strong> {getValues("fecha_fin") || "–"}</p>
                <p><strong>Periodo:</strong> {periodos.find(p => p.value === getValues("periodo"))?.label || "–"}</p>
                <p><strong>Grupo:</strong> {grupos.find(g => g.value === getValues("grupo"))?.label || "–"}</p>
                <p><strong>Asignatura:</strong> {asignaturas.find(a => a.value === getValues("asignatura"))?.label || "–"}</p>
                <p><strong>Tipo:</strong> {tipoOptions.find(t => t.value === getValues("tipo"))?.label || "–"}</p>
                <p><strong>Tema:</strong> {getValues("tema") || "–"}</p>
              </div>

              <div className="preview-section">
                <h3>Estándares y DBA</h3>
                <p><strong>Estándar:</strong> {getValues("estandar") || "–"}</p>
                <p><strong>DBA:</strong> {getValues("dba") || "–"}</p>
                <p><strong>Evidencia:</strong> {getValues("evidencia") || "–"}</p>
                <p><strong>Competencias:</strong> {getValues("competencias") || "–"}</p>
                <p><strong>Proyecto:</strong> {getValues("proyecto") || "–"}</p>
              </div>

              <div className="preview-section">
                <h3>Actividades</h3>
                <p><strong>Saberes Previos:</strong> {getValues("saberes_previos") || "–"}</p>
                <p><strong>Contenidos:</strong> {getValues("contenidos") || "–"}</p>
                <p><strong>Evaluación:</strong> {getValues("evaluacion") || "–"}</p>
              </div>

              <div className="preview-section">
                <h3>Recursos y Observaciones</h3>
                <p><strong>Observaciones:</strong> {getValues("observaciones") || "–"}</p>
                <p><strong>Bibliografía:</strong> {getValues("bibliografia") || "–"}</p>
              </div>

              <div className="preview-actions">
                <button className="btn btn-secondary" onClick={() => setPreviewMode(false)}>
                  ← Editar
                </button>
                <button className="btn btn-success" onClick={handleGuardar}>
                  Guardar Plan
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* formulario*/}
              {currentStep === 1 && (
                <AccordionSection title="Información Básica"  icon={<span className="material-symbols-outlined icon-planning">calendar_month</span>}>                 
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
                      <input
                        type="date"
                        id="fecha_inicio"
                        className={`input-line ${errors.fecha_inicio ? "input-error" : ""}`}
                        {...register("fecha_inicio", { required: "Este campo es obligatorio" })}
                      />
                      {errors.fecha_inicio && (
                        <span className="error-message">{errors.fecha_inicio.message}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="fecha_fin">Fecha de Fin:</label>
                      <input
                        type="date"
                        id="fecha_fin"
                        className={`input-line ${errors.fecha_fin ? "input-error" : ""}`}
                        {...register("fecha_fin", { required: "Este campo es obligatorio" })}
                      />
                      {errors.fecha_fin && (
                        <span className="error-message">{errors.fecha_fin.message}</span>
                      )}
                    </div>
                    <SelectField
                      label="Periodo:"
                      id="periodo"
                      register={register}
                      errors={errors}
                      required
                      options={periodos}
                    />
                  </div>

                  <div className="form-row">
                    <SelectField
                      label="Grupo:"
                      id="grupo"
                      register={register}
                      errors={errors}
                      required
                      options={grupos}
                    />
                    <SelectField
                      label="Asignatura:"
                      id="asignatura"
                      register={register}
                      errors={errors}
                      required
                      options={asignaturas}
                    />
                    <SelectField
                      label="Tipo:"
                      id="tipo"
                      register={register}
                      errors={errors}
                      required
                      options={tipoOptions}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tema">Nombre de la Unidad / Tema:</label>
                    <input
                      type="text"
                      id="tema"
                      className={`input-line input-planning ${errors.tema ? "input-error" : ""}`}
                      {...register("tema", { required: "Este campo es obligatorio" })}
                      placeholder="Ej: Circunferencia, Ecuaciones lineales..."
                    />
                    {errors.tema && (
                      <span className="error-message">{errors.tema.message}</span>
                    )}
                  </div>
                </AccordionSection>
              )}
              {currentStep === 2 && (
                <AccordionSection title="Estándares y DBA" icon="ads_click">
                  <div className="form-row">
                    <SelectField
                      label="Estándar:"
                      id="estandar"
                      register={register}
                      errors={errors}
                      required
                      options={estandarOptions}
                    />
                    <SelectField
                      label="DBA:"
                      id="dba"
                      register={register}
                      errors={errors}
                      required
                      options={dbaOptions}
                    />
                    <SelectField
                      label="Evidencia de Aprendizaje:"
                      id="evidencia"
                      register={register}
                      errors={errors}
                      required
                      options={evidenciaOptions}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="competencias">Competencias:</label>
                      <textarea
                        id="competencias"
                        className={`input-line ${errors.competencias ? "input-error" : ""}`}
                        placeholder="Escribe aquí las competencias a desarrollar..."
                        rows="4"
                        {...register("competencias", { required: "Este campo es obligatorio" })}
                      ></textarea>
                      {errors.competencias && (
                        <span className="error-message">{errors.competencias.message}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="proyecto">Proyecto Transversal:</label>
                      <SelectField
                        label=""
                        id="proyecto"
                        register={register}
                        errors={errors}
                        required
                        options={proyectoOptions}
                      />
                    </div>
                  </div>
                </AccordionSection>
              )}

              {currentStep === 3 && (
                <AccordionSection title="Actividades y Desarrollo de la Clase" icon="psychology">
                  <div className="form-group">
                    <label htmlFor="saberes_previos">Saberes Previos (Inicio):</label>
                    <textarea
                      id="saberes_previos"
                      className={`input-line ${errors.saberes_previos ? "input-error" : ""}`}
                      placeholder="Describe actividades o preguntas para activar conocimientos previos..."
                      rows="4"
                      {...register("saberes_previos", { required: "Este campo es obligatorio" })}
                    ></textarea>
                    {errors.saberes_previos && (
                      <span className="error-message">{errors.saberes_previos.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contenidos">Contenidos / Desarrollo:</label>
                    <textarea
                      id="contenidos"
                      className={`input-line ${errors.contenidos ? "input-error" : ""}`}
                      placeholder="Describe los temas, explicaciones, ejemplos o actividades del desarrollo..."
                      rows="4"
                      {...register("contenidos", { required: "Este campo es obligatorio" })}
                    ></textarea>
                    {errors.contenidos && (
                      <span className="error-message">{errors.contenidos.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="evaluacion">Evaluación:</label>
                    <textarea
                      id="evaluacion"
                      className={`input-line ${errors.evaluacion ? "input-error" : ""}`}
                      placeholder="Describe cómo se evaluará el aprendizaje (instrumentos, criterios, actividades)..."
                      rows="4"
                      {...register("evaluacion", { required: "Este campo es obligatorio" })}
                    ></textarea>
                    {errors.evaluacion && (
                      <span className="error-message">{errors.evaluacion.message}</span>
                    )}
                  </div>
                </AccordionSection>
              )}

              {currentStep === 4 && (
                <AccordionSection title="Recursos y Observaciones" icon="add_link">
                  <div className="form-group">
                    <label htmlFor="observaciones">Observaciones:</label>
                    <textarea
                      id="observaciones"
                      className={`input-line ${errors.observaciones ? "input-error" : ""}`}
                      placeholder="Notas adicionales, adaptaciones, incidencias, etc."
                      rows="4"
                      {...register("observaciones", { required: "Este campo es obligatorio" })}
                    ></textarea>
                    {errors.observaciones && (
                      <span className="error-message">{errors.observaciones.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bibliografia">Bibliografía / Recursos:</label>
                    <textarea
                      id="bibliografia"
                      className={`input-line ${errors.bibliografia ? "input-error" : ""}`}
                      placeholder="Libros, páginas web, videos, materiales utilizados..."
                      rows="4"
                      {...register("bibliografia", { required: "Este campo es obligatorio" })}
                    ></textarea>
                    {errors.bibliografia && (
                      <span className="error-message">{errors.bibliografia.message}</span>
                    )}
                  </div>
                </AccordionSection>
              )}

              {/* Navegación entre pasos */}
              <div className="step-navigation">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    ← Paso Anterior
                  </button>
                )}

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (canProceed(currentStep)) {
                        setCurrentStep(currentStep + 1);
                      } else {
                        setMensaje({
                          tipo: "error",
                          texto: `Complete todos los campos obligatorios en "${STEPS[currentStep - 1].title}".`,
                        });
                      }
                    }}
                  >
                    Paso Siguiente →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (canProceed(currentStep)) {
                        setPreviewMode(true);
                      } else {
                        setMensaje({
                          tipo: "error",
                          texto: "Complete todos los campos obligatorios antes de la vista previa.",
                        });
                      }
                    }}
                  >
                    Vista Previa
                  </button>
                )}
              </div>
            </>
          )}

          {/* Mensaje de feedback (solo si no hay éxito) */}
          {mensaje.texto && mensaje.tipo !== "exito" && (
            <div
              className={`feedback-message feedback-${mensaje.tipo === "exito" ? "success" : "error"}`}
            >
              {mensaje.texto}
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default Planeacion;