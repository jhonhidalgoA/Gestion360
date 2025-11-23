// ---- React ----
import { useEffect, useState } from "react";
// ---- React Hook Form ----
import { useForm } from "react-hook-form";

// ---- Componentes ----
import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
import ReporteCard from "../../../components/ui/ReporteCard";

const Reportes = () => {
  /** React Hook Form */
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      grupo: "",
      estudiante: "",
      asignatura: "",
      periodo: "",
    },
  });

  /** Estado unificado para selects */
  const [selectOptions, setSelectOptions] = useState({
    grupos: [{ value: "", label: "Cargando..." }],
    estudiantes: [{ value: "", label: "Seleccionar Grupo" }],
    asignaturas: [{ value: "", label: "Cargando..." }],
    periodos: [{ value: "", label: "Cargando..." }],
  });

  /** Estado para botones */
  const [loading, setLoading] = useState({
    cargar: false,
    borrar: false,
    pdf: false,
  });

  /** Estado para modal de boletín */
  const [boletinModalOpen, setBoletinModalOpen] = useState(false);
  const [boletinData, setBoletinData] = useState(null);

  /** Datos completos del estudiante (de la API) */
  const [datosEstudianteCompleto, setDatosEstudianteCompleto] = useState(null);

  /** Observadores */
  const grupo = watch("grupo");
  const asignatura = watch("asignatura");

  /** Función genérica para cargar opciones */
  const cargarOpciones = async (endpoint, campo, mapFn, placeholder) => {
    try {
      const res = await fetch(endpoint);
      const data = await res.json();

      setSelectOptions((prev) => ({
        ...prev,
        [campo]: [{ value: "", label: placeholder }, ...data.map(mapFn)],
      }));
    } catch (error) {
      console.error("Error cargando opciones:", error);
      setSelectOptions((prev) => ({
        ...prev,
        [campo]: [{ value: "", label: "Error al cargar" }],
      }));
    }
  };

  /** Cargar grupos al inicio */
  useEffect(() => {
    cargarOpciones(
      "http://localhost:8000/api/grados",
      "grupos",
      (g) => ({ value: String(g.id), label: g.nombre }),
      "Seleccionar"
    );
  }, []);

  /** Cargar estudiantes según grupo */
  useEffect(() => {
    if (!grupo) {
      setSelectOptions((prev) => ({
        ...prev,
        estudiantes: [{ value: "", label: "Seleccionar Grupo" }],
      }));
      setValue("estudiante", "");
      setDatosEstudianteCompleto(null);
      return;
    }

    const cargar = async () => {
      try {
        const url = new URL(
          `http://localhost:8000/api/estudiantes-por-grado/${grupo}`
        );
        // Usa los valores reales del formulario
        const asignaturaActual = watch("asignatura") || "matematicas";
        const periodoActual = watch("periodo") || "1";

        url.searchParams.append("asignatura", asignaturaActual);
        url.searchParams.append("periodo", periodoActual);

        const res = await fetch(url);
        const data = await res.json();

        setSelectOptions((prev) => ({
          ...prev,
          estudiantes: [
            { value: "", label: "Seleccionar Estudiante" },
            ...data.map((e) => ({
              value: String(e.id),
              label: `${e.apellidos} ${e.nombres}`,
            })),
          ],
        }));

        // Guardar los datos completos del endpoint
        setDatosEstudianteCompleto(data);
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
        setDatosEstudianteCompleto(null);
      }
    };

    cargar();
  }, [grupo, setValue, watch]);

  /** Cargar asignaturas según grupo */
  useEffect(() => {
    if (!grupo) {
      setSelectOptions((prev) => ({
        ...prev,
        asignaturas: [{ value: "", label: "Seleccionar" }],
      }));
      setValue("asignatura", "");
      return;
    }

    cargarOpciones(
      "http://localhost:8000/api/asignaturas",
      "asignaturas",
      (a) => ({ value: a.nombre, label: a.nombre }),
      "Seleccionar"
    );
  }, [grupo, setValue]);

  /** Cargar periodos según asignatura */
  useEffect(() => {
    if (!asignatura) {
      setSelectOptions((prev) => ({
        ...prev,
        periodos: [{ value: "", label: "Seleccionar" }],
      }));
      setValue("periodo", "");
      return;
    }

    cargarOpciones(
      "http://localhost:8000/api/periodos",
      "periodos",
      (p) => ({ value: String(p.id), label: p.nombre }),
      "Seleccionar"
    );
  }, [asignatura, setValue]);

  /** Limpiar formulario */
  const limpiarFormulario = () => {
    reset({
      grupo: "",
      estudiante: "",
      asignatura: "",
      periodo: "",
    });

    setSelectOptions((prev) => ({
      ...prev,
      estudiantes: [{ value: "", label: "Seleccionar Grupo" }],
      asignaturas: [{ value: "", label: "Seleccionar" }],
      periodos: [{ value: "", label: "Seleccionar" }],
    }));
  };

  /** Acción unificada (borrar) */
  const manejarAccion = async (data, action) => {
    if (action === "borrar") {
      const { grupo, estudiante, asignatura, periodo } = data;

      // Verificar si todos los campos están vacíos
      const todosVacios = [grupo, estudiante, asignatura, periodo].every(
        (val) => val === ""
      );

      if (todosVacios) {
        return; // ⬅️ NO hace nada si todos los campos están vacíos
      }

      // Si al menos uno tiene valor, activar loader
      setLoading((prev) => ({ ...prev, borrar: true }));

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        limpiarFormulario();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading((prev) => ({ ...prev, borrar: false }));
      }
    }
  };

  /** Botón borrar */
  const handleDelete = () => {
    const data = watch();
    manejarAccion(data, "borrar");
  };

  /** Generar PDF de calificaciones */
  const generarPDFCalificaciones = async (data) => {
    setLoading((prev) => ({ ...prev, pdf: true }));
    try {
      const res = await fetch("http://localhost:8000/api/pdf/calificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grupo: data.grupo,
          estudiante: data.estudiante,
          asignatura: data.asignatura,
          periodo: data.periodo,
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "calificaciones.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const err = await res.json().catch(() => ({}));
        console.error("Error:", err.detail || "No se pudo generar el PDF");
      }
    } catch (e) {
      console.error("Error de red:", e);
    } finally {
      setLoading((prev) => ({ ...prev, pdf: false }));
    }
  };

  /** Abrir modal de Boletín con datos reales */
  const abrirModalBoletin = () => {
    const data = watch();

    // Validar que los campos estén completos
    if (!data.grupo || !data.estudiante || !data.periodo) {
      console.warn("Completa todos los campos para ver el boletín.");
      return;
    }

    // Buscar al estudiante seleccionado en los datos completos
    const estudianteSeleccionado = datosEstudianteCompleto?.find(
      (e) => String(e.id) === data.estudiante
    );

    if (!estudianteSeleccionado) {
      console.warn("Estudiante no encontrado en los datos cargados.");
      return;
    }

    // Obtener el nombre del grupo (grado)
    const grupoSeleccionado = selectOptions.grupos.find(
      (g) => g.value === data.grupo
    );

    // Obtener el nombre del periodo
    const periodoSeleccionado = selectOptions.periodos.find(
      (p) => p.value === data.periodo
    );

    // Preparar datos para el modal
    setBoletinData({
      estudiante: `${estudianteSeleccionado.apellidos} ${estudianteSeleccionado.nombres}`,
      grupo: grupoSeleccionado?.label || "N/A",
      periodo: periodoSeleccionado?.label || "N/A",
      notas: [
        {
          materia: "Matemáticas",
          p1: estudianteSeleccionado.notas[0] || 0,
          p2: estudianteSeleccionado.notas[1] || 0,
          p3: estudianteSeleccionado.notas[2] || 0,
          promedio: estudianteSeleccionado.notas.slice(0, 3).reduce((a, b) => Number(a) + Number(b), 0) / 3 || 0,
        },
        // Aquí deberíamos tener todas las asignaturas, pero por ahora solo Matemáticas
      ],
      promedioGeneral: estudianteSeleccionado.notas.slice(0, 3).reduce((a, b) => Number(a) + Number(b), 0) / 3 || 0,
    });

    setBoletinModalOpen(true);
  };

  return (
    <div className="report">
      <NavbarDocente
        title="Reportes Académicos"
        color="#000080"
        icon={
          <span className="material-symbols-outlined navbars-icon">
            table_view
          </span>
        }
      />

      <div className="main-content">
        <form className="form-wrapper" onSubmit={(e) => e.preventDefault()}>
          {/* FILA DE SELECTS */}
          <div className="form-row">
            <SelectField
              label="Grupo:"
              id="grupo"
              register={register}
              errors={errors}
              required
              options={selectOptions.grupos}
            />

            <SelectField
              label="Estudiante:"
              id="estudiante"
              register={register}
              errors={errors}
              required
              options={selectOptions.estudiantes}
            />

            <SelectField
              label="Asignatura:"
              id="asignatura"
              register={register}
              errors={errors}
              required
              options={selectOptions.asignaturas}
            />

            <SelectField
              label="Periodo:"
              id="periodo"
              register={register}
              errors={errors}
              required
              options={selectOptions.periodos}
            />
          </div>

          {/* TARJETAS DE REPORTES */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            <ReporteCard
              icon="menu_book"
              title="Calificaciones"
              subtitle="Reporte notas por materia del periodo"
              onClick={handleSubmit(async (data) => {
                await generarPDFCalificaciones(data);
              })}
              bgColor="#3b82f6"
            />

            <ReporteCard
              icon="calendar_today"
              title="Asistencia"
              subtitle="Control de asistencia e inasistencias"
              onClick={() => {
                // Por ahora, solo muestra mensaje
                alert("Funcionalidad no implementada aún.");
              }}
              bgColor="#10b981"
            />

            <ReporteCard
              icon="assignment_turned_in"
              title="Certificado Escolar PDF"
              subtitle="Certificado escolar de estudio"
              onClick={() => {
                alert("Funcionalidad no implementada aún.");
              }}
              bgColor="#9333ea"
            />

            <ReporteCard
              icon="description"
              title="Boletín de Calificaciones PDF"
              subtitle="Boletín completo con todas las materias"
              onClick={abrirModalBoletin}
              bgColor="#f59e0b"
            />

            <ReporteCard
              icon="assignment"
              title="Observador Escolar"
              subtitle="Comportamiento y observaciones"
              onClick={() => {
                alert("Funcionalidad no implementada aún.");
              }}
              bgColor="#ec4899"
            />

            <ReporteCard
              icon="school"
              title="Historial Académico"
              subtitle="Registro completo de todos los periodos"
              onClick={() => {
                alert("Funcionalidad no implementada aún.");
              }}
              bgColor="#4f46e5"
            />
          </div>

          {/* BOTONES */}
          <ActionButtons
            onDelete={handleDelete}
            deleteLoading={loading.borrar}
            deleteLabel="Borrar"
          />
        </form>
      </div>

      {/* MODAL DE BOLETÍN */}
      {boletinModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <span className="material-symbols-outlined">description</span>
                Boletín de Calificaciones PDF
              </h3>
              <p>{boletinData?.estudiante} - {boletinData?.periodo}</p>
              <button onClick={() => setBoletinModalOpen(false)} className="modal-close">×</button>
            </div>

            <div className="modal-body">
              <h4>Boletín de Calificaciones</h4>
              <p><strong>Periodo:</strong> {boletinData?.periodo} - Ciclo Escolar 2024-2025</p>
              <p><strong>Estudiante:</strong> {boletinData?.estudiante}</p>
              <p><strong>Grupo:</strong> {boletinData?.grupo}</p>

              <table className="boletin-table">
                <thead>
                  <tr>
                    <th>Materia</th>
                    <th>P1</th>
                    <th>P2</th>
                    <th>P3</th>
                    <th>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {boletinData?.notas.map((n, i) => (
                    <tr key={i}>
                      <td>{n.materia}</td>
                      <td>{n.p1}</td>
                      <td>{n.p2}</td>
                      <td>{n.p3}</td>
                      <td><strong>{n.promedio.toFixed(1)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="promedio-general">
                <strong>Promedio General: {boletinData?.promedioGeneral.toFixed(1)}</strong>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => alert("Enviar por Email (no implementado)")}
                className="btn-email"
              >
                <span className="material-symbols-outlined">email</span> Enviar por Email
              </button>
              <button 
                onClick={() => window.print()}
                className="btn-print"
              >
                <span className="material-symbols-outlined">print</span> Imprimir
              </button>
              <button 
                onClick={() => {
                  // Aquí llamas a tu función de descargar PDF
                  generarPDFCalificaciones({
                    grupo: watch("grupo"),
                    estudiante: watch("estudiante"),
                    asignatura: watch("asignatura"),
                    periodo: watch("periodo"),
                  });
                  setBoletinModalOpen(false);
                }}
                className="btn-download"
              >
                <span className="material-symbols-outlined">download</span> Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;