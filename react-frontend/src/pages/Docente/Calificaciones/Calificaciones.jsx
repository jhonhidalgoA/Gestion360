import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones"; // Tu componente mejorado
import "./Calificaciones.css";
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

// 🔌 FUNCIÓN PARA CONECTAR CON EL BACKEND (descomentar cuando exista)
// const enviarACalificacionesAPI = async (data, action) => {
//   const response = await fetch("http://localhost:8000/api/calificaciones/", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ...data, action }),
//   });
//   if (!response.ok) throw new Error("Error en la API");
//   return response.json();
// };

const Calificaciones = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
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
    setLoading(prev => ({ ...prev, [action]: true }));

    try {
      // 🔜 Aquí irá la llamada real al backend
      // await enviarACalificacionesAPI(data, action);

      // ✅ Simulación
      await new Promise(resolve => setTimeout(resolve, 800));
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
      setLoading(prev => ({ ...prev, [action]: false }));
    }
  };

  // Handlers para los botones
  const handleCargar = handleSubmit((data) => manejarAccion(data, "cargar"));
  const handleGuardar = handleSubmit((data) => manejarAccion(data, "guardar"));
  const handleVer = handleSubmit((data) => manejarAccion(data, "ver"));
  

  return (
    <div className="ratings">
      <NavbarDocente
        title="Calificaciones"
        color="#2e83c5"
        icon={
          <span className="material-symbols-outlined navbars-icon">
            edit_note
          </span>
        }
      />

      <main className="ratings-container">
        <form className="ratings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="field-row">
            <SelectField
              label="Grupo:"
              id="grupo"
              register={register}
              errors={errors}
              required
              options={grupoOptions}
            />
            <SelectField
              label="Asignatura:"
              id="asignatura"
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

          {/* ✅ Usa tu ActionButtons mejorado */}
          <ActionButtons
            onLoad={handleCargar}
            loadLoading={loading.cargar}
            loadLabel="Cargar Notas"

            onSave={handleGuardar}
            saveLoading={loading.guardar}
            saveLabel="Guardar"

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

        <div className="table-header">
          <div>APELLIDOS</div>
          <div>NOMBRES</div>
          <div>NOTA 1</div>
          <div>NOTA 2</div>
          <div>NOTA 3</div>
          <div>NOTA 4</div>
          <div>NOTA 5</div>
          <div>NOTA FINAL</div>
        </div>
      </main>
    </div>
  );
};

export default Calificaciones;