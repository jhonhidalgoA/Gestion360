import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import "./CrearPlan.css";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

// Componentes extraídos
import PreviewMode from "./PreviewMode";
import ProgressStepper from "./ProgressStepper";
import FormStep from "./FormStep";

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
    fields: ["saberes_previos", "analiza"],
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
    watch,
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

  // --- Estados dinámicos ---
  const [grupos, setGrupos] = useState([{ value: "", label: "Cargando..." }]);
  const [asignaturas, setAsignaturas] = useState([
    { value: "", label: "Cargando..." },
  ]);
  const [periodos, setPeriodos] = useState([
    { value: "", label: "Cargando..." },
  ]);
  const [estandares, setEstandares] = useState([
    { value: "", label: "Seleccionar..." },
  ]);
  const [dbas, setDbas] = useState([{ value: "", label: "Seleccionar..." }]);
  const [evidencias, setEvidencias] = useState([
    { value: "", label: "Seleccionar..." },
  ]);
  const [tiposActividad, setTiposActividad] = useState([
    { value: "", label: "Cargando..." },
  ]);
  const [proyectosTransversales, setProyectosTransversales] = useState([
    { value: "", label: "Cargando..." },
  ]);
  const [planGuardadoId, setPlanGuardadoId] = useState(null);

  // --- Watchers ---
  const selectedAsignatura = watch("asignatura");
  const selectedGrupo = watch("grupo");
  const selectedEstandar = watch("estandar");
  const selectedDba = watch("dba");

  // --- Cargar datos iniciales ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resGrados, resAsignaturas, resPeriodos, resTipos, resProyectos] =
          await Promise.all([
            fetch("http://localhost:8000/api/grados"),
            fetch("http://localhost:8000/api/asignaturas"),
            fetch("http://localhost:8000/api/periodos"),
            fetch("http://localhost:8000/api/tipos-actividad"),
            fetch("http://localhost:8000/api/proyectos-transversales"),
          ]);

        if (!resGrados.ok) throw new Error("Error al cargar grados");
        if (!resAsignaturas.ok) throw new Error("Error al cargar asignaturas");
        if (!resPeriodos.ok) throw new Error("Error al cargar períodos");
        if (!resTipos.ok) throw new Error("Error al cargar tipos de actividad");
        if (!resProyectos.ok)
          throw new Error("Error al cargar proyectos transversales");

        const [grados, asignaturas, periodos, tipos, proyectos] =
          await Promise.all([
            resGrados.json(),
            resAsignaturas.json(),
            resPeriodos.json(),
            resTipos.json(),
            resProyectos.json(),
          ]);

        setGrupos([
          { value: "", label: "Seleccionar" },
          ...grados.map((g) => ({ value: String(g.id), label: g.nombre })),
        ]);
        setAsignaturas([
          { value: "", label: "Seleccionar" },
          ...asignaturas.map((a) => ({
            value: a.nombre.toLowerCase().replace(/\s+/g, "_"),
            label: a.nombre,
          })),
        ]);
        setPeriodos([
          { value: "", label: "Seleccionar" },
          ...periodos.map((p) => ({ value: String(p.id), label: p.nombre })),
        ]);
        setTiposActividad(tipos);
        setProyectosTransversales(proyectos);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setGrupos([{ value: "", label: "Error" }]);
        setAsignaturas([{ value: "", label: "Error" }]);
        setPeriodos([{ value: "", label: "Error" }]);
        setTiposActividad([{ value: "", label: "Error" }]);
        setProyectosTransversales([{ value: "", label: "Error" }]);
      }
    };
    cargarDatos();
  }, []);

  // --- Cargar estándares por asignatura ---
  useEffect(() => {
    if (!selectedAsignatura) {
      setEstandares([{ value: "", label: "Seleccionar..." }]);
      reset({ ...getValues(), estandar: "", dba: "", evidencia: "" });
      return;
    }
    const fetchEstandares = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/estandares-por-asignatura?asignatura=${selectedAsignatura}`
        );
        if (!res.ok) throw new Error("Error al cargar estándares");
        const data = await res.json();
        setEstandares([
          { value: "", label: "Seleccionar" },
          ...data.map((e) => ({ value: String(e.id), label: e.nombre })),
        ]);
      } catch (err) {
        console.error("Error al cargar estándares:", err);
        setEstandares([{ value: "", label: "Error" }]);
        reset({ ...getValues(), estandar: "", dba: "", evidencia: "" });
      }
    };
    fetchEstandares();
  }, [selectedAsignatura, reset, getValues]);

  // --- Cargar DBA por asignatura + grado + estándar ---
  useEffect(() => {
    if (!selectedAsignatura || !selectedGrupo || !selectedEstandar) {
      setDbas([{ value: "", label: "Seleccionar..." }]);
      setEvidencias([{ value: "", label: "Seleccionar..." }]);
      reset({ ...getValues(), dba: "", evidencia: "" });
      return;
    }
    const fetchDbas = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/dba-por-filtros?asignatura=${selectedAsignatura}&grado_id=${selectedGrupo}&estandar_id=${selectedEstandar}`
        );
        if (!res.ok) throw new Error("Error al cargar DBA");
        const data = await res.json();
        setDbas([
          { value: "", label: "Seleccionar" },
          ...data.map((d) => ({ value: String(d.id), label: d.descripcion })),
        ]);
        setEvidencias([{ value: "", label: "Seleccionar..." }]);
      } catch (err) {
        console.error("Error al cargar DBA:", err);
        setDbas([{ value: "", label: "Error" }]);
        setEvidencias([{ value: "", label: "Seleccionar..." }]);
        reset({ ...getValues(), dba: "", evidencia: "" });
      }
    };
    fetchDbas();
  }, [selectedAsignatura, selectedGrupo, selectedEstandar, reset, getValues]);

  // --- Cargar evidencias por DBA ---
  useEffect(() => {
    if (!selectedDba) {
      setEvidencias([{ value: "", label: "Seleccionar..." }]);
      reset({ ...getValues(), evidencia: "" });
      return;
    }
    const fetchEvidencias = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/evidencias-por-dba?dba_id=${selectedDba}`
        );
        if (!res.ok) throw new Error("Error al cargar evidencias");
        const data = await res.json();
        setEvidencias([
          { value: "", label: "Seleccionar" },
          ...data.map((e) => ({ value: String(e.id), label: e.descripcion })),
        ]);
      } catch (err) {
        console.error("Error al cargar evidencias:", err);
        setEvidencias([{ value: "", label: "Error" }]);
        reset({ ...getValues(), evidencia: "" });
      }
    };
    fetchEvidencias();
  }, [selectedDba, reset, getValues]);

  // --- Estados UI ---
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
      // Obtener el docente_user_id desde sessionStorage o contexto
      const docente_user_id = "6621c135-e0a0-44e4-9895-1aa641117b1b"; 

      if (!docente_user_id) {
        throw new Error("No se pudo obtener el ID del docente");
      }

      // Preparar los datos para enviar
      const payload = {
        ...data,
        docente_user_id: docente_user_id,
      };

      console.log("Plan guardado:", payload); // Verifica los datos antes de enviar

      const res = await fetch("http://localhost:8000/api/guardar-plan-clase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al guardar");
      }

      const result = await res.json();
      setPlanGuardadoId(result.plan_id); // 👈 Aquí se usa setPlanGuardadoId
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
      // Aquí deberías usar planGuardadoId
      const url = `http://localhost:8000/api/pdf/plan-clase/${planGuardadoId}`;
      window.open(url, "_blank");
      setMensaje({
        tipo: "exito",
        texto: "PDF generado y abierto en nueva pestaña.",
      });
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
    setEstandares([{ value: "", label: "Seleccionar..." }]);
    setDbas([{ value: "", label: "Seleccionar..." }]);
    setEvidencias([{ value: "", label: "Seleccionar..." }]);
  };

  if (mensaje.tipo === "exito") {
    return (
      <div className="planning">
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
              tipoOptions={tiposActividad}
              estandarOptions={estandares}
              dbaOptions={dbas}
              evidenciaOptions={evidencias}
              proyectoOptions={proyectosTransversales}
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
                tipoOptions={tiposActividad}
                estandarOptions={estandares}
                dbaOptions={dbas}
                evidenciaOptions={evidencias}
                proyectoOptions={proyectosTransversales}
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
