import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
import "./Tareas.css";

const Tareas = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      grupo: "",
      asignatura: "",
      fechaInicio: "",
      fechaFin: "",
      tema: "",
      descripcion: "",
      url: "",
    },
    mode: "onBlur",
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
  const [todosSeleccionados, setTodosSeleccionados] = useState(false);
  const [loading, setLoading] = useState({
    cargar: false,
    guardar: false,
    ver: false,
    borrar: false, // Cambiado de 'delete' a 'borrar' para consistencia
  });
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const fileInputRef = useRef(null);

  // Observar cambios en el campo grupo
  const grupoValue = watch("grupo");

  const grupoOptions = [
    { value: "", label: "Seleccionar" },
    { value: "6", label: "Grado Sexto" },
    { value: "7", label: "Grado Séptimo" },
    { value: "8", label: "Grado Octavo" },
    { value: "9", label: "Grado Noveno" },
    { value: "10", label: "Grado Décimo" },
    { value: "11", label: "Grado Undécimo" },
  ];

  const asignaturaOptions = [
    { value: "", label: "Seleccionar" },
    { value: "matematicas", label: "Matemáticas" },
    { value: "castellano", label: "Castellano" },
    { value: "sociales", label: "Sociales" },
    { value: "ciencia_naturales", label: "Ciencias Naturales" },
    { value: "tecnologia", label: "Tecnología" },
    { value: "artistica", label: "Artística" },
    { value: "educacion_fisica", label: "Educación Física" },
  ];

  // Cargar estudiantes cuando cambia el grupo
  useEffect(() => {
    if (!grupoValue) {
      setEstudiantes([]);
      setEstudiantesSeleccionados([]);
      setTodosSeleccionados(false);
      return;
    }

    const cargarEstudiantes = async () => {
      try {
        setLoading(prev => ({ ...prev, cargar: true }));
        const response = await fetch(
          `/secciones/api/estudiantes/${encodeURIComponent(grupoValue)}`
        );
        if (!response.ok)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        setEstudiantes(data.data || []);
        setEstudiantesSeleccionados([]);
        setTodosSeleccionados(false);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        setEstudiantes([]);
        setMensaje({ tipo: "error", texto: "Error al cargar los estudiantes" });
      } finally {
        setLoading(prev => ({ ...prev, cargar: false }));
      }
    };

    cargarEstudiantes();
  }, [grupoValue]);

  // Sincronizar checkbox "Todos"
  useEffect(() => {
    if (estudiantes.length > 0) {
      setTodosSeleccionados(
        estudiantesSeleccionados.length === estudiantes.length
      );
    }
  }, [estudiantesSeleccionados, estudiantes]);

  const manejarSeleccionTodos = () => {
    const nuevosSeleccionados = todosSeleccionados
      ? []
      : estudiantes.map((e) => e.student_id);
    setEstudiantesSeleccionados(nuevosSeleccionados);
  };

  const manejarSeleccionEstudiante = (studentId) => {
    setEstudiantesSeleccionados((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Función manejarAccion agregada
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

  const validarCampos = (data) => {
    const errores = [];

    if (!data.grupo) errores.push("Grupo");
    if (!data.asignatura) errores.push("Asignatura");
    if (!data.fechaInicio) errores.push("Fecha de inicio");
    if (!data.fechaFin) errores.push("Fecha de fin");
    if (!data.tema?.trim()) errores.push("Tema");
    if (!data.descripcion?.trim()) errores.push("Descripción");

    if (data.fechaInicio && data.fechaFin) {
      const fechaInicio = new Date(data.fechaInicio);
      const fechaFin = new Date(data.fechaFin);
      if (fechaFin <= fechaInicio) {
        errores.push("La fecha de fin debe ser posterior a la fecha de inicio");
      }
    }

    if (errores.length > 0) {
      setMensaje({
        tipo: "error",
        texto: `Por favor complete los siguientes campos obligatorios:\n\n• ${errores.join(
          "\n• "
        )}`,
      });
      return false;
    }

    return true;
  };

  const onSubmit = async (data) => {
    if (!validarCampos(data)) return;

    if (estudiantesSeleccionados.length === 0) {
      setMensaje({
        tipo: "error",
        texto: "Debe seleccionar al menos un estudiante para asignar la tarea.",
      });
      return;
    }

    setLoading(prev => ({ ...prev, guardar: true }));
    const formData = new FormData();
    formData.append("grupo", data.grupo);
    formData.append("asignatura", data.asignatura);
    formData.append("fecha_inicio", data.fechaInicio);
    formData.append("fecha_fin", data.fechaFin);
    formData.append("tema", data.tema.trim());
    formData.append("descripcion", data.descripcion.trim());
    formData.append("url", data.url.trim());
    formData.append("estudiantes", JSON.stringify(estudiantesSeleccionados));

    const archivo = fileInputRef.current?.files[0];
    if (archivo) {
      formData.append("archivo", archivo);
    }

    try {
      const response = await fetch("/secciones/api/enviar-tarea", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMensaje({
          tipo: "exito",
          texto: `Tarea enviada correctamente a ${estudiantesSeleccionados.length} estudiante(s)`,
        });
        limpiarFormulario();
      } else {
        throw new Error(result.message || "Error al enviar la tarea");
      }
    } catch (error) {
      console.error("Error al enviar tarea:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al enviar la tarea: " + error.message,
      });
    } finally {
      setLoading(prev => ({ ...prev, guardar: false }));
    }
  };

  const limpiarFormulario = () => {
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEstudiantes([]);
    setEstudiantesSeleccionados([]);
    setTodosSeleccionados(false);
    setMensaje({ tipo: "", texto: "" });
  };

  
   
  const handleDelete = handleSubmit((data) => manejarAccion(data, "borrar"));
  const handleSend = handleSubmit((data) => manejarAccion(data, "enviarr"));

  return (
    <>
      <NavbarDocente
        title="Asignación Tareas"
        color="#ff9800"
        icon={
          <span className="material-symbols-outlined navbars-icon">
            format_list_numbered
          </span>
        }
      />
      <div className="task-parts">
        <div className="task-left">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <SelectField
                label="Grupo:"
                id="grupo"
                register={register}
                errors={errors}
                required={true}
                validation={{ required: "Este campo es obligatorio" }}
                options={grupoOptions}
              />
              <SelectField
                label="Asignatura:"
                id="asignatura"
                register={register}
                errors={errors}
                required={true}
                validation={{ required: "Este campo es obligatorio" }}
                options={asignaturaOptions}
              />
            </div>
            <div className="form-row">
              <div className="form-group label-tasks">
                <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                <input
                  type="date"
                  id="fechaInicio"
                  className={`input-line ${
                    errors.fechaInicio ? "input-error" : ""
                  }`}
                  {...register("fechaInicio", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.fechaInicio && (
                  <span className="error-message">
                    {errors.fechaInicio.message}
                  </span>
                )}
              </div>
              <div className="form-group label-tasks ">
                <label>Fecha de Fin:</label>
                <input
                  type="date"
                  id="fechaFin"
                  className={`input-line ${
                    errors.fechaFin ? "input-error" : ""
                  }`}
                  {...register("fechaFin", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.fechaFin && (
                  <span className="error-message">
                    {errors.fechaFin.message}
                  </span>
                )}
              </div>
            </div>
            <div className="group">
              <label>Tema:</label>
              <input
                type="text"
                id="tema"
                className={`input-line ${errors.tema ? "input-error" : ""}`}
                {...register("tema", { required: "Este campo es obligatorio" })}
                placeholder="Escribe aquí..."
              />
              {errors.tema && (
                <span className="error-message">{errors.tema.message}</span>
              )}
            </div>
            <div className="form-group label-tasks">
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                className={`input-line ${
                  errors.descripcion ? "input-error" : ""
                }`}
                placeholder="Describe aquí la actividad..."
                rows="4"
                {...register("descripcion", {
                  required: "Este campo es obligatorio",
                })}
              ></textarea>
              {errors.descripcion && (
                <span className="error-message">
                  {errors.descripcion.message}
                </span>
              )}
            </div>
            <div className="form-row">
              <div className="group ">
                <label htmlFor="url">URL:</label>
                <input
                  type="url"
                  id="url"
                  className="input-line"
                  {...register("url")}
                  placeholder="https://..."
                />
              </div>
              <div className="group ">
                <label htmlFor="attached">Adjunto:</label>
                <input
                  type="file"
                  id="attached"
                  ref={fileInputRef}
                  className="input-line"
                />
              </div>
            </div>
            <ActionButtons
              onSend={handleSend}
              sendLoading={loading.send}                      
              onDelete={handleDelete}
              deleteLoading={loading.borrar}              
            />
          </form>

          {mensaje.texto && (
            <div className={`mensaje-feedback mensaje-${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}
        </div>
        <div className="task-right">
          <div className="task__students">
            <div className="task__students-title">
              <h3>
                Seleccionar Estudiantes ({estudiantesSeleccionados.length}/
                {estudiantes.length})
              </h3>
            </div>
            <div className="task__students-check">
              <label htmlFor="students">Todos</label>
              <input
                type="checkbox"
                id="students"
                checked={todosSeleccionados}
                onChange={manejarSeleccionTodos}
                disabled={estudiantes.length === 0}
              />
            </div>
          </div>

          <div className="task__students-list">
            {loading.cargar ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                Cargando estudiantes...
              </p>
            ) : estudiantes.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                {grupoValue
                  ? "No hay estudiantes en este grupo"
                  : "Selecciona un grupo para ver los estudiantes"}
              </p>
            ) : (
              estudiantes.map((estudiante) => (
                <div key={estudiante.student_id} className="student-item">
                  <label htmlFor={`student-${estudiante.student_id}`}>
                    {estudiante.nombres} {estudiante.apellidos}
                  </label>
                  <input
                    type="checkbox"
                    id={`student-${estudiante.student_id}`}
                    checked={estudiantesSeleccionados.includes(
                      estudiante.student_id
                    )}
                    onChange={() =>
                      manejarSeleccionEstudiante(estudiante.student_id)
                    }
                    className="student-checkbox"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tareas;