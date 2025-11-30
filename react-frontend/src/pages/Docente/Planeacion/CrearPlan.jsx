import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import Modal from "../../../components/ui/Modal";

import "./CrearPlan.css";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

// Componentes
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
  const mainRef = useRef(null);

  // --- Estados UI ---
  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlreadyExistsModal, setShowAlreadyExistsModal] = useState(false);

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

  const canProceed = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    return step.fields.every((field) => !errors[field]);
  };

  const handleGuardar = handleSubmit(async (data) => {
    setMensaje({ tipo: "", texto: "" });
    try {
      const userSessionString = sessionStorage.getItem("user_session");
      if (!userSessionString) {
        throw new Error("No se encontró la sesión del usuario");
      }

      const userSession = JSON.parse(userSessionString);
      if (!userSession.username) {
        throw new Error("No se encontró el username en la sesión");
      }

      const resDocente = await fetch(
        `http://localhost:8000/api/docente-uuid/${userSession.username}`
      );
      if (!resDocente.ok) {
        const errorData = await resDocente.json();
        throw new Error(
          errorData.detail || "Error al obtener el ID del docente"
        );
      }
      const docenteData = await resDocente.json();
      const docente_user_id = docenteData.docente_user_id;

      if (!docente_user_id) {
        throw new Error("No se recibió un ID válido del docente");
      }

      const payload = {
        ...data,
        docente_user_id: docente_user_id,
      };

      console.log("Plan guardado:", payload);

      const res = await fetch("http://localhost:8000/api/guardar-plan-clase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // ✅ Manejo del error 409: plan ya existe
        if (res.status === 409) {
          setPlanGuardadoId(null);
          setShowAlreadyExistsModal(true);
          return;
        }
        throw new Error(errorData.detail || "Error al guardar el plan");
      }

      const result = await res.json();
      setPlanGuardadoId(result.plan_id);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      setMensaje({
        tipo: "error",
        texto:
          error.message || "Error al guardar el plan. Inténtalo más tarde.",
      });
    }
  });

  const handleGenerarPDF = async () => {
  setMensaje({ tipo: "info", texto: "Generando PDF..." });
  try {
    if (!planGuardadoId) {
      setMensaje({
        tipo: "error",
        texto: "No hay un plan guardado para generar PDF.",
      });
      return;
    }

    const url = `http://localhost:8000/api/pdf/plan-clase/${planGuardadoId}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("No se pudo generar el PDF.");
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `plan_clase_${planGuardadoId}.pdf`; // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    setShowSuccessModal(false);
    setShowAlreadyExistsModal(false);
    setMensaje({ tipo: "", texto: "" });
  } catch (err) {
    console.error("Error al generar PDF:", err);
    setMensaje({ tipo: "error", texto: "No se pudo descargar el PDF." });
  }
};

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEdit = () => {
    setPreviewMode(false); 
    setCurrentStep(1); 
    scrollToTop(); 
  };

  const handleNuevoPlan = () => {
    reset({
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
    });
    setCurrentStep(1);
    setPreviewMode(false);
    setEstandares([{ value: "", label: "Seleccionar..." }]);
    setDbas([{ value: "", label: "Seleccionar..." }]);
    setEvidencias([{ value: "", label: "Seleccionar..." }]);
    setMensaje({ tipo: "", texto: "" });
    setShowSuccessModal(false);
    setShowAlreadyExistsModal(false);
    setPlanGuardadoId(null);

    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="planning" ref={mainRef}>
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
              onEdit={handleEdit}
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

          {/* Mensajes solo de error */}
          {mensaje.tipo === "error" && mensaje.texto && (
            <div className="feedback-message feedback-error">
              {mensaje.texto}
            </div>
          )}
        </form>
      </main>

      {/* Modal: Plan guardado exitosamente */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={
          <>
            Colegio <span className="modal-title-360">STEM 360</span>
          </>
        }
        message="Planeación guardada con exito"
        buttons={[
          {
            text: "Nuevo Plan",
            className: "btn-load",
            icon: <FaPlus />,
            onClick: handleNuevoPlan,
          },
          {
            text: "Descargar PDF",
            className: "btn-pdf",
            icon: <FaDownload />,
            onClick: handleGenerarPDF,
          },
        ]}
      />

      {/* Ya existe el plan */}
      <Modal
        isOpen={showAlreadyExistsModal}
        onClose={() => setShowAlreadyExistsModal(false)}
         title={
          <>
            Colegio <span className="modal-title-360">STEM 360</span>
          </>
        }
        message="Ya existe el plan de clase."
       
        buttons={[
          {
            text: "Nuevo Plan",
            className: "btn-load",
            icon: <FaPlus />,
            onClick: handleNuevoPlan,
          },
          {
            text: "Descargar PDF",
            className: "btn-pdf",
            icon: <FaDownload />,
            onClick: handleGenerarPDF,
          },
        ]}
      />
    </div>
  );
};

export default Planeacion;
