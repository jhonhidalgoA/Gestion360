import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
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

  // 🚀 Manejador de acciones
  const manejarAccion = async (data, action) => {
    setMensaje({ tipo: "", texto: "" });
    setLoading((prev) => ({ ...prev, [action]: true }));

    try {
      // 🔜 Aquí irá la llamada real al backend
      // await enviarACalificacionesAPI(data, action);

      // ✅ Simulación
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

  // Handlers para los botones
  const handleCargar = handleSubmit((data) => manejarAccion(data, "cargar"));
  const handleGuardar = handleSubmit((data) => manejarAccion(data, "guardar"));
  const handleVer = handleSubmit((data) => manejarAccion(data, "ver"));
   const handleDelete =  handleSubmit((data) => manejarAccion(data, "borrar"));

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

          <ActionButtons
            onLoad={handleCargar}
            loadLoading={loading.cargar}
            loadLabel="Cargar"
            onSave={handleGuardar}
            saveLoading={loading.guardar}
            saveLabel="Guardar"
            onDelete={handleDelete}
            deleteLoading = {loading.delete}
            onView={handleVer}
            viewLoading={loading.ver}
            viewLabel="Ver"
          />

          {mensaje.texto && (
            <div className={`mensaje-feedback mensaje-${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}
        </form>
      </div>
      
    </div>
  )
}

export default Reportes
