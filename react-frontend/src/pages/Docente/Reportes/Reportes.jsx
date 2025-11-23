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
      return;
    }

    const cargar = async () => {
      try {
        const url = new URL(
          `http://localhost:8000/api/estudiantes-por-grado/${grupo}`
        );
        url.searchParams.append("asignatura", "matematicas");
        url.searchParams.append("periodo", "1");

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
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
      }
    };

    cargar();
  }, [grupo, setValue]);

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

  /** Validación automática con React Hook Form */
  const handleReportClick = (type) => {
    handleSubmit(() => {
      console.log("Generando reporte:", type, watch());
    })();
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
              onClick={async () => {
                const data = watch();
                if (
                  !data.grupo ||
                  !data.estudiante ||
                  !data.asignatura ||
                  !data.periodo
                ) {
                  console.warn(
                    "Completa todos los campos para generar el PDF."
                  );
                  return;
                }
                setLoading((prev) => ({ ...prev, pdf: true }));
                try {
                  const res = await fetch(
                    "http://localhost:8000/api/pdf/calificaciones",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        grupo: data.grupo,
                        estudiante: data.estudiante,
                        asignatura: data.asignatura,
                        periodo: data.periodo,
                      }),
                    }
                  );
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
                    console.error(
                      "Error:",
                      err.detail || "No se pudo generar el PDF"
                    );
                  }
                } catch (e) {
                  console.error("Error de red:", e);
                } finally {
                  setLoading((prev) => ({ ...prev, pdf: false }));
                }
              }}
              bgColor="#3b82f6"
            />

            <ReporteCard
              icon="calendar_today"
              title="Asistencia"
              subtitle="Control de asistencia e inasistencias"
              onClick={() => handleReportClick("asistencia")}
              bgColor="#10b981"
            />

            <ReporteCard
              icon="assignment_turned_in"
              title="Certificado Escolar PDF"
              subtitle="Certificado escolar de estudio"
              onClick={() => handleReportClick("certificado")}
              bgColor="#9333ea"
            />

            <ReporteCard
              icon="description"
              title="Boletín de Calificaciones PDF"
              subtitle="Boletín completo con todas las materias"
              onClick={() => handleReportClick("boletin")}
              bgColor="#f59e0b"
            />

            <ReporteCard
              icon="assignment"
              title="Observador Escolar"
              subtitle="Comportamiento y observaciones"
              onClick={() => handleReportClick("conducta")}
              bgColor="#ec4899"
            />

            <ReporteCard
              icon="school"
              title="Historial Académico"
              subtitle="Registro completo de todos los periodos"
              onClick={() => handleReportClick("historial")}
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
    </div>
  );
};

export default Reportes;
