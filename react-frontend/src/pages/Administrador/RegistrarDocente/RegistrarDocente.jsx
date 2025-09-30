import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import Botones from "../../../components/ui/Botones";
import Modal from "../../../components/ui/Modal";
import TabDocenteDatos from "./TabDocenteDatos";
import TabDocenteProfesional from "./TabDocenteProfesional";
import "./RegistrarDocente.css";

const RegistrarDocente = () => {
  const [activeTab, setActiveTab] = useState("docente");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
    setValue
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      nombre: "",
      apellidos: "",
      edad: "",
      genero: "",
      lugarNacimiento: "",
      telefono: "",
      email: "",
      tipoSangre: "",
    },
  });

  const validateTab = async () => {
    const valid = await trigger();
    if (!valid) setIsModalOpen(true);
    return valid;
  };

  const handleTabChange = async (tab) => {
    const isValidTab = await validateTab(activeTab);
    if (isValidTab) setActiveTab(tab);
  };

  const onSubmit = async (data) => {
    try {
      console.log("📌 Datos enviados del docente:", data);
      // aquí iría la llamada a la API
      reset();
      setActiveTab("docente");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("❌ Error al registrar docente:", error);
      alert("No se pudo registrar el docente.");
    }
  };

   useEffect(() => {
    const today = new Date();
    const isoDate = today.toISOString().split("T")[0];
    setValue("registerDate", isoDate, { shouldValidate: false });

    // Generar código único (ej: DOC-YYYYMMDD-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `DOC-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${randomSuffix}`;
    setValue("codigo", code, { shouldValidate: false });
  }, [setValue]);

  return (
    <div className="teacher-register">
      <NavbarSection title="Registro Docente" color="#388e3c" />

      <div className="tabs-docente">
        {["docente", "profesional"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => handleTabChange(tab)}
            type="button"
          >
            {tab === "docente" ? "Datos Docente" : "Información Profesional"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="formTeacher">
        {activeTab === "docente" && (
          <TabDocenteDatos
            register={register}
            errors={errors}
            setValue={setValue}
          />
        )}
        {activeTab === "profesional" && (
          <TabDocenteProfesional
            register={register}
            errors={errors}
            setValue={setValue}
          />
        )}

        <div className="form-actions">
          <Botones
            onSave={handleSubmit(onSubmit)}
            onEdit={() => alert("Editar")}
            onDelete={() => alert("Eliminar")}
            onGeneratePDF={() => alert("Generar PDF")}
            disabled={!isValid}
          />
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Colegio STEM 360"
        message="Por favor complete todos los campos requeridos antes de continuar."
        buttons={[
          {
            text: "Entendido",
            variant: "success",
            onClick: () => setIsModalOpen(false),
          },
        ]}
      />
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Registro Docente"
        message="¡Docente registrado con éxito!"
        buttons={[
          {
            text: "Aceptar",
            variant: "success",
            onClick: () => setIsSuccessModalOpen(false),
          },
        ]}
      />
    </div>
  );
};

export default RegistrarDocente;
