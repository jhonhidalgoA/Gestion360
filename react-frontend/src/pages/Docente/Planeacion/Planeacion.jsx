import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
import "./Planeacion.css";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const tipoOptions = [
  { value: "", label: "Seleccionar" },
  { value: "clase", label: "Clase" },
  { value: "taller", label: "Taller" },
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

const Planeacion = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dateStar: "",
      dateEnd: "",
      periodo: "",
      grupo: "",
      asignatura: "",
      tipo: "",
      estandar: "",
      dba: "",
      evidencia: "",
      competencias: "",
      objetivos: "",
      proyecto: "",
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
        // 1. Cargar grados
        const resGrados = await fetch("http://localhost:8000/api/grados");
        if (!resGrados.ok) throw new Error("Error al cargar los grados");
        const dataGrados = await resGrados.json();
        const opcionesGrados = dataGrados.map((grado) => ({
          value: String(grado.id),
          label: grado.nombre,
        }));
        setGrupos([{ value: "", label: "Seleccionar" }, ...opcionesGrados]);

        // 2. Cargar asignaturas
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

        // 3. Cargar períodos
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

  const [loading, setLoading] = useState({
    cargar: false,
    guardar: false,
    ver: false,
    pdf: false,
  });
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const manejarAccion = async (data, action) => {
    setMensaje({ tipo: "", texto: "" });
    setLoading((prev) => ({ ...prev, [action]: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("✅ Datos enviados:", { ...data, action });

      setMensaje({
        tipo: "exito",
        texto: `Acción "${action}" procesada correctamente.`,
      });
    } catch (error) {
      console.error("❌ Error:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al procesar la solicitud. Inténtalo más tarde.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  const handleCargar = handleSubmit((data) => manejarAccion(data, "cargar"));
  const handleGuardar = handleSubmit((data) => manejarAccion(data, "guardar"));
  const handleVer = handleSubmit((data) => manejarAccion(data, "ver"));
  const handleDelete = handleSubmit((data) => manejarAccion(data, "borrar"));

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
      <main className="main-content">
        <form className="form-wrapper" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateStar">Fecha de Inicio:</label>
              <input
                type="date"
                id="dateStar"
                className={`input-line ${errors.dateStar ? "input-error" : ""}`}
                {...register("dateStar", {
                  required: "Este campo es obligatorio",
                })}
              />
              {errors.dateStar && (
                <span className="error-message">{errors.dateStar.message}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="dateEnd">Fecha de Fin:</label>
              <input
                type="date"
                id="dateEnd"
                className={`input-line ${errors.dateEnd ? "input-error" : ""}`}
                {...register("dateEnd", {
                  required: "Este campo es obligatorio",
                })}
              />
              {errors.dateEnd && (
                <span className="error-message">{errors.dateEnd.message}</span>
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

          <div className="form-row">
            <SelectField
              label="Estandar:"
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
                className={`input-line ${
                  errors.competencias ? "input-error" : ""
                }`}
                placeholder="Escribe aquí las competencias..."
                rows="4"
                {...register("competencias", {
                  required: "Este campo es obligatorio",
                })}
              ></textarea>
              {errors.competencias && (
                <span className="error-message">
                  {errors.competencias.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="objetivos">Objetivos:</label>
              <textarea
                id="objetivos"
                className={`input-line ${
                  errors.objetivos ? "input-error" : ""
                }`}
                placeholder="Escribe aquí los objetivos..."
                rows="4"
                {...register("objetivos", {
                  required: "Este campo es obligatorio",
                })}
              ></textarea>
              {errors.objetivos && (
                <span className="error-message">
                  {errors.objetivos.message}
                </span>
              )}
            </div>
            <SelectField
              label="Proyecto Transversal:"
              id="proyecto"
              register={register}
              errors={errors}
              required
              options={proyectoOptions}
            />
          </div>

          <ActionButtons
            onLoad={handleCargar}
            loadLoading={loading.cargar}
            loadLabel="Nuevo"
            onSave={handleGuardar}
            saveLoading={loading.guardar}
            saveLabel="Guardar"
            onDelete={handleDelete}
            deleteLoading={loading.delete}
            onView={handleVer}
            viewLoading={loading.ver}
            viewLabel="Ver"
          />

          {mensaje.texto && (
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
