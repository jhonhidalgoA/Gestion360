import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import "./CrearPlan.css";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

// 🔹 Componentes extraídos
import PreviewMode from "./PreviewMode";
import ProgressStepper from "./ProgressStepper";
import FormStep from "./FormStep";

// --- Opciones estáticas ---
const tipoOptions = [
  { value: "", label: "Seleccionar" },
  { value: "clase", label: "Clase" },
  { value: "taller", label: "Taller" },
  { value: "proyecto", label: "Proyecto" },
  { value: "refuerzo", label: "Refuerzo" },
  { value: "nivelacion", label: "Nivelación" },
  { value: "habilitacion", label: "Habilitación" },
];

const estandarOptions = [
  { value: "", label: "Seleccionar" },
  { value: "est1", label: "Pensamiento espacial y sistemas geométricos" },
  { value: "est2", label: "Estándar 2" },
];

const dbaOptions = [
  { value: "", label: "Seleccionar" },
  {
    value: "dba1",
    label:
      "Utiliza teoremas, propiedades y relaciones geométricas (teorema de Thales y el teorema de Pitágoras) para proponer y  justificar estrategias de medición y cálculo de longitudes.",
  },
  { value: "dba2", label: "DBA 2" },
];

const evidenciaOptions = [
  { value: "", label: "Seleccionar" },
  {
    value: "evid1",
    label:
      "Justifica procedimientos de medición a partir del Teorema de Thales, Teorema de Pitágoras y relaciones intra e interfigurales. ",
  },
  { value: "evid2", label: "Evidencia 2" },
];

const proyectoOptions = [
  { value: "", label: "Seleccionar" },
  { value: "proy1", label: "Proyecto Ambiental Escolar (PRAE)" },
  { value: "proy2", label: "Educación Sexual y Construccion de Ciudadanía" },
  { value: "proy3", label: "Educación para de Paz y Derechos Humanos" },
  { value: "proy4", label: "Gestión del Riesgo de Educación Vial" },
  { value: "proy5", label: "Aprovechamiento del Tiempo Libre" },
  { value: "proy6", label: "Educación Económica y Financiera" },
];

const STEPS = [
  {
    id: 1,
    title: "Información Básica",
    fields: [
      "fecha_inicio",
      "fecha_fin",
      "periodo",
      "grupo",
      "asignatura",
      "tipo",
      "tema",
    ],
  },
  {
    id: 2,
    title: "Estándares y DBA",
    fields: [
      "estandar",
      "dba",
      "evidencia",
      "competencias",
      "proyecto",
      "objetivos",
    ],
    icon: "ads_click",
  },
  {
    id: 3,
    title: "Actividades y Desarrollo de la Clase",
    fields: ["saberes_previos", "analiza", ],
    icon: "psychology",
  },
  {
    id: 4,
    title: "Contenidos y Evaluación",
    fields: ["contenidos", "evaluacion"],
    icon: "psychology",
  },
  {
    id: 5,
    title: "Recursos y Observaciones",
    fields: ["observaciones", "bibliografia"],
    icon: "add_link",
  },
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
      objetivos: "",
    },
    mode: "onBlur",
  });

  const [grupos, setGrupos] = useState([{ value: "", label: "Cargando..." }]);
  const [asignaturas, setAsignaturas] = useState([
    { value: "", label: "Cargando..." },
  ]);
  const [periodos, setPeriodos] = useState([
    { value: "", label: "Cargando..." },
  ]);

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

        const resAsignaturas = await fetch(
          "http://localhost:8000/api/asignaturas"
        );
        if (!resAsignaturas.ok)
          throw new Error("Error al cargar las asignaturas");
        const dataAsignaturas = await resAsignaturas.json();
        const opcionesAsignaturas = dataAsignaturas.map((asig) => ({
          value: asig.nombre.toLowerCase().replace(/\s+/g, "_"),
          label: asig.nombre,
        }));
        setAsignaturas([
          { value: "", label: "Seleccionar" },
          ...opcionesAsignaturas,
        ]);

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
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Plan guardado:", data);
      setMensaje({
        tipo: "exito",
        texto: "Planificación guardada exitosamente.",
      });
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al guardar el plan. Inténtalo más tarde.",
      });
    }
  });

  const handleVerPlan = () => {
    setMensaje({ tipo: "info", texto: "Mostrando plan guardado..." });
  };

  const handleGenerarPDF = async () => {
    setMensaje({ tipo: "info", texto: "Generando PDF..." });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMensaje({ tipo: "exito", texto: "PDF descargado correctamente." });
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

  if (mensaje.tipo === "exito") {
    return (
      <div className="planning">
        <NavbarDocente
          title="Planes de Clase"
          color="#9c27b0"
          icon={
            <span className="material-symbols-outlined navbars-icon">
              checklist_rtl
            </span>
          }
        />
        <main className="post-save-container">
          <div className="post-save-actions">
            <h3>Planificación guardada exitosamente</h3>
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={handleVerPlan}>
                Ver Plan
              </button>
              <button className="btn btn-primary" onClick={handleGenerarPDF}>
                Generar PDF
              </button>
              <button className="btn btn-outline" onClick={handleNuevoPlan}>
                Nuevo Plan
              </button>
            </div>
            {mensaje.texto && (
              <div
                className={`feedback-message feedback-${
                  mensaje.tipo === "exito" ? "success" : "error"
                }`}
              >
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
        icon={
          <span className="material-symbols-outlined navbars-icon">
            checklist_rtl
          </span>
        }
      />

      {!previewMode && (
        <ProgressStepper steps={STEPS} currentStep={currentStep} />
      )}

      <main>
        <form className="form-wrappers" onSubmit={(e) => e.preventDefault()}>
          {previewMode ? (
            <PreviewMode
              getValues={getValues}
              grupos={grupos}
              asignaturas={asignaturas}
              periodos={periodos}
              tipoOptions={tipoOptions}
              estandarOptions={estandarOptions}
              dbaOptions={dbaOptions}
              evidenciaOptions={evidenciaOptions}
              proyectoOptions={proyectoOptions}
              onEdit={() => setPreviewMode(false)}
              onSave={handleGuardar}
            />
          ) : (
            <>
              <FormStep
                currentStep={currentStep}
                register={register}
                errors={errors}
                grupos={grupos}
                asignaturas={asignaturas}
                periodos={periodos}
                tipoOptions={tipoOptions}
                estandarOptions={estandarOptions}
                dbaOptions={dbaOptions}
                evidenciaOptions={evidenciaOptions}
                proyectoOptions={proyectoOptions}
              />

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
                          texto: `Complete todos los campos obligatorios en "${
                            STEPS[currentStep - 1].title
                          }".`,
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
                          texto:
                            "Complete todos los campos obligatorios antes de la vista previa.",
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

          {/* Mensaje de feedback */}
          {mensaje.texto && mensaje.tipo !== "exito" && (
            <div
              className={`feedback-message feedback-${
                mensaje.tipo === "exito" ? "success" : "error"
              }`}
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
