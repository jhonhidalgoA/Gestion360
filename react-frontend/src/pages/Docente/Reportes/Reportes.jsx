// ---- React ----
import { useEffect, useState } from "react";
// ---- React Hook Form ----
import { useForm } from "react-hook-form";

// ---- Componentes ----
import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
import ReporteCard from "../../../components/ui/ReporteCard";
import ModalCalificaciones from "../../../components/ui/ModalCalificaciones";

const Reportes = () => {
  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      grupo: "",
      estudiante: "",
      asignatura: "",
      periodo: "",
    },
  });

  const [selectOptions, setSelectOptions] = useState({
    grupos: [{ value: "", label: "Cargando..." }],
    estudiantes: [{ value: "", label: "Seleccionar Grupo" }],
    asignaturas: [{ value: "", label: "Cargando..." }],
    periodos: [{ value: "", label: "Cargando..." }],
  });

  const [loading, setLoading] = useState({
    borrar: false,
  });

  const [modalData, setModalData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const grupo = watch("grupo");
  const asignatura = watch("asignatura");

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

  useEffect(() => {
    cargarOpciones(
      "http://localhost:8000/api/grados",
      "grupos",
      (g) => ({ value: String(g.id), label: g.nombre }),
      "Seleccionar"
    );
  }, []);

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
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
      }
    };

    cargar();
  }, [grupo, setValue, watch]);

  useEffect(() => {
    if (!grupo) {
      setSelectOptions((prev) => ({
        ...prev,
        asignaturas: [{ value: "", label: "Seleccionar" }],
      }));
      setValue("asignatura", "");
      return;
    }

    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/asignaturas");
        const data = await res.json();

        setSelectOptions((prev) => ({
          ...prev,
          asignaturas: [
            { value: "", label: "Seleccionar" },
            ...data.map((a) => ({
              value: a.nombre,
              label: a.nombre,
            })),
          ],
        }));
      } catch (error) {
        console.error("Error cargando asignaturas:", error);
        setSelectOptions((prev) => ({
          ...prev,
          asignaturas: [{ value: "", label: "Error al cargar" }],
        }));
      }
    };

    cargar();
  }, [grupo, setValue]);

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

  const handleDelete = () => {
    const data = watch();
    const { grupo, estudiante, asignatura, periodo } = data;
    const todosVacios = [grupo, estudiante, asignatura, periodo].every(
      (val) => val === ""
    );
    if (todosVacios) return;

    setLoading((prev) => ({ ...prev, borrar: true }));
    setTimeout(() => {
      limpiarFormulario();
      setLoading((prev) => ({ ...prev, borrar: false }));
    }, 800);
  };

  const handleValidateOnly = async () => {
    await trigger(["grupo", "estudiante", "asignatura", "periodo"]);
  };

  const handleCalificacionesClick = async () => {
    const isValid = await trigger([
      "grupo",
      "estudiante",
      "asignatura",
      "periodo",
    ]);
    if (!isValid) return;

    const data = watch();
    const { grupo, estudiante, asignatura, periodo } = data;

    // Normalizar SOLO para la petición al backend
    const asignaturaNormalizada = asignatura
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quita tildes
      .replace(/\s+/g, "_"); // espacios → _

    setModalOpen(true);

    try {
      const url = new URL(
        `http://localhost:8000/api/estudiantes-por-grado/${grupo}`
      );
      url.searchParams.append("asignatura", asignaturaNormalizada); // ← valor normalizado
      url.searchParams.append("periodo", periodo);

      const res = await fetch(url.toString());
      const estudiantesData = await res.json();

      const estudianteSeleccionado = estudiantesData.find(
        (e) => String(e.id) === estudiante
      );

      if (estudianteSeleccionado) {
        const resEstudiante = await fetch(
          `http://localhost:8000/api/estudiante/${estudiante}`
        );
        const datosEstudiante = await resEstudiante.json();

        const grupoSeleccionado = selectOptions.grupos.find(
          (g) => g.value === grupo
        );
        const periodoSeleccionado = selectOptions.periodos.find(
          (p) => p.value === periodo
        );

        setModalData({
          nombre: `${estudianteSeleccionado.apellidos} ${estudianteSeleccionado.nombres}`,
          documento: datosEstudiante.numero_documento || "N/A",
          grado: grupoSeleccionado?.label || "N/A",
          asignatura:
            selectOptions.asignaturas.find((a) => a.value === asignatura)
              ?.label || asignatura,
          periodo: periodoSeleccionado?.label || "N/A",
          notas: estudianteSeleccionado.notas || [],
        });
      } else {
        alert("No se encontraron datos para este estudiante.");
      }
    } catch (e) {
      console.error("Error al cargar datos:", e);
      alert("Error al cargar los datos del estudiante.");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
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
              onClick={handleCalificacionesClick}
              bgColor="#3b82f6"
            />
            <ReporteCard
              icon="calendar_today"
              title="Asistencia"
              subtitle="Control de asistencia e inasistencias"
              onClick={handleValidateOnly}
              bgColor="#10b981"
            />
            <ReporteCard
              icon="assignment_turned_in"
              title="Certificado Escolar PDF"
              subtitle="Certificado escolar de estudio"
              onClick={handleValidateOnly}
              bgColor="#9333ea"
            />
            <ReporteCard
              icon="description"
              title="Boletín de Calificaciones PDF"
              subtitle="Boletín completo con todas las materias"
              onClick={handleValidateOnly}
              bgColor="#f59e0b"
            />
            <ReporteCard
              icon="assignment"
              title="Observador Escolar"
              subtitle="Comportamiento y observaciones"
              onClick={handleValidateOnly}
              bgColor="#ec4899"
            />
            <ReporteCard
              icon="school"
              title="Historial Académico"
              subtitle="Registro completo de todos los periodos"
              onClick={handleValidateOnly}
              bgColor="#4f46e5"
            />
          </div>

          <ActionButtons
            onDelete={handleDelete}
            deleteLoading={loading.borrar}
            deleteLabel="Borrar"
          />
        </form>
      </div>

      {/* MODAL DE CALIFICACIONES */}
      <ModalCalificaciones
        isOpen={modalOpen}
        onClose={handleCloseModal}
        modalData={modalData}
      />
    </div>
  );
};

export default Reportes;