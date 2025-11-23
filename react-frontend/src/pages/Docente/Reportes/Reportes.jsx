import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
import ReporteCard from "../../../components/ui/ReporteCard";
import { useForm } from "react-hook-form";
import { useState } from "react";

// Opciones (más adelante, podrían venir del backend)
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
  { value: "ingles", label: "Inglés" },
];

const periodoOptions = [
  { value: "", label: "Seleccionar" },
  { value: "1", label: "Periodo 1" },
  { value: "2", label: "Periodo 2" },
];

const Reportes = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { grupo: "", asignatura: "", periodo: "" },
    mode: "onBlur",
  });

  const [loading, setLoading] = useState({
    cargar: false,
    guardar: false,
    ver: false,
    pdf: false,
  });
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const handleReportClick = (type) => {
    console.log("Generando reporte:", type);
  };

  const manejarAccion = async (data, action) => {
    setMensaje({ tipo: "", texto: "" });
    setLoading((prev) => ({ ...prev, [action]: true }));

    try {
      // 🔜 Aquí irá la llamada real al backend
      // await enviarACalificacionesAPI(data, action);

      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("✅ Datos enviados:", { ...data, action });

      setMensaje({
        tipo: "exito",
        texto: `Acción "${action}" procesada correctamente.`,
      });
    } catch (error) {
      console.error("Error:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al procesar la solicitud. Inténtalo más tarde.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

 
  const handleDelete = handleSubmit((data) => manejarAccion(data, "borrar"));

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
              options={grupoOptions}
            />
            <SelectField
              label="Estudiante:"
              id="student"
              register={register}
              errors={errors}
              required
              options={asignaturaOptions}
            />
            <SelectField
              label="Periodo:"
              id="periodo"
              register={register}
              errors={errors}
              required
              options={periodoOptions}
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
              onClick={() => handleReportClick("calificaciones")}
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

          <ActionButtons
            
            onDelete={handleDelete}
            deleteLoading={loading.delete}
            deleteLabel="Borrar"
            
          />

          {mensaje.texto && (
            <div className={`mensaje-feedback mensaje-${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Reportes;
