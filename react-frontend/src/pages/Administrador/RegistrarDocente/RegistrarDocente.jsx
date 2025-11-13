import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import Botones from "../../../components/ui/Botones";
import Modal from "../../../components/ui/Modal";
import TabDocenteDatos from "./TabDocenteDatos";
import TabDocenteProfesional from "./TabDocenteProfesional";
import ModalListaDocente from "./ModalListaDocente";
import "./RegistrarDocente.css";

const RegistrarDocente = () => {
  const [activeTab, setActiveTab] = useState("docente");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDocenteListModalOpen, setIsDocenteListModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      registerDate: "",
      codigo: "",
      teacherPhoto: null,
      teacherName: "",
      teacherLastname: "",
      teacherBirthDate: "",
      teacherAge: "",
      teacherGender: "",
      teacherBirthPlace: "",
      teacherDocument: "",
      teacherDocumentNumber: "",
      teacherPhone: "",
      teacherEmail: "",
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

  const mapDocenteToFrontend = (docente) => {
    return {
      id_docente: docente.id,
      registerDate: docente.registerDate || "",
      codigo: docente.codigo || "",
      teacherPhoto: docente.photo
        ? `data:image/png;base64,${docente.photo}`
        : null,
      teacherName: docente.teacherName || "",
      teacherLastname: docente.teacherLastname || "",
      teacherBirthDate: docente.teacherBirthDate || "",
      teacherAge: docente.teacherAge || "",
      teacherGender: docente.teacherGender || "",
      teacherBirthPlace: docente.teacherBirthPlace || "",
      teacherDocument: docente.teacherDocument || "",
      teacherDocumentNumber: docente.teacherDocumentNumber || "",
      teacherPhone: docente.teacherPhone || "",
      teacherEmail: docente.teacherEmail || "",
      teacherProfession: docente.teacherProfession || "",
      teacherArea: docente.teacherArea || "",
      teacherResolutionNumber: docente.teacherResolutionNumber || "",
      teacherScale: docente.teacherScale || "",
    };
  };

  const loadDocenteForEdit = (docente) => {
    const values = mapDocenteToFrontend(docente);
    reset(values);
    setActiveTab("docente");
  };

  const onSubmit = async (data) => {
    try {
      const photoBase64 = data.teacherPhoto
        ? data.teacherPhoto.split(",")[1]
        : null;

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

      const response = await fetch("http://localhost:8000/api/docentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMsg =
          error.detail?.[0]?.msg ||
          error.detail ||
          "Error desconocido al registrar docente";
        throw new Error(errorMsg);
      }

      reset();
      setActiveTab("docente");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("❌ Error al registrar docente:", error);
      setErrorMessage("No se pudo registrar el docente: " + error.message);
      setIsErrorModalOpen(true);
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
        <input type="hidden" {...register("id_docente")} />
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
            onEdit={() => setIsDocenteListModalOpen(true)}
            onDelete={handleClear}
            onLoadPDF={() => {              
              const id = getValues("id_docente");
              if (id) {
                window.open(
                  `http://localhost:8000/docente-pdf/${id}`,
                  "_blank"
                );
              } else {
                alert(
                  "No se puede generar el PDF: el docente no ha sido guardado aún."
                );
              }
            }}
            disabled={!isValid}
          />
        </div>
      </form>

      {/* Modal: campos incompletos */}
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

      {/* Modal: éxito */}
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

      {/* Modal: lista de docentes (editar) */}
      <ModalListaDocente
        isOpen={isDocenteListModalOpen}
        onClose={() => setIsDocenteListModalOpen(false)}
        onSelect={loadDocenteForEdit}
      />

      {/* Modal: error */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Error"
        message={errorMessage}
        buttons={[
          {
            text: "Cerrar",
            variant: "danger",
            onClick: () => setIsErrorModalOpen(false),
          },
        ]}
      />
    </div>
  );
};

export default RegistrarDocente;
