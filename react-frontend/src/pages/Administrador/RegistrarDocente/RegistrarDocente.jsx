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
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      // Datos básicos
      registerDate: "",
      codigo: "",
      teacherPhoto: null,
      teacherName: "",
      teacherLastname: "",
      teacherBirthDate: "",
      teacherAge: "",
      teacherGender: "",
      teacherBirthPlace: "",

      // Documento
      teacherDocument: "",
      teacherDocumentNumber: "",
      teacherPhone: "",
      teacherEmail: "",

      // Profesional
      teacherProfession: "",
      teacherArea: "",
      teacherResolutionNumber: "",
      teacherScale: "",
    },
  });

  useEffect(() => {
    const today = new Date();
    const isoDate = today.toISOString().split("T")[0];
    setValue("registerDate", isoDate, { shouldValidate: false });

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `DOC-${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(today.getDate()).padStart(
      2,
      "0"
    )}-${randomSuffix}`;
    setValue("codigo", code, { shouldValidate: false });
  }, [setValue]);

  const validateTab = async () => {
    const valid = await trigger();
    if (!valid) setIsModalOpen(true);
    return valid;
  };

  const handleTabChange = async (tab) => {
    const isValidTab = await validateTab();
    if (isValidTab) setActiveTab(tab);
  };

  const handleClear = () => {
    reset();
    setActiveTab("docente");

    const today = new Date();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `DOC-${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(today.getDate()).padStart(
      2,
      "0"
    )}-${randomSuffix}`;
    setValue("codigo", code, { shouldValidate: false });
  };
const onSubmit = async (data) => {
  try {
    // Extraer base64 si existe (el valor ya es una cadena desde PhotoUpload)
    const photoBase64 = data.teacherPhoto 
      ? data.teacherPhoto.split(",")[1] 
      : null;

    // Construir payload asegurando que todos los campos sean strings
    const payload = {
      registerDate: String(data.registerDate || ""),
      codigo: String(data.codigo || ""),
      teacherName: String(data.teacherName || ""),
      teacherLastname: String(data.teacherLastname || ""),
      teacherBirthDate: String(data.teacherBirthDate || ""),
      teacherAge: String(data.teacherAge || ""),
      teacherGender: String(data.teacherGender || ""),
      teacherBirthPlace: String(data.teacherBirthPlace || ""),
      teacherDocument: String(data.teacherDocument || ""),
      teacherDocumentNumber: String(data.teacherDocumentNumber || ""),
      teacherPhone: String(data.teacherPhone || ""),
      teacherEmail: String(data.teacherEmail || ""),
      teacherProfession: String(data.teacherProfession || ""),
      teacherArea: String(data.teacherArea || ""),
      teacherResolutionNumber: String(data.teacherResolutionNumber || ""),
      teacherScale: String(data.teacherScale || ""),
      photo: photoBase64,
    };

    // Enviar a la API
    const response = await fetch("http://localhost:8000/api/docentes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMsg =
        error.detail?.[0]?.msg || error.detail || "Error desconocido al registrar docente";
      throw new Error(errorMsg);
    }

    // Éxito
    reset();
    setActiveTab("docente");
    setIsSuccessModalOpen(true);
  } catch (error) {
    console.error("❌ Error al registrar docente:", error);
    alert("Error: " + error.message);
  }
};
  
  
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
            watch={watch}
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
            onEdit={() => alert("Editar (próximamente)")}
            onDelete={handleClear}
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
